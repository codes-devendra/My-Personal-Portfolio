import React from 'react';
import { 
  Briefcase, Calendar, MapPin, CheckCircle2, ArrowRight, Building2 
} from 'lucide-react';
import { Experience as ExperienceType, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface ExperienceProps {
  experienceList: ExperienceType[];
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const Experience: React.FC<ExperienceProps> = ({
  experienceList,
  accent,
  themeMode
}) => {
  const themeConfig = accentThemes[accent];

  return (
    <section 
      id="experience" 
      className={`py-24 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-slate-100/50 border-slate-200' 
          : 'bg-[#080808] border-[#27272a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] mb-3 border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career History</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            Professional Journey & Leadership
          </h2>
          <p className="text-[#a1a1aa] text-base mt-2">
            Track record of driving technical initiatives, scaling architectures, and mentoring engineering teams.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l border-[#27272a] ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-10">
          {experienceList.map((item, index) => (
            <div key={item.id} className="relative group">
              
              {/* Timeline Node Point */}
              <div 
                className={`absolute -left-[31px] sm:-left-[47px] top-2 w-3.5 h-3.5 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                  index === 0 
                    ? `bg-blue-500 border-white shadow-md shadow-blue-500/50` 
                    : `bg-[#050505] border-[#27272a]`
                }`}
              />

              {/* Experience Card */}
              <div className={`p-7 rounded-2xl border transition-all duration-300 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  : 'bg-[#111111] border-[#27272a] hover:border-zinc-600'
              }`}>
                
                {/* Header: Role, Company, Period */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-[#27272a]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={`font-display font-bold text-xl tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                        {item.role}
                      </h3>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
                      <Building2 className="w-4 h-4" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-xs font-mono text-[#a1a1aa]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className={`text-sm sm:text-base leading-relaxed mb-5 ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
                  {item.summary}
                </p>

                {/* Key Achievements */}
                <div className="space-y-2.5 mb-6">
                  <h4 className="text-xs uppercase font-mono font-semibold text-[#a1a1aa] tracking-wider">
                    Key Outcomes & Impact
                  </h4>
                  {item.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span className={themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}>
                        {ach}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech stack pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-xs font-mono text-[#a1a1aa] mr-1">Stack:</span>
                  {item.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                        themeMode === 'light'
                          ? 'bg-slate-100 text-zinc-700 border-slate-200'
                          : 'bg-[#050505] text-[#a1a1aa] border-[#27272a]'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
