import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Volume2,
  Send,
  X,
  Radio,
  RefreshCw,
  MessageSquare,
  Bot,
  User,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { AccentColor, ThemeMode } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  accent,
  themeMode
}) => {
  const {
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
  } = useGeminiLive();

  const [textInput, setTextInput] = useState('');
  const [showTranscript, setShowTranscript] = useState(true);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-connect when modal opens
  useEffect(() => {
    if (isOpen && connectionState === 'idle') {
      connect();
    }
  }, [isOpen, connectionState, connect]);

  // Auto scroll transcript
  useEffect(() => {
    if (showTranscript) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showTranscript]);

  const handleClose = () => {
    disconnect();
    onClose();
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendTextMessage(textInput.trim());
      setTextInput('');
    }
  };

  const samplePrompts = [
    'Tell me about your background and engineering experience',
    'What projects are you most proud of in this portfolio?',
    'What is your expertise with React, TypeScript and Firebase?',
    'Are you available for contract or full-time roles?'
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#0d0d0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center relative shadow-lg"
                style={{ backgroundColor: `${accent.hex}20`, color: accent.hex }}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                {connectionState === 'connected' && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0d0d0f]"
                    style={{ backgroundColor: '#22c55e' }}
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-base">
                    Gemini Live Voice Assistant
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Live Preview
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Real-time two-way audio powered by <code className="font-mono text-zinc-300">gemini-3.1-flash-live-preview</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTranscript((prev) => !prev)}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors border ${
                  showTranscript
                    ? 'bg-white/10 text-white border-white/20'
                    : 'text-zinc-400 hover:text-white border-transparent hover:bg-white/5'
                }`}
                title="Toggle transcript"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Transcript</span>
              </button>

              <button
                onClick={handleClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Visualizer & Live Status Area */}
          <div className="p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px] bg-gradient-to-b from-white/[0.02] to-transparent">
            {/* Ambient background glow */}
            <div
              className="absolute w-72 h-72 rounded-full blur-3xl -z-0 opacity-20 pointer-events-none transition-all duration-700"
              style={{
                backgroundColor: isSpeaking
                  ? accent.hex
                  : isUserTalking
                  ? '#3b82f6'
                  : `${accent.hex}40`,
                transform: `scale(${1 + (isSpeaking ? outputVolume : inputVolume) * 1.2})`
              }}
            />

            {/* Connection States */}
            {connectionState === 'connecting' && (
              <div className="flex flex-col items-center text-center gap-3 py-6">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-white">Connecting to Gemini Live API...</p>
                  <p className="text-xs text-zinc-500 mt-1">Initializing 16kHz audio input & 24kHz stream</p>
                </div>
              </div>
            )}

            {connectionState === 'error' && (
              <div className="flex flex-col items-center text-center gap-3 py-4 max-w-md">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-400">Connection Error</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {errorMessage || 'Unable to connect to the Gemini Live session.'}
                  </p>
                </div>
                <button
                  onClick={connect}
                  className="mt-2 px-4 py-2 text-xs font-medium text-white rounded-lg transition-all shadow-md flex items-center gap-2"
                  style={{ backgroundColor: accent.hex }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            )}

            {connectionState === 'closed' && (
              <div className="flex flex-col items-center text-center gap-3 py-6">
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center">
                  <PhoneOff className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Call Ended</p>
                  <p className="text-xs text-zinc-500 mt-1">Voice session has been closed</p>
                </div>
                <button
                  onClick={connect}
                  className="mt-2 px-4 py-2 text-xs font-medium text-white rounded-lg transition-all shadow-md flex items-center gap-2"
                  style={{ backgroundColor: accent.hex }}
                >
                  <Radio className="w-3.5 h-3.5" />
                  Start New Call
                </button>
              </div>
            )}

            {connectionState === 'connected' && (
              <div className="flex flex-col items-center text-center gap-5 w-full">
                {/* Central Dynamic Audio Orb Visualizer */}
                <div className="relative flex items-center justify-center my-2">
                  {/* Ripple Rings */}
                  {(isSpeaking || isUserTalking) && (
                    <>
                      <motion.div
                        className="absolute rounded-full border opacity-40 pointer-events-none"
                        style={{
                          borderColor: isSpeaking ? accent.hex : '#3b82f6',
                          width: '140px',
                          height: '140px'
                        }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.4, 0.1, 0.4]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.8,
                          ease: 'easeInOut'
                        }}
                      />
                      <motion.div
                        className="absolute rounded-full border opacity-20 pointer-events-none"
                        style={{
                          borderColor: isSpeaking ? accent.hex : '#3b82f6',
                          width: '180px',
                          height: '180px'
                        }}
                        animate={{
                          scale: [1, 1.6, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.4,
                          ease: 'easeInOut',
                          delay: 0.4
                        }}
                      />
                    </>
                  )}

                  {/* Core Interactive Orb */}
                  <motion.div
                    animate={{
                      scale: isSpeaking
                        ? 1 + outputVolume * 0.4
                        : isUserTalking
                        ? 1 + inputVolume * 0.4
                        : 1
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl relative z-10 transition-colors duration-300"
                    style={{
                      background: isSpeaking
                        ? `radial-gradient(circle, ${accent.hex} 0%, #1e1b4b 100%)`
                        : isUserTalking
                        ? 'radial-gradient(circle, #3b82f6 0%, #172554 100%)'
                        : 'radial-gradient(circle, #27272a 0%, #09090b 100%)',
                      boxShadow: isSpeaking
                        ? `0 0 35px ${accent.hex}80`
                        : isUserTalking
                        ? '0 0 35px #3b82f680'
                        : '0 0 15px rgba(0,0,0,0.5)'
                    }}
                  >
                    {isSpeaking ? (
                      <Volume2 className="w-10 h-10 text-white animate-pulse" />
                    ) : isMuted ? (
                      <MicOff className="w-8 h-8 text-zinc-500" />
                    ) : (
                      <Mic
                        className={`w-8 h-8 ${
                          isUserTalking ? 'text-white' : 'text-zinc-400'
                        }`}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Status indicator bar */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSpeaking
                          ? 'bg-amber-400 animate-ping'
                          : isUserTalking
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-zinc-500'
                      }`}
                    />
                    <span className="font-medium text-zinc-200">
                      {isSpeaking
                        ? 'Gemini Live is speaking...'
                        : isUserTalking
                        ? 'Listening to you...'
                        : isMuted
                        ? 'Microphone muted'
                        : 'Listening... (Speak naturally)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Low-latency full-duplex voice streaming
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Transcript / Conversation History Area */}
          {showTranscript && (
            <div className="flex-1 border-t border-b border-white/10 bg-black/40 p-4 overflow-y-auto max-h-[220px] space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs flex flex-col items-center gap-2">
                  <Bot className="w-6 h-6 text-zinc-600" />
                  <span>Start speaking or ask a question to begin the live conversation.</span>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-2 max-w-md">
                    {samplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendTextMessage(prompt)}
                        className="px-2.5 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-zinc-300 rounded-full border border-white/10 transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 text-xs ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${accent.hex}25`, color: accent.hex }}
                      >
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`px-3 py-2 rounded-xl max-w-[80%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600/30 text-blue-100 border border-blue-500/30 rounded-tr-none'
                          : 'bg-white/5 text-zinc-200 border border-white/10 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold opacity-70">
                          {msg.sender === 'user' ? 'You' : 'Gemini Voice'}
                        </span>
                        <span className="text-[9px] opacity-40 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          )}

          {/* Action Bar & Controls */}
          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3">
            {/* Text Message Fallback Input */}
            <form onSubmit={handleSendText} className="flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type a question for voice response..."
                disabled={connectionState !== 'connected'}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || connectionState !== 'connected'}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-xl transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Voice Control Buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  disabled={connectionState !== 'connected'}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    isMuted
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                  } disabled:opacity-40`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 px-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time voice pipeline active</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {connectionState === 'connected' ? (
                  <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Voice Session</span>
                  </button>
                ) : (
                  <button
                    onClick={connect}
                    className="px-4 py-2 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-md"
                    style={{ backgroundColor: accent.hex }}
                  >
                    <Radio className="w-4 h-4" />
                    <span>Connect Live</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
