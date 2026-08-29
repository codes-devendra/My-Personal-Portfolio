import { AccentColor, ThemeMode, ProfileData } from '../types';

export const accentThemes: Record<AccentColor, {
  name: string;
  primary: string;
  badge: string;
  bgSubtle: string;
  border: string;
  text: string;
  glow: string;
  gradient: string;
  hex: string;
}> = {
  blue: {
    name: 'Electric Blue',
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    bgSubtle: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/25',
    gradient: 'from-blue-600 via-blue-500 to-indigo-600',
    hex: '#3b82f6'
  },
  indigo: {
    name: 'Sleek Indigo',
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    bgSubtle: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    glow: 'shadow-indigo-500/25',
    gradient: 'from-indigo-600 to-violet-600',
    hex: '#6366f1'
  },
  emerald: {
    name: 'Emerald Neon',
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bgSubtle: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/25',
    gradient: 'from-emerald-600 to-teal-600',
    hex: '#10b981'
  },
  cyan: {
    name: 'Cyan Azure',
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-500/20',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    bgSubtle: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/25',
    gradient: 'from-cyan-600 to-blue-600',
    hex: '#06b6d4'
  },
  rose: {
    name: 'Rose Quartz',
    primary: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-500/20',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    bgSubtle: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/25',
    gradient: 'from-rose-600 to-pink-600',
    hex: '#f43f5e'
  },
  amber: {
    name: 'Solar Amber',
    primary: 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    bgSubtle: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/25',
    gradient: 'from-amber-600 to-orange-600',
    hex: '#f59e0b'
  },
  violet: {
    name: 'Royal Violet',
    primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-500/20',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    bgSubtle: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/25',
    gradient: 'from-violet-600 to-purple-600',
    hex: '#8b5cf6'
  }
};

export function generateVCard(profile: ProfileData) {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${profile.role}
EMAIL;TYPE=INTERNET;TYPE=WORK:${profile.email}
ADR;TYPE=WORK:;;${profile.location};;;;
NOTE:${profile.headline}
URL:${profile.socials.github || ''}
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${profile.name.replace(/\s+/g, '_')}_contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
