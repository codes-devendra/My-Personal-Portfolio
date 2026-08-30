import React from 'react';
import { motion } from 'motion/react';
import { Mic, Sparkles } from 'lucide-react';
import { AccentColor } from '../types';
import { accentThemes } from '../utils/theme';

interface VoiceFloatingButtonProps {
  onClick: () => void;
  accent: AccentColor;
}

export const VoiceFloatingButton: React.FC<VoiceFloatingButtonProps> = ({
  onClick,
  accent
}) => {
  const themeConfig = accentThemes[accent] || accentThemes.rose || accentThemes.blue;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Interactive Tooltip / Pill */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d0d0f]/90 border border-white/10 backdrop-blur-md text-xs text-white shadow-xl cursor-pointer hover:border-white/20 transition-all"
        onClick={onClick}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: themeConfig.hex }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: themeConfig.hex }}
          />
        </span>
        <span className="font-medium">Talk to AI Voice</span>
        <span className="text-[10px] font-mono uppercase text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">
          Live
        </span>
      </motion.div>

      {/* Main Floating Trigger Button */}
      <motion.button
        id="voice-assistant-launcher-btn"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative group p-4 rounded-2xl shadow-2xl text-white flex items-center justify-center cursor-pointer transition-all duration-300 border border-white/20"
        style={{
          backgroundColor: themeConfig.hex,
          boxShadow: `0 8px 30px ${themeConfig.hex}60`
        }}
        title="Start Live Gemini Voice Conversation"
      >
        {/* Ambient Ring */}
        <div
          className="absolute inset-0 rounded-2xl animate-pulse opacity-50 blur-sm -z-10"
          style={{ backgroundColor: themeConfig.hex }}
        />

        <div className="relative flex items-center justify-center">
          <Mic className="w-6 h-6" />
          <Sparkles className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-amber-300 animate-bounce" />
        </div>
      </motion.button>
    </div>
  );
};
