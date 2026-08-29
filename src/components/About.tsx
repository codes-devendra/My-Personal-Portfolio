import React from 'react';
import { 
  User, CheckCircle, Sparkles, Terminal, Rocket, 
  Layers, HeartHandshake, Compass, FileText, ArrowRight
} from 'lucide-react';
import { ProfileData, AccentColor, ThemeMode } from '../types';
import { accentThemes, generateVCard } from '../utils/theme';

interface AboutProps {
  profile: ProfileData;
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const About: React.FC<AboutProps> = ({ profile, accent, themeMode }) => {
  const themeConfig = accentThemes[accent];

  const principles = [
    {
      title: 'Performance as a Feature',
      desc: 'Sub-second interactions, optimized bundles, minimal re-renders, and crisp response times across all devices.',
      icon: Rocket
    },
    {
      title: 'Type Safety & Architecture',
      desc: 'Strict TypeScript contracts from API boundary down to UI components to prevent regressions at runtime.',
      icon: Terminal
    },
    {
      title: 'Inclusive & Accessible',
      desc: 'Designing keyboard-navigable, screen-reader friendly, WCAG AAA compliant interfaces from day one.',
      icon: HeartHandshake
    },
    {
      title: 'Pragmatic Engineering',
      desc: 'Focusing on clean, readable code and clear documentation over unneeded complexity or bloated abstractions.',
      icon: Compass
    }
  ];

  return (
    <section 
      id="about" 
      className={`py-20 md:py-28 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-zinc-50/50 border-zinc-200/80' 
          : 'bg-zinc-950/40 border-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="max-w-3xl mb-14">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider mb-3 ${themeConfig.badge}`}>
            <User className="w-3.5 h-3.5" />
            <span>About Me</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            Building resilient software with an eye for craft and purpose.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Narrative & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`space-y-4 text-base sm:text-lg leading-relaxed ${themeMode === 'light' ? 'text-zinc-600' : 'text-zinc-300'}`}>
              <p>
                {profile.bio}
              </p>
              {profile.detailedBio.map((para, idx) => (
                <p key={idx} className="text-base text-zinc-400">
                  {para}
                </p>
              ))}
            </div>

            {/* Key Accomplishments Checklist */}
            <div className={`p-6 rounded-2xl border space-y-3 ${
              themeMode === 'light'
                ? 'bg-white border-zinc-200'
                : 'bg-zinc-900/60 border-zinc-800'
            }`}>
              <h4 className={`text-sm font-semibold uppercase font-mono tracking-wider ${themeConfig.text}`}>
                Key Accomplishments
              </h4>
              <div className="space-y-2.5">
                {profile.keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className={themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Action */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#contact"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm ${themeConfig.primary}`}
              >
                <span>Discuss a Collaboration</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => generateVCard(profile)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  themeMode === 'light'
                    ? 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <FileText className="w-4 h-4 text-zinc-400" />
                <span>Download Contact Card</span>
              </button>
            </div>

          </div>

          {/* Core Principles Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {principles.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border transition-all hover:border-zinc-700 ${
                    themeMode === 'light'
                      ? 'bg-white border-zinc-200 shadow-xs'
                      : 'bg-zinc-900/70 border-zinc-800/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl ${themeConfig.bgSubtle} ${themeConfig.text} border ${themeConfig.border}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-base font-semibold font-display mb-1 ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
