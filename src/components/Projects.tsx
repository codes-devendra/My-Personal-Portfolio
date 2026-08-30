import React, { useState } from 'react';
import { 
  FolderGit2, ExternalLink, Github, ArrowUpRight, 
  Sparkles, Layers, Eye, Star
} from 'lucide-react';
import { Project, ProjectCategory, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';
import { ProjectModal } from './ProjectModal';

interface ProjectsProps {
  projects: Project[];
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, accent, themeMode }) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const themeConfig = accentThemes[accent];

  const categories: { label: string; value: ProjectCategory }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Full-Stack', value: 'fullstack' },
    { label: 'AI & Systems', value: 'ai' },
    { label: 'Frontend & UI', value: 'frontend' },
    { label: 'Open Source', value: 'opensource' },
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  return (
    <section 
      id="projects" 
      className={`py-24 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-slate-100/50 border-slate-200' 
          : 'bg-[#080808] border-[#27272a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] mb-3 border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Selected Work</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
              Featured Engineering & Design Projects
            </h2>
            <p className="text-[#a1a1aa] text-base mt-2">
              A curated collection of production systems, developer tools, and client products delivered with uncompromising fidelity.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                id={`filter-project-${cat.value}`}
                onClick={() => setActiveFilter(cat.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight transition-all ${
                  activeFilter === cat.value
                    ? 'bg-white text-[#050505] shadow-md'
                    : themeMode === 'light'
                      ? 'bg-white border border-slate-200 text-zinc-600 hover:bg-slate-100'
                      : 'bg-[#111111] border border-[#27272a] text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-[#111111] border-[#27272a] hover:border-zinc-600'
              }`}
            >
              {/* Project Visual Thumbnail */}
              <div 
                className="relative h-52 w-full overflow-hidden bg-black cursor-pointer border-b border-[#27272a]"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.image?.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#050505]/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Quick inspect overlay button */}
                <div className="absolute bottom-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] shadow-lg">
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${themeConfig.text}`}>
                      {project.category} • {project.year}
                    </span>
                  </div>

                  <h3 
                    onClick={() => setSelectedProject(project)}
                    className={`font-display font-bold text-xl tracking-tight cursor-pointer hover:text-blue-400 transition-colors ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#a1a1aa] line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                        themeMode === 'light'
                          ? 'bg-slate-100 text-zinc-700 border-slate-200'
                          : 'bg-[#050505] text-[#a1a1aa] border-[#27272a]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="text-[11px] font-mono px-1.5 py-1 text-[#a1a1aa]">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className={`text-xs font-bold uppercase tracking-tight flex items-center gap-1 hover:underline ${themeConfig.text}`}
                  >
                    <span>Read Architecture Case</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] border border-[#27272a] transition-colors"
                        title="GitHub Repo"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] border border-[#27272a] transition-colors"
                        title="Live Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Project Details Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          accent={accent}
          themeMode={themeMode}
        />

      </div>
    </section>
  );
};
