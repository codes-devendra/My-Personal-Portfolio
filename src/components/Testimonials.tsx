import React from 'react';
import { MessageSquareQuote, Star, Building2, Quote } from 'lucide-react';
import { Testimonial, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface TestimonialsProps {
  testimonials: Testimonial[];
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  accent,
  themeMode
}) => {
  const themeConfig = accentThemes[accent];

  return (
    <section 
      id="testimonials" 
      className={`py-20 md:py-28 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-white border-zinc-200' 
          : 'bg-zinc-950 border-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="max-w-2xl mb-14">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider mb-3 ${themeConfig.badge}`}>
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Endorsements</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            What Engineering Leaders & Clients Say
          </h2>
          <p className="text-zinc-400 text-base mt-2">
            Feedback from leaders, founders, and colleagues I've collaborated with across past products.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${
                themeMode === 'light'
                  ? 'bg-zinc-50/60 border-zinc-200 shadow-xs hover:border-zinc-300'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className={`text-sm sm:text-base leading-relaxed italic ${themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  "{item.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-zinc-800/60 flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <h4 className={`font-display font-semibold text-sm ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {item.role}, <span className={themeConfig.text}>{item.company}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
