import { useState, useRef, useCallback, useEffect } from 'react';
import { floatTo16BitPCMBase64, pcmBase64ToAudioBuffer } from '../utils/audioUtils';

export interface LiveMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export type LiveConnectionState = 'idle' | 'connecting' | 'connected' | 'error' | 'closed';

export function useGeminiLive() {
  const [connectionState, setConnectionState] = useState<LiveConnectionState>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // AI is speaking
  const [isUserTalking, setIsUserTalking] = useState<boolean>(false);
  const [inputVolume, setInputVolume] = useState<number>(0);
  const [outputVolume, setOutputVolume] = useState<number>(0);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Contexts & WebSockets Refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);
  const isMutedRef = useRef<boolean>(false);

  // Keep isMutedRef in sync with isMuted
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Current partial transcript buffer
  const currentAssistantTranscriptRef = useRef<string>('');

  const stopAllAudioPlayback = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // already stopped
      }
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsSpeaking(false);
    setOutputVolume(0);
  }, []);

  const disconnect = useCallback(() => {
    stopAllAudioPlayback();

    // Disconnect mic audio nodes & stop tracks
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch {
        // ignore
      }
      scriptProcessorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      try {
        inputAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      try {
        outputAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    setConnectionState('closed');
    setIsUserTalking(false);
    setIsSpeaking(false);
    setInputVolume(0);
    setOutputVolume(0);
  }, [stopAllAudioPlayback]);

  const connect = useCallback(async () => {
    disconnect();
    setConnectionState('connecting');
    setErrorMessage(null);
    currentAssistantTranscriptRef.current = '';

    try {
      // 1. Request microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000
        }
      });
      mediaStreamRef.current = stream;

      // 2. Initialize Audio Contexts
      // Input context at 16kHz for Gemini Live API
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      inputAudioCtxRef.current = inputCtx;
      if (inputCtx.state === 'suspended') {
        await inputCtx.resume();
      }

      // Output context at 24kHz for model output audio
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
      outputAudioCtxRef.current = outputCtx;
      if (outputCtx.state === 'suspended') {
        await outputCtx.resume();
      }
      nextStartTimeRef.current = outputCtx.currentTime;

      // 3. Establish WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState('connected');
        console.log('[Live Hook] WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'audio' && data.audio) {
            setIsSpeaking(true);
            setOutputVolume(0.7 + Math.random() * 0.3);

            if (outputAudioCtxRef.current) {
              const ctx = outputAudioCtxRef.current;
              const buffer = pcmBase64ToAudioBuffer(ctx, data.audio, 24000);
              const source = ctx.createBufferSource();
              source.buffer = buffer;

              // Analyser for output volume
              const gainNode = ctx.createGain();
              source.connect(gainNode);
              gainNode.connect(ctx.destination);

              // Schedule audio seamlessly
              const currentTime = ctx.currentTime;
              const startTime = Math.max(nextStartTimeRef.current, currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + buffer.duration;

              activeSourcesRef.current.push(source);
              source.onended = () => {
                activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
                if (activeSourcesRef.current.length === 0) {
                  setIsSpeaking(false);
                  setOutputVolume(0);
                }
              };
            }
          } else if (data.type === 'interrupted') {
            console.log('[Live Hook] Model speech was interrupted');
            stopAllAudioPlayback();
          } else if (data.type === 'text' && data.text) {
            currentAssistantTranscriptRef.current += data.text;
            const fullText = currentAssistantTranscriptRef.current;

            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: fullText }
                ];
              } else {
                return [
                  ...prev,
                  {
                    id: String(Date.now()),
                    sender: 'assistant',
                    text: fullText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ];
              }
            });
          } else if (data.type === 'turnComplete') {
            currentAssistantTranscriptRef.current = '';
          } else if (data.type === 'error') {
            console.error('[Live Hook] Server error:', data.message);
            setErrorMessage(data.message);
          }
        } catch (err) {
          console.error('[Live Hook] Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('[Live Hook] WebSocket error:', err);
        setErrorMessage('Connection error with the voice server.');
        setConnectionState('error');
      };

      ws.onclose = () => {
        console.log('[Live Hook] WebSocket closed');
        setConnectionState('closed');
      };

      // 4. Connect Microphone Input Stream to ScriptProcessor
      const micSource = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) {
          setInputVolume(0);
          setIsUserTalking(false);
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);

        // Compute volume / RMS for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const normVol = Math.min(1, rms * 5);
        setInputVolume(normVol);
        setIsUserTalking(normVol > 0.08);

        // Send base64 audio over WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const base64Pcm = floatTo16BitPCMBase64(inputData);
          wsRef.current.send(
            JSON.stringify({
              type: 'audio',
              audio: base64Pcm
            })
          );
        }
      };

      micSource.connect(processor);
      processor.connect(inputCtx.destination);

    } catch (err: any) {
      console.error('[Live Hook] Failed to start live session:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access in your browser.'
          : err.message || 'Failed to start live session'
      );
      setConnectionState('error');
    }
  }, [disconnect, stopAllAudioPlayback]);

  const sendTextMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'text',
          text: text.trim()
        })
      );

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: 'user',
          text: text.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    isMuted,
    isSpeaking,
    isUserTalking,
    inputVolume,
    outputVolume,
    messages,
    errorMessage,
    connect,
    disconnect,
    toggleMute,
    sendTextMessage
  };
}
