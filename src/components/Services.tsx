import React from 'react';
import { 
  Briefcase, Layers, Palette, Bot, Gauge, ArrowRight, CheckCircle2, Clock 
} from 'lucide-react';
import { Service, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface ServicesProps {
  services: Service[];
  accent: AccentColor;
  themeMode: ThemeMode;
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({
  services,
  accent,
  themeMode,
  onSelectService
}) => {
  const themeConfig = accentThemes[accent];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'Gauge': return <Gauge className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <section 
      id="services" 
      className={`py-24 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-slate-100/50 border-slate-200' 
          : 'bg-[#050505] border-[#27272a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] mb-3 border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Consulting & Services</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            How I Can Help Your Product Succeed
          </h2>
          <p className="text-[#a1a1aa] text-base mt-2">
            Available for advisory, architecture audits, full product builds, or embedded senior engineering contracts.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              id={`service-card-${srv.id}`}
              className={`p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 shadow-md'
                  : 'bg-[#111111] border-[#27272a] hover:border-zinc-600'
              }`}
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                    {getServiceIcon(srv.icon)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#a1a1aa]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{srv.turnaround}</span>
                  </div>
                </div>

                <div>
                  <h3 className={`font-display font-bold text-xl tracking-tight mb-1.5 ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                    {srv.title}
                  </h3>
                  <p className={`text-xs font-bold uppercase tracking-tight ${themeConfig.text}`}>
                    {srv.tagline}
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
                    {srv.description}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs uppercase font-mono font-semibold text-[#a1a1aa] tracking-wider">
                    Scope & Deliverables
                  </h5>
                  <div className="space-y-2">
                    {srv.deliverables.map((del, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className={themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}>
                          {del}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl text-xs font-mono border ${
                  themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-zinc-600' : 'bg-[#050505] border-[#27272a] text-[#a1a1aa]'
                }`}>
                  <strong className={themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}>Ideal for:</strong> {srv.idealFor}
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-[#27272a] flex items-center justify-between">
                <a
                  href="#contact"
                  onClick={() => onSelectService(srv.title)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-colors shadow-md"
                >
                  <span>Inquire for {srv.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
