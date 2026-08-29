import React from 'react';
import { 
  ArrowRight, Download, Mail, Github, Linkedin, Twitter, 
  CheckCircle2, ShieldCheck, MapPin, Clock, Mic
} from 'lucide-react';
import { ProfileData, AccentColor, ThemeMode } from '../types';
import { accentThemes, generateVCard } from '../utils/theme';

interface HeroProps {
  profile: ProfileData;
  accent: AccentColor;
  themeMode: ThemeMode;
  onExploreProjects: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  accent,
  themeMode,
  onExploreProjects,
  onOpenVoiceAssistant
}) => {
  const themeConfig = accentThemes[accent];

  return (
    <section 
      id="hero" 
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Background Decorative Ambient Glows */}
      {/* Sleek ambient subtle background accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call-To-Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Sleek Hero Tag */}
            <div 
              id="hero-status-badge"
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] border border-blue-500/20 bg-blue-500/10 text-blue-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>{profile.statusText}</span>
            </div>

            {/* Main Greeting & Name Heading */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.02] font-display">
                <span className={themeMode === 'light' ? 'text-zinc-900' : 'text-white'}>
                  Building future-ready{' '}
                </span>
                <span className={`bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
                  digital products.
                </span>
              </h1>
              <p className={`text-xl sm:text-2xl font-bold tracking-tight ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>
                {profile.name} — {profile.role}
              </p>
            </div>

            {/* Headline / Summary */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
              {profile.headline}
            </p>

            {/* Quick Location & Timezone info chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#a1a1aa]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.timezone}</span>
              </div>
            </div>

            {/* Call to Actions (Sleek pill buttons) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-3.5">
              <a
                id="hero-cta-explore"
                href="#projects"
                onClick={onExploreProjects}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-all transform hover:-translate-y-0.5 shadow-lg"
              >
                <span>Explore Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {onOpenVoiceAssistant && (
                <button
                  id="hero-btn-voice-live"
                  onClick={onOpenVoiceAssistant}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-sm text-white transition-all transform hover:-translate-y-0.5 shadow-lg"
                  style={{
                    backgroundColor: themeConfig.hex,
                    boxShadow: `0 6px 20px ${themeConfig.hex}40`
                  }}
                  title="Speak in real-time with AI Voice Assistant"
                >
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span>Talk with AI Voice</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-black/20 text-white/90">
                    Live
                  </span>
                </button>
              )}

              <a
                id="hero-cta-contact"
                href="#contact"
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm border transition-all transform hover:-translate-y-0.5 ${
                  themeMode === 'light'
                    ? 'border-slate-300 bg-white text-zinc-900 hover:bg-slate-100 shadow-sm'
                    : 'border-[#27272a] bg-[#111111] text-zinc-100 hover:bg-[#1a1a1a] hover:border-zinc-600'
                }`}
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Get in Touch</span>
              </a>

              <button
                id="hero-btn-vcard"
                onClick={() => generateVCard(profile)}
                title="Download vCard Contact info"
                className={`inline-flex items-center gap-2 px-4 py-3.5 rounded-full text-xs font-mono font-semibold border transition-all ${
                  themeMode === 'light'
                    ? 'border-slate-200 text-zinc-600 hover:bg-slate-100'
                    : 'border-[#27272a] text-[#a1a1aa] hover:bg-[#111111] hover:text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>vCard</span>
              </button>
            </div>

            {/* Quick Social Links */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs uppercase font-mono tracking-wider text-[#a1a1aa]">Connect:</span>
              <div className="flex items-center gap-2">
                {profile.socials.github && (
                  <a
                    id="hero-social-github"
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl border transition-colors ${
                      themeMode === 'light'
                        ? 'border-slate-200 text-zinc-700 hover:text-zinc-950 hover:bg-slate-100'
                        : 'border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#111111]'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.linkedin && (
                  <a
                    id="hero-social-linkedin"
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl border transition-colors ${
                      themeMode === 'light'
                        ? 'border-slate-200 text-zinc-700 hover:text-zinc-950 hover:bg-slate-100'
                        : 'border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#111111]'
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a
                    id="hero-social-twitter"
                    href={profile.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl border transition-colors ${
                      themeMode === 'light'
                        ? 'border-slate-200 text-zinc-700 hover:text-zinc-950 hover:bg-slate-100'
                        : 'border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#111111]'
                    }`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sleek Interface Card */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-md">
              
              {/* Profile Card Container (Sleek Interface Card) */}
              <div className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 shadow-xl'
                  : 'bg-[#111111] border-[#27272a] shadow-2xl hover:border-zinc-700'
              }`}>
                
                {/* Avatar & Headline inside card */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-[#27272a]"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-[#111111] flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-display font-bold text-lg tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                      {profile.name}
                    </h3>
                    <p className={`text-xs font-mono ${themeConfig.text}`}>
                      {profile.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#a1a1aa]">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Available for Select Engagements</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className={`p-4 rounded-xl border ${themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#050505] border-[#27272a]'}`}>
                    <div className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
                      <span className={themeConfig.text}>{profile.yearsOfExperience}+</span>
                      <span className="text-xs text-[#a1a1aa] font-normal">years</span>
                    </div>
                    <div className="text-xs text-[#a1a1aa] mt-1 font-medium">Experience</div>
                  </div>

                  <div className={`p-4 rounded-xl border ${themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#050505] border-[#27272a]'}`}>
                    <div className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
                      <span className={themeConfig.text}>{profile.projectsCompleted}+</span>
                      <span className="text-xs text-[#a1a1aa] font-normal">shipped</span>
                    </div>
                    <div className="text-xs text-[#a1a1aa] mt-1 font-medium">Products</div>
                  </div>

                  <div className={`p-4 rounded-xl border ${themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#050505] border-[#27272a]'}`}>
                    <div className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
                      <span className="text-blue-400">100%</span>
                    </div>
                    <div className="text-xs text-[#a1a1aa] mt-1 font-medium">Client Rating</div>
                  </div>

                  <div className={`p-4 rounded-xl border ${themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#050505] border-[#27272a]'}`}>
                    <div className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
                      <span className={themeConfig.text}>{profile.openSourceContributions}+</span>
                    </div>
                    <div className="text-xs text-[#a1a1aa] mt-1 font-medium">Open Source PRs</div>
                  </div>
                </div>

                {/* Micro tech tags */}
                <div className="border-t border-[#27272a] pt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[#a1a1aa] uppercase mr-1">Stack:</span>
                  {['TypeScript', 'React 19', 'Next.js', 'PostgreSQL', 'Tailwind', 'Docker'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
