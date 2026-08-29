import React, { useState, useEffect } from 'react';
import { 
  X, Save, RotateCcw, Sliders, Check, 
  Palette, Sun, Moon, Clock, Globe, Sparkles 
} from 'lucide-react';
import { ProfileData, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface LiveEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSaveProfile: (newProfile: ProfileData) => void;
  onResetDefault: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const COMMON_TIMEZONES = [
  { label: 'UTC (Coordinated Universal Time)', value: 'UTC', offset: 'UTC+0' },
  { label: 'US Pacific (Los Angeles, SF)', value: 'America/Los_Angeles', offset: 'UTC-8 / PST' },
  { label: 'US Eastern (New York, Boston)', value: 'America/New_York', offset: 'UTC-5 / EST' },
  { label: 'US Central (Chicago, Austin)', value: 'America/Chicago', offset: 'UTC-6 / CST' },
  { label: 'Europe (London, Dublin)', value: 'Europe/London', offset: 'UTC+0 / GMT' },
  { label: 'Europe (Paris, Berlin, Amsterdam)', value: 'Europe/Paris', offset: 'UTC+1 / CET' },
  { label: 'Middle East (Dubai, UAE)', value: 'Asia/Dubai', offset: 'UTC+4 / GST' },
  { label: 'India (New Delhi, Bangalore)', value: 'Asia/Kolkata', offset: 'UTC+5:30 / IST' },
  { label: 'Asia (Singapore, Hong Kong)', value: 'Asia/Singapore', offset: 'UTC+8 / SGT' },
  { label: 'Japan (Tokyo, Osaka)', value: 'Asia/Tokyo', offset: 'UTC+9 / JST' },
  { label: 'Australia (Sydney, Melbourne)', value: 'Australia/Sydney', offset: 'UTC+10 / AEST' }
];

export const LiveEditorModal: React.FC<LiveEditorModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetDefault,
  accent,
  setAccent,
  themeMode,
  setThemeMode
}) => {
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>(accent);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [selectedTimezone, setSelectedTimezone] = useState<string>(profile.timezone || 'America/New_York (EST)');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAccent(accent);
      setSelectedTheme(themeMode);
      setSelectedTimezone(profile.timezone || 'America/New_York (EST)');
    }
  }, [isOpen, accent, themeMode, profile.timezone]);

  // Live clock calculation based on chosen timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        // Try extracting standard IANA identifier if present
        let tz = selectedTimezone.trim();
        const match = selectedTimezone.match(/^[A-Za-z_-]+\/[A-Za-z_-]+/);
        if (match) {
          tz = match[0];
        } else if (tz.toUpperCase() === 'UTC') {
          tz = 'UTC';
        }

        const now = new Date();
        const formattedTime = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }).format(now);

        setCurrentTimeStr(formattedTime);
      } catch {
        // Fallback for custom or non-standard offset strings
        setCurrentTimeStr(new Date().toLocaleTimeString('en-US', { hour12: true }) + ' (Local)');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  const themeConfig = accentThemes[selectedAccent] || accentThemes[accent];
  const accents: AccentColor[] = ['blue', 'indigo', 'emerald', 'cyan', 'rose', 'amber', 'violet'];

  if (!isOpen) return null;

  const handleApply = () => {
    setAccent(selectedAccent);
    setThemeMode(selectedTheme);
    onSaveProfile({
      ...profile,
      timezone: selectedTimezone
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setSelectedAccent('blue');
    setSelectedTheme('dark');
    setSelectedTimezone('America/New_York (EST)');
    onResetDefault();
    onClose();
  };

  return (
    <div 
      id="customizer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          selectedTheme === 'light'
            ? 'bg-white border-zinc-200 text-zinc-900'
            : 'bg-[#0f0f13] border-zinc-800 text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
          selectedTheme === 'light'
            ? 'bg-white/95 border-zinc-200'
            : 'bg-[#0f0f13]/95 border-zinc-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: themeConfig.hex }}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-display font-bold text-base tracking-tight ${selectedTheme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                Appearance & Timezone
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Customize accent color, theme appearance, and active timezone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              selectedTheme === 'light'
                ? 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-6 text-sm">
          
          {/* 1. Accent Color Palette */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            selectedTheme === 'light' ? 'bg-zinc-50/80 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
          }`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                <span>1. Accent Colour</span>
              </label>
              <span 
                className="text-xs font-mono font-medium px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${themeConfig.hex}20`, color: themeConfig.hex }}
              >
                {themeConfig.name}
              </span>
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {accents.map((c) => {
                const conf = accentThemes[c];
                const isSelected = selectedAccent === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedAccent(c)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? selectedTheme === 'light'
                          ? 'border-zinc-900 bg-white shadow-md'
                          : 'border-white/40 bg-zinc-900 shadow-lg'
                        : selectedTheme === 'light'
                          ? 'border-zinc-200 hover:bg-white/60 bg-white/40'
                          : 'border-zinc-800/80 hover:bg-zinc-900/60 bg-zinc-900/20'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: conf.hex }}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <div className="truncate">
                      <div className={`text-xs font-medium truncate ${selectedTheme === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {conf.hex}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Theme Mode Selection */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            selectedTheme === 'light' ? 'bg-zinc-50/80 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
          }`}>
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Theme Appearance</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Dark Theme Option */}
              <button
                type="button"
                onClick={() => setSelectedTheme('dark')}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  selectedTheme === 'dark'
                    ? 'border-blue-500 bg-blue-500/10 text-white shadow-md'
                    : selectedTheme === 'light'
                      ? 'border-zinc-200 bg-white/60 text-zinc-600 hover:bg-white'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-blue-400 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold font-display">Dark Theme</div>
                  <div className="text-[11px] text-zinc-400 font-mono">Modern dark canvas</div>
                </div>
                {selectedTheme === 'dark' && (
                  <Check className="w-4 h-4 text-blue-400 ml-auto" />
                )}
              </button>

              {/* Light Theme Option */}
              <button
                type="button"
                onClick={() => setSelectedTheme('light')}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  selectedTheme === 'light'
                    ? 'border-blue-500 bg-blue-500/10 text-zinc-900 shadow-md'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold font-display">Light Theme</div>
                  <div className="text-[11px] text-zinc-400 font-mono">Clean crisp daylight</div>
                </div>
                {selectedTheme === 'light' && (
                  <Check className="w-4 h-4 text-blue-500 ml-auto" />
                )}
              </button>
            </div>
          </div>

          {/* 3. Timezone Customizer & Live Clock */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            selectedTheme === 'light' ? 'bg-zinc-50/80 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
          }`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Timezone & Local Time</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3" />
                <span>Live Clock</span>
              </div>
            </div>

            {/* Live Clock Preview Banner */}
            <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              selectedTheme === 'light'
                ? 'bg-white border-zinc-200 shadow-xs'
                : 'bg-zinc-900/90 border-zinc-800 shadow-inner'
            }`}>
              <div>
                <div className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
                  Current Time in Selected Timezone:
                </div>
                <div className={`text-base font-bold font-mono tracking-tight mt-0.5 ${
                  selectedTheme === 'light' ? 'text-zinc-900' : 'text-white'
                }`}>
                  {currentTimeStr || 'Loading time...'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {selectedTimezone}
                </span>
              </div>
            </div>

            {/* Quick Regional Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400">Quick Regional Presets:</span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {COMMON_TIMEZONES.map((tz) => {
                  const isMatch = selectedTimezone.includes(tz.value) || selectedTimezone === tz.offset;
                  return (
                    <button
                      key={tz.value}
                      type="button"
                      onClick={() => setSelectedTimezone(`${tz.value} (${tz.offset.split('/')[0].trim()})`)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors border text-left ${
                        isMatch
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold'
                          : selectedTheme === 'light'
                            ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      {tz.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input Field */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-mono text-zinc-400">Custom Timezone String / Label</label>
              <input
                type="text"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                placeholder="e.g. America/New_York (EST) or UTC+2"
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border focus:outline-hidden transition-colors ${
                  selectedTheme === 'light'
                    ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                }`}
              />
              <p className="text-[11px] text-zinc-500 leading-normal">
                This timezone string is displayed in the hero status bar, the contact section, and schedule availability chips.
              </p>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className={`sticky bottom-0 px-6 py-4 border-t flex items-center justify-between backdrop-blur-md ${
          selectedTheme === 'light'
            ? 'bg-white/95 border-zinc-200'
            : 'bg-[#0f0f13]/95 border-zinc-800'
        }`}>
          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border ${
              selectedTheme === 'light'
                ? 'text-zinc-600 hover:text-zinc-900 border-zinc-200 hover:bg-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                selectedTheme === 'light'
                  ? 'text-zinc-600 hover:text-zinc-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cancel
            </button>
            <button
              id="btn-save-customizer"
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold shadow-md text-white transition-transform hover:opacity-95"
              style={{ backgroundColor: themeConfig.hex }}
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Applied!' : 'Apply Customizations'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
