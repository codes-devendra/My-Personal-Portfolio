import React, { useEffect } from 'react';
import { 
  X, ExternalLink, Github, CheckCircle2, Layers, 
  Cpu, Sparkles, TrendingUp, Calendar, User, Code2 
} from 'lucide-react';
import { Project, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  accent,
  themeMode
}) => {
  const themeConfig = accentThemes[accent];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      id="project-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all ${
          themeMode === 'light'
            ? 'bg-white border-slate-200 text-zinc-900'
            : 'bg-[#111111] border-[#27272a] text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="btn-close-project-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors border border-[#27272a]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Project Image Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black border-b border-[#27272a]">
          <img
            src={project.image?.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/50 to-transparent" />
          
          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {project.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-[#a1a1aa]">
                  {project.year}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                {project.title}
              </h2>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center gap-2">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight flex items-center gap-1.5 shadow-md bg-white text-[#050505] hover:bg-zinc-200 transition-colors"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight flex items-center gap-1.5 bg-[#050505] text-white hover:bg-[#1a1a1a] border border-[#27272a] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-7">
          
          {/* Tagline & Overview */}
          <div>
            <h4 className={`text-base font-bold mb-2 ${themeConfig.text}`}>
              {project.tagline}
            </h4>
            <p className={`text-sm sm:text-base leading-relaxed ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
              {project.description}
            </p>
          </div>

          {/* Key Metrics Grid if present */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border text-center ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#050505] border-[#27272a]'
                  }`}
                >
                  <div className={`text-xl sm:text-2xl font-extrabold font-display tracking-tight ${themeConfig.text}`}>
                    {m.value}
                  </div>
                  <div className="text-[11px] text-[#a1a1aa] mt-0.5 font-medium">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Highlights & Engineering Details */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs uppercase font-mono font-semibold text-[#a1a1aa] tracking-wider">
                Key Deliverables & Innovations
              </h5>
              <div className="space-y-2">
                {project.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className={themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture overview */}
          {project.architecture && project.architecture.length > 0 && (
            <div className={`p-5 rounded-xl border space-y-2.5 ${
              themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#050505] border-[#27272a]'
            }`}>
              <h5 className="text-xs uppercase font-mono font-semibold text-[#a1a1aa] tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Architecture Blueprint</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-[#a1a1aa] list-disc list-inside">
                {project.architecture.map((arch, idx) => (
                  <li key={idx} className="leading-normal">{arch}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Chips */}
          <div>
            <h5 className="text-xs uppercase font-mono font-semibold text-[#a1a1aa] tracking-wider mb-2.5">
              Technologies Utilized
            </h5>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-lg text-xs font-mono border ${
                    themeMode === 'light'
                      ? 'bg-slate-100 text-zinc-800 border-slate-200'
                      : 'bg-[#050505] text-[#a1a1aa] border-[#27272a]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
