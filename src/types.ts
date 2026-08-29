export interface ProfileData {
  name: string;
  pronouns?: string;
  role: string;
  headline: string;
  bio: string;
  detailedBio: string[];
  avatarUrl: string;
  location: string;
  timezone: string;
  email: string;
  status: 'available' | 'busy' | 'selective';
  statusText: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  clientsSatisfied: number;
  openSourceContributions: number;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
    cal?: string;
  };
  keyHighlights: string[];
}

export type ProjectCategory = 'all' | 'fullstack' | 'ai' | 'mobile' | 'frontend' | 'opensource';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: {
    label: string;
    value: string;
  }[];
  highlights: string[];
  architecture?: string[];
  role?: string;
  year: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0-100
  years: string;
  badge?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: SkillItem[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Co-Founder' | 'Consultant';
  summary: string;
  achievements: string[];
  techStack: string[];
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  deliverables: string[];
  turnaround: string;
  idealFor: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  relationship: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  category: string;
  linkText?: string;
}

export type AccentColor = 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'violet';
export type ThemeMode = 'dark' | 'light';
