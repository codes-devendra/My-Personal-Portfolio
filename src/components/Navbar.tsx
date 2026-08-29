import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sparkles, Sliders, Moon, Sun, Monitor, 
  ExternalLink, Mail, Check, Github, Linkedin, Twitter, ArrowUpRight, Mic
} from 'lucide-react';
import { ProfileData, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface NavbarProps {
  profile: ProfileData;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  onOpenCustomizer: () => void;
  onOpenVoiceAssistant?: () => void;
  onSelectProject?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  accent,
  setAccent,
  themeMode,
  setThemeMode,
  onOpenCustomizer,
  onOpenVoiceAssistant
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themeConfig = accentThemes[accent];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Services', href: '#services' },
    { label: 'Forms', href: '#forms' },
    { label: 'Guestbook', href: '#guestbook' },
    { label: 'Contact', href: '#contact' },
  ];

  const accents: AccentColor[] = ['blue', 'indigo', 'emerald', 'cyan', 'rose', 'amber', 'violet'];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? themeMode === 'light' 
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs py-3.5' 
            : 'bg-[#050505]/90 backdrop-blur-md border-b border-[#27272a] shadow-xs py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a 
            id="nav-logo-link"
            href="#hero" 
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105 shadow-sm bg-gradient-to-tr ${themeConfig.gradient} text-white`}>
              {profile.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-extrabold text-base tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                {profile.name.toUpperCase()}
              </span>
              <span className={`text-[11px] font-mono hidden sm:inline-block ${themeMode === 'light' ? 'text-zinc-500' : 'text-[#a1a1aa]'}`}>
                {profile.role.split('&')[0] || profile.role}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 mr-2 lg:mr-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={`nav-link-${link.label.toLowerCase()}`}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  themeMode === 'light'
                    ? 'text-zinc-600 hover:text-zinc-950'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons & Theme Controls */}
          <div className="flex items-center gap-3 sm:gap-3.5 pl-2 sm:pl-3 border-l border-zinc-200/60 dark:border-zinc-800/60">
            {/* Live Voice Assistant Trigger */}
            {onOpenVoiceAssistant && (
              <button
                id="btn-nav-voice-assistant"
                onClick={onOpenVoiceAssistant}
                title="Talk with AI Voice Assistant (Gemini Live)"
                className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all text-white shadow-sm"
                style={{
                  backgroundColor: themeConfig.hex,
                  boxShadow: `0 4px 14px ${themeConfig.hex}40`
                }}
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden lg:inline">AI Voice</span>
                <span className="text-[9px] uppercase font-mono px-1 rounded bg-black/20 text-white/90">
                  Live
                </span>
              </button>
            )}

            {/* Live Customizer Trigger */}
            <button
              id="btn-open-customizer"
              onClick={onOpenCustomizer}
              title="Customize Portfolio Details & Theme"
              className={`p-2 rounded-xl text-sm flex items-center gap-1.5 transition-all border ${
                themeMode === 'light'
                  ? 'border-slate-200 bg-white text-zinc-700 hover:bg-slate-100 hover:text-zinc-950'
                  : 'border-[#27272a] bg-[#111111] text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-blue-400" />
              <span className="hidden xl:inline text-xs font-medium">Customize</span>
            </button>

            {/* Theme Settings Dropdown Button */}
            <div className="relative">
              <button
                id="btn-theme-toggle"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`p-2 rounded-xl text-sm transition-all border ${
                  themeMode === 'light'
                    ? 'border-slate-200 bg-white text-zinc-700 hover:bg-slate-100'
                    : 'border-[#27272a] bg-[#111111] text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
                }`}
                title="Change theme appearance & accent"
              >
                {themeMode === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
              </button>

              {/* Theme Popover */}
              {showThemeMenu && (
                <div 
                  id="theme-picker-popover"
                  className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-200 text-zinc-900'
                      : 'bg-[#111111] border-[#27272a] text-zinc-100'
                  }`}
                >
                  <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa] mb-2.5">
                    Theme Mode
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      id="theme-mode-dark"
                      onClick={() => { setThemeMode('dark'); setShowThemeMenu(false); }}
                      className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        themeMode === 'dark'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-semibold'
                          : 'border-[#27272a] hover:bg-[#1a1a1a] text-[#a1a1aa]'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" /> Dark
                    </button>
                    <button
                      id="theme-mode-light"
                      onClick={() => { setThemeMode('light'); setShowThemeMenu(false); }}
                      className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        themeMode === 'light'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 font-semibold'
                          : 'border-slate-200 hover:bg-slate-100 text-zinc-700'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" /> Light
                    </button>
                  </div>

                  <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa] mb-2.5">
                    Accent Color
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {accents.map((c) => {
                      const bgClass = c === 'blue' ? 'bg-blue-600' :
                                      c === 'indigo' ? 'bg-indigo-600' :
                                      c === 'emerald' ? 'bg-emerald-600' :
                                      c === 'cyan' ? 'bg-cyan-600' :
                                      c === 'rose' ? 'bg-rose-600' :
                                      c === 'amber' ? 'bg-amber-600' : 'bg-violet-600';
                      return (
                        <button
                          key={c}
                          id={`accent-btn-${c}`}
                          onClick={() => { setAccent(c); }}
                          title={c}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${bgClass}`}
                        >
                          {accent === c && <Check className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Let's Talk CTA */}
            <a
              id="nav-cta-contact"
              href="#contact"
              className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-tight uppercase transition-all shadow-md ${
                themeMode === 'light'
                  ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                  : 'bg-white text-[#050505] hover:bg-zinc-200'
              }`}
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl md:hidden border transition-colors ${
                themeMode === 'light'
                  ? 'border-slate-200 bg-white text-zinc-700'
                  : 'border-[#27272a] bg-[#111111] text-[#a1a1aa]'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            id="mobile-nav-drawer"
            className={`md:hidden mt-3 rounded-2xl p-5 border shadow-2xl ${
              themeMode === 'light'
                ? 'bg-white border-slate-200'
                : 'bg-[#111111] border-[#27272a]'
            }`}
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    themeMode === 'light'
                      ? 'text-zinc-700 hover:text-zinc-950'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-[#27272a] flex flex-col gap-2">
                {onOpenVoiceAssistant && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenVoiceAssistant();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-white text-xs font-bold shadow-md"
                    style={{ backgroundColor: themeConfig.hex }}
                  >
                    <Mic className="w-3.5 h-3.5 animate-pulse" />
                    <span>Talk with AI Voice (Gemini Live)</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCustomizer();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#27272a] bg-[#1a1a1a] text-[#a1a1aa] text-xs font-medium"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  Customize Profile & Theme
                </button>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full text-xs font-bold uppercase text-[#050505] bg-white hover:bg-zinc-200`}
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
