import React from 'react';
import { BookOpen, ArrowUpRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { Article, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface ArticlesProps {
  articles: Article[];
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const Articles: React.FC<ArticlesProps> = ({
  articles,
  accent,
  themeMode
}) => {
  const themeConfig = accentThemes[accent];

  return (
    <section 
      id="articles" 
      className={`py-20 md:py-28 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-zinc-50/50 border-zinc-200' 
          : 'bg-zinc-950/60 border-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="max-w-2xl mb-14">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider mb-3 ${themeConfig.badge}`}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Insights</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            Writings & Architecture Notes
          </h2>
          <p className="text-zinc-400 text-base mt-2">
            Notes on distributed state, frontend ergonomics, performance benchmarks, and modern AI pipelines.
          </p>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className={`p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 ${
                themeMode === 'light'
                  ? 'bg-white border-zinc-200 shadow-xs'
                  : 'bg-zinc-900/70 border-zinc-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className={`px-2 py-0.5 rounded-md ${themeConfig.badge}`}>
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className={`font-display font-bold text-lg leading-snug ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{art.date}</span>
                </div>
                <span className={`inline-flex items-center gap-1 font-semibold ${themeConfig.text}`}>
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
