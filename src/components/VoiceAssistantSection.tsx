import React from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  Sparkles,
  Radio,
  Zap,
  Volume2,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface VoiceAssistantSectionProps {
  onOpenVoiceAssistant: () => void;
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const VoiceAssistantSection: React.FC<VoiceAssistantSectionProps> = ({
  onOpenVoiceAssistant,
  accent,
  themeMode
}) => {
  const themeConfig = accentThemes[accent];

  const capabilities = [
    {
      icon: Radio,
      title: 'Full-Duplex Streaming',
      description: 'Zero-latency bidirectional audio streaming at 16kHz input & 24kHz output over WebSockets.'
    },
    {
      icon: Zap,
      title: 'Gemini Live Preview',
      description: 'Powered by gemini-3.1-flash-live-preview for natural, human-like voice conversations.'
    },
    {
      icon: MessageSquare,
      title: 'Contextual Representation',
      description: 'Trained on this portfolio’s exact skills, architectural case studies, and engineering background.'
    },
    {
      icon: Volume2,
      title: 'Interruption Handling',
      description: 'Cut in and speak at any time — model audio pauses immediately when you start talking.'
    }
  ];

  const suggestedQuestions = [
    '“Can you summarize your engineering background and core tech stack?”',
    '“What architectural patterns were used in your featured projects?”',
    '“Are you available for freelance consulting or technical leadership?”',
    '“What makes this portfolio’s system design and tech stack special?”'
  ];

  return (
    <section id="voice-assistant" className="py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ backgroundColor: accent.hex }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive AI Feature</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
            <span className={themeMode === 'light' ? 'text-zinc-900' : 'text-white'}>
              Talk with the{' '}
            </span>
            <span className={`bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
              AI Voice Assistant
            </span>
          </h2>
          <p className={`text-base max-w-2xl ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
            Have an open-ended, real-time voice conversation with an AI representative powered by Gemini Live API. Ask questions, explore projects, or discuss engineering architecture out loud.
          </p>
        </div>

        {/* Showcase Banner Box */}
        <div
          className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden transition-all shadow-2xl ${
            themeMode === 'light'
              ? 'bg-gradient-to-b from-white to-slate-50 border-slate-200'
              : 'bg-gradient-to-b from-[#111115] to-[#09090c] border-[#27272a]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: accent.hex }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-3 w-3"
                    style={{ backgroundColor: accent.hex }}
                  />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Live Audio Pipeline Ready
                </span>
              </div>

              <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                Speak naturally with sub-second response times.
              </h3>

              <p className={`text-sm leading-relaxed ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
                Experience seamless two-way voice communication with speech synthesis and microphone streaming directly in your browser. No typing required.
              </p>

              {/* Sample Prompts */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa]">
                  Try asking questions like:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-colors flex items-start gap-2 ${
                        themeMode === 'light'
                          ? 'bg-slate-100/70 border-slate-200 text-zinc-800'
                          : 'bg-white/[0.03] border-white/5 text-zinc-300'
                      }`}
                    >
                      <Headphones className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Launcher */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  id="section-start-voice-btn"
                  onClick={onOpenVoiceAssistant}
                  className="px-7 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center gap-2.5 shadow-xl hover:opacity-95 transition-all transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: accent.hex,
                    boxShadow: `0 10px 30px ${accent.hex}40`
                  }}
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Live Voice Conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-[#a1a1aa]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Mic access requested only upon launch</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card / Visualizer Graphic */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div
                onClick={onOpenVoiceAssistant}
                className={`w-full max-w-sm rounded-2xl p-6 border text-center cursor-pointer group transition-all duration-300 hover:scale-[1.02] ${
                  themeMode === 'light'
                    ? 'bg-white border-slate-200 shadow-xl'
                    : 'bg-[#0a0a0d] border-white/10 shadow-2xl hover:border-white/20'
                }`}
              >
                {/* Visualizer Animation */}
                <div className="h-32 flex items-center justify-center relative mb-4">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl relative z-10 transition-transform group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle, ${accent.hex} 0%, #1e1b4b 100%)`,
                      boxShadow: `0 0 30px ${accent.hex}60`
                    }}
                  >
                    <Mic className="w-10 h-10 text-white" />
                  </div>

                  {/* Animated Waveform bars */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-60">
                    {[40, 70, 95, 60, 85, 45, 90, 65, 35].map((height, idx) => (
                      <motion.div
                        key={idx}
                        className="w-1 rounded-full"
                        style={{ backgroundColor: accent.hex }}
                        animate={{ height: [`${height * 0.4}%`, `${height}%`, `${height * 0.4}%`] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2 + idx * 0.1,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <h4 className={`text-base font-bold mb-1 ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                  Gemini 3.1 Flash Live
                </h4>
                <p className="text-xs text-[#a1a1aa] mb-4">
                  Click to open voice session and speak directly
                </p>

                <div
                  className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-white shadow-md transition-opacity"
                  style={{ backgroundColor: `${accent.hex}dd` }}
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Launch Voice Mode</span>
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <h5 className={`text-xs font-bold ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                      {cap.title}
                    </h5>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
