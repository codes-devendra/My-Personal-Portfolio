import React, { useState, useEffect } from 'react';
import { 
  X, Save, RotateCcw, Sliders, Check, 
  Palette, Sun, Moon, Clock, Globe,
  User, Mail, MapPin, Briefcase, Link2, Github, Linkedin, Twitter,
  Image as ImageIcon, Calendar, Lock, Unlock, KeyRound, Shield, Eye, EyeOff, ShieldAlert
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
  isOwnerUser?: boolean;
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

type EditorTab = 'profile' | 'bio' | 'socials' | 'theme' | 'timezone' | 'security';

// Owner master passwords
const VALID_PASSWORDS = ['devendra2026', 'owner2026', 'admin2026', 'shobha2026'];

export const LiveEditorModal: React.FC<LiveEditorModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetDefault,
  accent,
  setAccent,
  themeMode,
  setThemeMode,
  isOwnerUser = false
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>(accent);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Password Protection State
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('portfolio_owner_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setSelectedAccent(accent);
      setSelectedTheme(themeMode);
      setPasswordError(null);
      try {
        if (sessionStorage.getItem('portfolio_owner_unlocked') === 'true') {
          setIsOwnerUnlocked(true);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen, profile, accent, themeMode]);

  // Live clock calculation based on chosen timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        let tz = (formData.timezone || 'UTC').trim();
        const match = tz.match(/^[A-Za-z_-]+\/[A-Za-z_-]+/);
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
        setCurrentTimeStr(new Date().toLocaleTimeString('en-US', { hour12: true }) + ' (Local)');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [formData.timezone]);

  const themeConfig = accentThemes[selectedAccent] || accentThemes[accent];
  const accents: AccentColor[] = ['blue', 'indigo', 'emerald', 'cyan', 'rose', 'amber', 'violet'];

  if (!isOpen) return null;

  const handleChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (network: 'github' | 'linkedin' | 'twitter' | 'cal', value: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [network]: value,
        email: prev.email ? `mailto:${prev.email}` : prev.socials?.email
      }
    }));
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPassword = enteredPassword.trim().toLowerCase();
    
    if (VALID_PASSWORDS.includes(cleanPassword)) {
      setIsOwnerUnlocked(true);
      setPasswordError(null);
      setEnteredPassword('');
      try {
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      } catch {
        // ignore
      }
    } else {
      setPasswordError('Incorrect owner password. Please enter the correct password.');
    }
  };

  const handleLock = () => {
    setIsOwnerUnlocked(false);
    try {
      sessionStorage.removeItem('portfolio_owner_unlocked');
    } catch {
      // ignore
    }
  };

  const handleApply = () => {
    setAccent(selectedAccent);
    setThemeMode(selectedTheme);
    const updatedProfile: ProfileData = {
      ...formData,
      socials: {
        ...formData.socials,
        email: formData.email ? `mailto:${formData.email}` : formData.socials?.email
      }
    };
    onSaveProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setSelectedAccent('blue');
    setSelectedTheme('dark');
    onResetDefault();
    onClose();
  };

  const protectedTabs: EditorTab[] = ['profile', 'bio', 'socials', 'security'];
  const isCurrentTabProtected = protectedTabs.includes(activeTab);

  const tabs: { id: EditorTab; label: string; icon: React.FC<{ className?: string }>; protected?: boolean; ownerOnly?: boolean }[] = [
    { id: 'profile', label: 'Profile Info', icon: User, protected: true },
    { id: 'bio', label: 'Bio & Stats', icon: Briefcase, protected: true },
    { id: 'socials', label: 'Socials & Links', icon: Link2, protected: true },
    { id: 'theme', label: 'Color & Theme', icon: Palette, protected: false },
    { id: 'timezone', label: 'Timezone', icon: Clock, protected: false },
    ...(isOwnerUnlocked ? [{ id: 'security' as EditorTab, label: 'Owner Key', icon: Shield, protected: true, ownerOnly: true }] : [])
  ];

  return (
    <div 
      id="customizer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl transition-all overflow-hidden ${
          selectedTheme === 'light'
            ? 'bg-white border-zinc-200 text-zinc-900'
            : 'bg-[#0f0f13] border-zinc-800 text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`shrink-0 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
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
              <div className="flex items-center gap-2">
                <h3 className={`font-display font-bold text-base tracking-tight ${selectedTheme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                  Portfolio Customizer
                </h3>
                {isOwnerUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Unlock className="w-3 h-3" />
                    <span>Owner Mode</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Lock className="w-3 h-3" />
                    <span>Owner Protected</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Appearance is open to all visitors • Profile, bio, and social links are owner-locked
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

        {/* Tab Navigation */}
        <div className={`shrink-0 px-6 pt-3 pb-0 border-b flex gap-1 overflow-x-auto ${
          selectedTheme === 'light' ? 'border-zinc-200 bg-zinc-50/60' : 'border-zinc-800/80 bg-zinc-950/40'
        }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isTabLocked = tab.protected && !isOwnerUnlocked;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPasswordError(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-t-xl border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? selectedTheme === 'light'
                      ? 'border-blue-600 text-blue-600 bg-white shadow-xs font-semibold'
                      : 'border-white text-white bg-zinc-900/90 font-semibold'
                    : selectedTheme === 'light'
                      ? 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-white/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.protected && (
                  isOwnerUnlocked ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  ) : (
                    <Lock className="w-3 h-3 text-amber-400/80 ml-0.5" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Content Form Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          
          {/* PASSWORD LOCK BARRIER FOR PROTECTED TABS */}
          {isCurrentTabProtected && !isOwnerUnlocked ? (
            <div className={`p-6 sm:p-8 rounded-2xl border text-center flex flex-col items-center justify-center space-y-5 ${
              selectedTheme === 'light'
                ? 'bg-zinc-50/80 border-zinc-200'
                : 'bg-zinc-950/60 border-zinc-800'
            }`}>
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg relative"
                style={{ backgroundColor: themeConfig.hex }}
              >
                <Lock className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#0f0f13] flex items-center justify-center">
                  <KeyRound className="w-2.5 h-2.5 text-zinc-950" />
                </span>
              </div>

              <div className="space-y-1.5 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Owner Authorization Required</span>
                </div>
                <h4 className={`text-lg font-bold font-display tracking-tight ${selectedTheme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                  Protected Customization Tab
                </h4>
                <p className="text-xs sm:text-sm font-medium text-amber-500/90 dark:text-amber-400 bg-amber-500/10 py-2 px-3.5 rounded-xl border border-amber-500/20">
                  This tab can be customized by the owner only.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                  Please enter the owner password to unlock editing for Profile Info, Bio & Stats, and Socials.
                </p>
              </div>

              {/* Password Input Form */}
              <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={enteredPassword}
                    onChange={(e) => {
                      setEnteredPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Enter owner secret password..."
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-mono border focus:outline-hidden transition-colors ${
                      selectedTheme === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-blue-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-xs text-rose-500 font-mono text-left">
                    {passwordError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:opacity-95"
                  style={{ backgroundColor: themeConfig.hex }}
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Owner Tabs</span>
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* OWNER UNLOCKED BANNER ON PROTECTED TABS */}
              {isCurrentTabProtected && isOwnerUnlocked && (
                <div className="flex items-center justify-between p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>
                      <strong className="font-semibold">Owner Mode Active:</strong> This tab can be customized by the owner.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLock}
                    className="text-[11px] font-mono underline hover:opacity-80 ml-2"
                  >
                    Lock Tabs
                  </button>
                </div>
              )}

              {/* TAB 1: PROFILE INFO */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Shobha Solanki"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          selectedTheme === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                        }`}
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="e.g. shobhasolanki230@gmail.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          selectedTheme === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Role / Job Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Role / Professional Title</span>
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      placeholder="e.g. Senior Full-Stack Engineer & Product Builder"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        selectedTheme === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>Location</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="e.g. San Francisco, CA & Remote"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          selectedTheme === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                        }`}
                      />
                    </div>

                    {/* Pronouns */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-violet-400" />
                        <span>Pronouns</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pronouns || ''}
                        onChange={(e) => handleChange('pronouns', e.target.value)}
                        placeholder="e.g. she/her or they/them"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          selectedTheme === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Status & Availability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                        Availability Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value as any)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          selectedTheme === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                        }`}
                      >
                        <option value="available">🟢 Available for new roles & projects</option>
                        <option value="selective">🟡 Selective / Consulting only</option>
                        <option value="busy">🔴 Currently Booked / Busy</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                        Status Sub-Text
                      </label>
                      <input
                        type="text"
                        value={formData.statusText}
                        onChange={(e) => handleChange('statusText', e.target.value)}
                        placeholder="e.g. Available for high-impact roles"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          selectedTheme === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Avatar URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Avatar Image URL</span>
                    </label>
                    <div className="flex gap-3 items-center">
                      {formData.avatarUrl && formData.avatarUrl.trim() !== '' && !formData.avatarUrl.includes('unsplash.com') ? (
                        <img
                          src={formData.avatarUrl.trim()}
                          alt="Preview"
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white font-bold text-base flex items-center justify-center border border-zinc-700 shrink-0">
                          {formData.name?.charAt(0) || 'D'}
                        </div>
                      )}
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => handleChange('avatarUrl', e.target.value)}
                        placeholder="Custom image URL (or leave blank for D monogram)..."
                        className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          selectedTheme === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BIO & STATS */}
              {activeTab === 'bio' && (
                <div className="space-y-4">
                  {/* Headline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                      Headline (Hero Banner)
                    </label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => handleChange('headline', e.target.value)}
                      placeholder="e.g. Crafting scalable web architectures, resilient distributed systems..."
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        selectedTheme === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                      }`}
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                      About Me / Main Bio
                    </label>
                    <textarea
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Tell clients and recruiters about your engineering journey..."
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        selectedTheme === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                      }`}
                    />
                  </div>

                  {/* Numerical Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400">Years Experience</label>
                      <input
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={(e) => handleChange('yearsOfExperience', Number(e.target.value) || 0)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          selectedTheme === 'light' ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400">Projects Done</label>
                      <input
                        type="number"
                        value={formData.projectsCompleted}
                        onChange={(e) => handleChange('projectsCompleted', Number(e.target.value) || 0)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          selectedTheme === 'light' ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400">Satisfied Clients</label>
                      <input
                        type="number"
                        value={formData.clientsSatisfied}
                        onChange={(e) => handleChange('clientsSatisfied', Number(e.target.value) || 0)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          selectedTheme === 'light' ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400">Open Source</label>
                      <input
                        type="number"
                        value={formData.openSourceContributions}
                        onChange={(e) => handleChange('openSourceContributions', Number(e.target.value) || 0)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          selectedTheme === 'light' ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SOCIALS & LINKS */}
              {activeTab === 'socials' && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">
                    Connect your social profiles and calendar booking link across the header, hero, and contact cards.
                  </p>

                  {/* GitHub */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-zinc-300" />
                      <span>GitHub Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.socials?.github || ''}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      placeholder="https://github.com/username"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        selectedTheme === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                      }`}
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                      <span>LinkedIn Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.socials?.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        selectedTheme === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                      }`}
                    />
                  </div>

                  {/* Twitter / X */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-sky-400" />
                      <span>Twitter / X Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.socials?.twitter || ''}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/username"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        selectedTheme === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                      }`}
                    />
                  </div>

                  {/* Cal / Calendar Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cal.com / Calendly Scheduling Link</span>
                    </label>
                    <input
                      type="url"
                      value={formData.socials?.cal || ''}
                      onChange={(e) => handleSocialChange('cal', e.target.value)}
                      placeholder="https://cal.com/username"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        selectedTheme === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                      }`}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 4: ACCENT & THEME (Always accessible) */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              {/* Accent Palette */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                selectedTheme === 'light' ? 'bg-zinc-50/80 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
              }`}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-400" />
                    <span>Accent Colour Palette</span>
                  </label>
                  <span 
                    className="text-xs font-mono font-medium px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${themeConfig.hex}20`, color: themeConfig.hex }}
                  >
                    {themeConfig.name}
                  </span>
                </div>

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

              {/* Theme Mode Selection */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                selectedTheme === 'light' ? 'bg-zinc-50/80 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
              }`}>
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Theme Appearance</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
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
            </div>
          )}

          {/* TAB 5: TIMEZONE (Always accessible) */}
          {activeTab === 'timezone' && (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border space-y-4 ${
                selectedTheme === 'light' ? 'bg-zinc-50/80 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
              }`}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active Timezone & Local Time</span>
                  </label>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    <span>Live Clock</span>
                  </div>
                </div>

                {/* Clock Preview */}
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
                      {formData.timezone || 'UTC'}
                    </span>
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400">Quick Regional Presets:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {COMMON_TIMEZONES.map((tz) => {
                      const isMatch = (formData.timezone || '').includes(tz.value) || formData.timezone === tz.offset;
                      return (
                        <button
                          key={tz.value}
                          type="button"
                          onClick={() => handleChange('timezone', `${tz.value} (${tz.offset.split('/')[0].trim()})`)}
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
                    value={formData.timezone || ''}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    placeholder="e.g. America/New_York (EST) or UTC+5:30"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border focus:outline-hidden transition-colors ${
                      selectedTheme === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-zinc-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OWNER SECURITY & MASTER PASSWORDS (ACCESSIBLE TO OWNER ONLY) */}
          {activeTab === 'security' && isOwnerUnlocked && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${
                selectedTheme === 'light' ? 'bg-amber-50/80 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
              }`}>
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs mb-1">
                  <Shield className="w-4 h-4" />
                  <span>Owner Master Passwords & Credentials</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Only the verified portfolio owner can access this panel. Regular visitors and signed-in members cannot see or access these master keys.
                </p>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  selectedTheme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Primary Master Password:</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-zinc-700/50">
                    <code className="text-sm font-mono font-bold text-amber-400">
                      owner2026
                    </code>
                    <span className="text-[11px] font-mono text-zinc-400">
                      (Full Customizer & Gate Bypass)
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${
                  selectedTheme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
                }`}>
                  <div className="text-xs font-mono text-zinc-400">Secondary Admin Passwords:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VALID_PASSWORDS.slice(1).map((pwd) => (
                      <div key={pwd} className="p-2.5 rounded-xl bg-black/20 border border-zinc-700/40 font-mono text-xs text-zinc-300 flex items-center justify-between">
                        <span>{pwd}</span>
                        <span className="text-[10px] text-zinc-400">Backup</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>Your owner email: <strong>solankidevendra726@gmail.com</strong> (and shobhasolanki230@gmail.com) gives direct owner privileges upon login.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className={`shrink-0 px-6 py-4 border-t flex items-center justify-between backdrop-blur-md ${
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
              <span>{savedSuccess ? 'Saved & Applied!' : 'Save & Apply'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
