import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sparkles, Sliders, Moon, Sun, 
  Check, ArrowUpRight, Mic, User, LogIn, Shield, LogOut, KeyRound, ChevronDown
} from 'lucide-react';
import { ProfileData, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';
import { User as FirebaseUser } from '../lib/firebase';
import { AuthTab } from './AuthModal';

interface NavbarProps {
  profile: ProfileData;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  onOpenCustomizer: () => void;
  onOpenVoiceAssistant?: () => void;
  onSelectProject?: (id: string) => void;
  currentUser: FirebaseUser | null;
  isOwner: boolean;
  onOpenAuth: (tab?: AuthTab) => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  accent,
  setAccent,
  themeMode,
  setThemeMode,
  onOpenCustomizer,
  onOpenVoiceAssistant,
  currentUser,
  isOwner,
  onOpenAuth,
  onSignOut
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs py-3' 
            : 'bg-[#050505]/90 backdrop-blur-md border-b border-[#27272a] shadow-xs py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a 
            id="nav-logo-link"
            href="#hero" 
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105 shadow-sm bg-gradient-to-tr ${themeConfig.gradient} text-white`}>
              {profile.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-extrabold text-sm sm:text-base tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                {profile.name.toUpperCase()}
              </span>
              <span className={`text-[10px] sm:text-[11px] font-mono hidden sm:inline-block ${themeMode === 'light' ? 'text-zinc-500' : 'text-[#a1a1aa]'}`}>
                {profile.role.split('&')[0] || profile.role}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 mr-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={`nav-link-${link.label.toLowerCase()}`}
                href={link.href}
                className={`text-xs font-medium transition-colors ${
                  themeMode === 'light'
                    ? 'text-zinc-600 hover:text-zinc-950'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons & Auth / Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Live Voice Assistant Trigger */}
            {onOpenVoiceAssistant && (
              <button
                id="btn-nav-voice-assistant"
                onClick={onOpenVoiceAssistant}
                title="Talk with AI Voice Assistant (Gemini Live)"
                className="hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-semibold items-center gap-1.5 transition-all text-white shadow-xs"
                style={{
                  backgroundColor: themeConfig.hex,
                  boxShadow: `0 2px 10px ${themeConfig.hex}30`
                }}
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden xl:inline">AI Voice</span>
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
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border ${
                themeMode === 'light'
                  ? 'border-slate-200 bg-white text-zinc-700 hover:bg-slate-100 hover:text-zinc-950'
                  : 'border-[#27272a] bg-[#111111] text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-medium">Customize</span>
            </button>

            {/* Theme Settings Dropdown Button */}
            <div className="relative">
              <button
                id="btn-theme-toggle"
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowUserMenu(false);
                }}
                className={`p-2 rounded-xl text-xs transition-all border ${
                  themeMode === 'light'
                    ? 'border-slate-200 bg-white text-zinc-700 hover:bg-slate-100'
                    : 'border-[#27272a] bg-[#111111] text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
                }`}
                title="Change theme appearance & accent"
              >
                {themeMode === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
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

            {/* AUTH / LOGIN TAB BUTTON & USER MENU */}
            <div className="relative">
              {currentUser ? (
                <button
                  id="btn-nav-user-profile"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowThemeMenu(false);
                  }}
                  className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-all text-xs font-medium ${
                    isOwner
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                      : themeMode === 'light'
                        ? 'border-slate-200 bg-white text-zinc-800 hover:bg-slate-50'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800'
                  }`}
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-6 h-6 rounded-full border border-white/20 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-500/30 text-white font-bold flex items-center justify-center text-[10px]">
                      {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline font-mono text-[11px] max-w-[100px] truncate">
                    {isOwner ? 'Owner' : currentUser.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  {isOwner && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  )}
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>
              ) : (
                <button
                  id="btn-nav-login"
                  onClick={() => onOpenAuth('user_login')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    themeMode === 'light'
                      ? 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 hover:border-zinc-400'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white'
                  }`}
                  title="Sign In / Register / Owner Login"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Login</span>
                </button>
              )}

              {/* User Profile Popover */}
              {showUserMenu && currentUser && (
                <div 
                  id="nav-user-dropdown-popover"
                  className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-200 text-zinc-900'
                      : 'bg-[#111111] border-[#27272a] text-zinc-100'
                  }`}
                >
                  {/* Account Header */}
                  <div className="p-2 pb-3 border-b border-zinc-700/50 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold truncate">
                        {currentUser.displayName || 'Portfolio User'}
                      </span>
                      {isOwner ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Owner
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Member
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono truncate">
                      {currentUser.email}
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenCustomizer();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-zinc-800/60 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      <span>Portfolio Customizer</span>
                    </button>

                    {!isOwner && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenAuth('owner_login');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-amber-500/10 flex items-center gap-2 text-amber-400 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Unlock Owner Access</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuth('user_login');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-zinc-800/60 flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-rose-500/10 flex items-center gap-2 text-rose-400 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Let's Talk CTA */}
            <a
              id="nav-cta-contact"
              href="#contact"
              className={`hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-tight uppercase transition-all shadow-md ${
                themeMode === 'light'
                  ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                  : 'bg-white text-[#050505] hover:bg-zinc-200'
              }`}
            >
              <span>Start Project</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl lg:hidden border transition-colors ${
                themeMode === 'light'
                  ? 'border-slate-200 bg-white text-zinc-700'
                  : 'border-[#27272a] bg-[#111111] text-[#a1a1aa]'
              }`}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            id="mobile-nav-drawer"
            className={`lg:hidden mt-3 rounded-2xl p-5 border shadow-2xl ${
              themeMode === 'light'
                ? 'bg-white border-slate-200'
                : 'bg-[#111111] border-[#27272a]'
            }`}
          >
            <div className="flex flex-col space-y-2.5">
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
                {/* Auth In Drawer */}
                {currentUser ? (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{currentUser.displayName || 'User'}</span>
                        {isOwner && (
                          <span className="text-[10px] font-mono px-1 rounded bg-amber-500/20 text-amber-400">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSignOut();
                      }}
                      className="text-xs text-rose-400 hover:underline font-mono"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('user_login');
                      }}
                      className="py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white flex items-center justify-center gap-1"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('owner_login');
                      }}
                      className="py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white flex items-center justify-center gap-1"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Owner</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signup');
                      }}
                      className="py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                )}

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
                  <span>Customize Profile & Theme</span>
                </button>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full text-xs font-bold uppercase text-[#050505] bg-white hover:bg-zinc-200"
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
