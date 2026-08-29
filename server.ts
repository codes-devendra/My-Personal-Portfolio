import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup WebSocket Server for Gemini Live API Voice Conversations
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  if (url.pathname === '/ws/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    // Other upgrade requests (e.g. Vite HMR if any)
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Live API] Client connected to Voice Assistant WebSocket');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Live API] GEMINI_API_KEY environment variable is not configured');
    clientWs.send(JSON.stringify({
      type: 'error',
      message: 'GEMINI_API_KEY is not configured on the server. Please configure it in AI Studio settings.'
    }));
    clientWs.close();
    return;
  }

  let session: any = null;
  let isClosed = false;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    session = await ai.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' }
          }
        },
        systemInstruction: `You are the interactive AI Voice Assistant and technical representative for this portfolio website. 
You speak naturally, warmly, concisely, and articulately.
You know everything about the developer/designer:
- Engineering expertise: React, TypeScript, Node.js, Express, Python, Tailwind CSS, Firebase Firestore, Google Cloud, AI Integrations, WebSockets.
- Portfolio projects: High-performance web applications, cloud architectures, AI tools, developer platforms, and user interfaces.
- Work history: Senior Full-Stack Engineer, Lead Architect, Open Source Contributor.
- Services provided: Custom Full-Stack Web Development, Architecture Consultation, AI Integration & Workflows, Performance Optimization.
- Availability: Open for select freelance contracts, high-impact consulting, and engineering leadership opportunities.

When visitors speak to you, respond in real-time with helpful, engaging, and brief conversational answers (1-3 sentences per turn unless they ask for detailed explanations). Welcome them warmly!`,
        outputAudioTranscription: {},
        inputAudioTranscription: {}
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

          // 1. Audio data chunks
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }

          // 2. Interruption from user
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }

          // 3. Transcription & text feedback
          const parts = message.serverContent?.modelTurn?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.text) {
                clientWs.send(JSON.stringify({ type: 'text', text: part.text }));
              }
            }
          }

          // 4. Turn completion
          if (message.serverContent?.turnComplete) {
            clientWs.send(JSON.stringify({ type: 'turnComplete' }));
          }
        },
        onclose: () => {
          console.log('[Live API] Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          }
        },
        onerror: (err: any) => {
          console.error('[Live API] Gemini Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({
              type: 'error',
              message: err?.message || 'Error communicating with Gemini Live API'
            }));
          }
        }
      }
    });

    clientWs.send(JSON.stringify({ type: 'ready', message: 'Connected to Gemini Live' }));

  } catch (err: any) {
    console.error('[Live API] Failed to connect to Gemini Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({
        type: 'error',
        message: err?.message || 'Failed to initialize Gemini Live session'
      }));
    }
    return;
  }

  // Handle incoming messages from browser
  clientWs.on('message', (rawData) => {
    if (!session) return;
    try {
      const data = JSON.parse(rawData.toString());
      if (data.type === 'audio' && data.audio) {
        session.sendRealtimeInput({
          audio: {
            data: data.audio,
            mimeType: 'audio/pcm;rate=16000'
          }
        });
      } else if (data.type === 'text' && data.text) {
        session.sendRealtimeInput({
          text: data.text
        });
      }
    } catch (parseErr) {
      console.error('[Live API] Error handling client message:', parseErr);
    }
  });

  clientWs.on('close', () => {
    isClosed = true;
    console.log('[Live API] Client disconnected from WebSocket');
    try {
      if (session && typeof session.close === 'function') {
        session.close();
      }
    } catch (closeErr) {
      console.warn('[Live API] Error closing session:', closeErr);
    }
  });

  clientWs.on('error', (err) => {
    console.error('[Live API] Client WebSocket error:', err);
  });
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
