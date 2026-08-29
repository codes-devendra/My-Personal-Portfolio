import React, { useState } from 'react';
import { 
  Mail, Send, Check, Copy, Calendar, Clock, MapPin, 
  MessageSquare, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { ProfileData, AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';

interface ContactProps {
  profile: ProfileData;
  accent: AccentColor;
  themeMode: ThemeMode;
  prefilledSubject?: string;
}

export const Contact: React.FC<ContactProps> = ({
  profile,
  accent,
  themeMode,
  prefilledSubject
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: prefilledSubject || 'Full-Stack Development MVP',
    budget: '$10k — $25k',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeConfig = accentThemes[accent];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const path = 'messages';
    try {
      await addDoc(collection(db, path), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        budget: formData.budget,
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
        read: false
      });
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch {
        setError('Failed to send message. Please try again or reach out directly via email.');
      }
    }
  };

  return (
    <section 
      id="contact" 
      className={`py-24 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200' 
          : 'bg-[#080808] border-[#27272a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] mb-3 border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Mail className="w-3.5 h-3.5" />
            <span>Initiate Contact</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            Let's Build Something Exceptional Together
          </h2>
          <p className="text-[#a1a1aa] text-base mt-2">
            Have a project in mind, an engineering challenge to discuss, or looking for an experienced technical partner? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info, Booking & Quick Copy */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Email Direct Card */}
            <div className={`p-7 rounded-2xl border ${
              themeMode === 'light'
                ? 'bg-slate-50 border-slate-200 shadow-sm'
                : 'bg-[#111111] border-[#27272a]'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa]">
                  Direct Email
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Response &lt; 12 hrs
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#050505] border border-[#27272a]">
                <span className="text-sm font-mono text-zinc-200 truncate">
                  {profile.email}
                </span>
                <button
                  id="btn-copy-email"
                  onClick={handleCopyEmail}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tight bg-[#111111] border border-[#27272a] hover:bg-[#1a1a1a] text-zinc-200 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-[#27272a] space-y-2 text-xs text-[#a1a1aa] font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Active timezone: {profile.timezone}</span>
                </div>
              </div>
            </div>

            {/* Book intro call banner */}
            <div className={`p-7 rounded-2xl border relative overflow-hidden ${
              themeMode === 'light'
                ? 'bg-slate-50 border-slate-200 text-zinc-900'
                : 'bg-[#111111] border-[#27272a] text-zinc-100'
            }`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base tracking-tight mb-1">
                    Book a 20-Minute Intro Call
                  </h4>
                  <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
                    Prefer talking in real-time? Schedule a brief exploratory conversation to review requirements and timelines.
                  </p>
                  <a
                    id="btn-schedule-call"
                    href={`mailto:${profile.email}?subject=Introductory%20Call%20Request&body=Hi%20${encodeURIComponent(profile.name)},%20I'd%20love%20to%20schedule%20a%20brief%20intro%20call%20with%20you.`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    <span>Request Call Slot</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className={`p-7 sm:p-8 rounded-2xl border shadow-xl ${
              themeMode === 'light'
                ? 'bg-white border-slate-200 shadow-slate-200/50'
                : 'bg-[#111111] border-[#27272a] shadow-black/40'
            }`}>
              
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className={`text-2xl font-bold font-display tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-[#a1a1aa] max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your message has been received. I will review your requirements and respond back to <strong className="text-white">{formData.email}</strong> within 12 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: 'Full-Stack Development MVP',
                        budget: '$10k — $25k',
                        message: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#a1a1aa]">
                        Your Name *
                      </label>
                      <input
                        id="contact-form-name"
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                          themeMode === 'light'
                            ? 'bg-slate-50 border-slate-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500'
                            : 'bg-[#050505] border-[#27272a] text-white placeholder:text-zinc-600 focus:border-zinc-500'
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#a1a1aa]">
                        Email Address *
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                          themeMode === 'light'
                            ? 'bg-slate-50 border-slate-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500'
                            : 'bg-[#050505] border-[#27272a] text-white placeholder:text-zinc-600 focus:border-zinc-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Subject / Service */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#a1a1aa]">
                        Project Nature / Service
                      </label>
                      <select
                        id="contact-form-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                          themeMode === 'light'
                            ? 'bg-slate-50 border-slate-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-[#050505] border-[#27272a] text-white focus:border-zinc-500'
                        }`}
                      >
                        <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                        <option value="UI/UX & Design Systems">UI/UX & Design Systems</option>
                        <option value="AI Engineering & Automation">AI Engineering & Automation</option>
                        <option value="Performance & Architecture Audit">Performance & Architecture Audit</option>
                        <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
                        <option value="General Collaboration / Advisory">General Collaboration / Advisory</option>
                      </select>
                    </div>

                    {/* Estimated Budget */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#a1a1aa]">
                        Estimated Budget / Scale
                      </label>
                      <select
                        id="contact-form-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                          themeMode === 'light'
                            ? 'bg-slate-50 border-slate-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-[#050505] border-[#27272a] text-white focus:border-zinc-500'
                        }`}
                      >
                        <option value="< $5k">&lt; $5,000 (Small sprint / Audit)</option>
                        <option value="$5k — $15k">$5,000 — $15,000 (Feature module / MVP)</option>
                        <option value="$15k — $30k">$15,000 — $30,000 (Comprehensive build)</option>
                        <option value="$30k+">$30,000+ (Enterprise scale / Retainer)</option>
                        <option value="Full-time salary">Full-time compensation / Equity</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-[#a1a1aa]">
                      Project Details & Timeline *
                    </label>
                    <textarea
                      id="contact-form-message"
                      rows={4}
                      required
                      placeholder="Tell me about your product requirements, target deadlines, and what success looks like..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500'
                          : 'bg-[#050505] border-[#27272a] text-white placeholder:text-zinc-600 focus:border-zinc-500'
                      }`}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    id="btn-submit-contact-form"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full font-bold uppercase tracking-tight text-xs flex items-center justify-center gap-2 shadow-md bg-white text-[#050505] hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                        <span>Sending Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
