import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Mail, Heart, Sparkles } from 'lucide-react';
import { ProfileData, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface FooterProps {
  profile: ProfileData;
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ profile, accent, themeMode }) => {
  const themeConfig = accentThemes[accent];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="main-footer"
      className={`py-12 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-slate-100/80 border-slate-200 text-zinc-600' 
          : 'bg-[#050505] border-[#27272a] text-[#a1a1aa]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#27272a]">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base bg-blue-500 text-white shadow-sm">
              {profile.name.charAt(0)}
            </div>
            <div>
              <span className={`font-display font-bold text-base tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                {profile.name}
              </span>
              <p className="text-xs font-mono text-[#a1a1aa]">
                {profile.role}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            {profile.socials.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#111111] transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#111111] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.socials.twitter && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#111111] transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="p-2.5 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#111111] transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Scroll to Top */}
          <button
            id="btn-scroll-to-top"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight border border-[#27272a] bg-[#111111] hover:bg-[#1a1a1a] transition-all text-white shadow-sm"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Copyright & Subtext */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a1a1aa] font-mono gap-3">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Engineered with React 19, TypeScript & Tailwind CSS</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
