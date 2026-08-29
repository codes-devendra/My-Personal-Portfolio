import React, { useState, useMemo } from 'react';
import { 
  Cpu, Search, Layout, Server, Sparkles, Terminal, 
  Check, Filter, Shield, Award, Zap
} from 'lucide-react';
import { SkillCategory, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface SkillsProps {
  skillsData: SkillCategory[];
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const Skills: React.FC<SkillsProps> = ({ skillsData, accent, themeMode }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const themeConfig = accentThemes[accent];

  const filteredCategories = useMemo(() => {
    return skillsData.map((category) => {
      if (activeCategory !== 'all' && category.id !== activeCategory) {
        return null;
      }

      const filteredSkills = category.skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredSkills.length === 0) return null;

      return {
        ...category,
        skills: filteredSkills
      };
    }).filter(Boolean) as SkillCategory[];
  }, [skillsData, activeCategory, searchQuery]);

  const totalSkillsCount = skillsData.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <section 
      id="skills" 
      className={`py-24 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200' 
          : 'bg-[#050505] border-[#27272a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] mb-3 border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical Arsenal</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
              Skills, Frameworks & Core Competencies
            </h2>
            <p className="text-[#a1a1aa] text-base mt-2">
              Continuous mastery across frontend architectures, distributed backend platforms, and modern AI toolchains.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className={`hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full border ${themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#111111] border-[#27272a]'}`}>
            <Zap className={`w-4 h-4 ${themeConfig.text}`} />
            <span className="text-xs font-mono text-[#a1a1aa]">
              <strong className={themeMode === 'light' ? 'text-zinc-900' : 'text-white'}>{totalSkillsCount}</strong> Verified Technologies
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              id="skill-cat-all"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight transition-all ${
                activeCategory === 'all'
                  ? 'bg-white text-[#050505] shadow-md'
                  : themeMode === 'light'
                    ? 'bg-slate-100 text-zinc-700 hover:bg-slate-200'
                    : 'bg-[#111111] border border-[#27272a] text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              All Domains
            </button>
            {skillsData.map((cat) => (
              <button
                key={cat.id}
                id={`skill-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-[#050505] shadow-md'
                    : themeMode === 'light'
                      ? 'bg-slate-100 text-zinc-700 hover:bg-slate-200'
                      : 'bg-[#111111] border border-[#27272a] text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                {cat.title.split('&')[0]}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="skills-search-input"
              type="text"
              placeholder="Search skill (e.g. React, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-full text-xs font-medium border transition-all ${
                themeMode === 'light'
                  ? 'bg-white border-slate-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500'
                  : 'bg-[#111111] border-[#27272a] text-white placeholder:text-[#a1a1aa] focus:border-zinc-500'
              }`}
            />
          </div>

        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`p-7 rounded-2xl border transition-all duration-300 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 shadow-md'
                  : 'bg-[#111111] border-[#27272a] hover:border-zinc-600'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#27272a]">
                <div>
                  <h3 className={`font-display font-bold text-lg tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">
                    {category.description}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  {category.id === 'frontend' && <Layout className="w-5 h-5" />}
                  {category.id === 'backend' && <Server className="w-5 h-5" />}
                  {category.id === 'ai-tools' && <Sparkles className="w-5 h-5" />}
                  {category.id === 'design-devops' && <Terminal className="w-5 h-5" />}
                </div>
              </div>

              {/* Skills Item List */}
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>
                          {skill.name}
                        </span>
                        {skill.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                            {skill.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[#a1a1aa] font-mono text-[11px]">
                        <span>{skill.years}</span>
                        <span className="text-zinc-600">•</span>
                        <span className={themeConfig.text}>{skill.level}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#050505] border border-[#27272a] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${themeConfig.gradient}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-[#a1a1aa]">
            <p className="text-sm">No skills found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className={`mt-3 text-xs underline font-semibold uppercase tracking-wider ${themeConfig.text}`}
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
