import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { Articles } from './components/Articles';
import { GoogleFormsSection } from './components/GoogleFormsSection';
import { VoiceAssistantSection } from './components/VoiceAssistantSection';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { VoiceFloatingButton } from './components/VoiceFloatingButton';
import { Guestbook } from './components/Guestbook';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LiveEditorModal } from './components/LiveEditorModal';
import { 
  initialProfile, initialProjects, initialSkills, 
  initialExperience, initialServices, initialTestimonials, initialArticles 
} from './data/initialData';
import { ProfileData, Project, SkillCategory, Experience as ExperienceType, Service, Testimonial, Article, AccentColor, ThemeMode } from './types';
import { db, doc, onSnapshot, setDoc, handleFirestoreError, OperationType } from './lib/firebase';

export default function App() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem('portfolio_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [projects] = useState<Project[]>(initialProjects);
  const [skills] = useState<SkillCategory[]>(initialSkills);
  const [experience] = useState<ExperienceType[]>(initialExperience);
  const [services] = useState<Service[]>(initialServices);
  const [testimonials] = useState<Testimonial[]>(initialTestimonials);
  const [articles] = useState<Article[]>(initialArticles);

  const [accent, setAccent] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('portfolio_accent');
      return (saved as AccentColor) || 'blue';
    } catch {
      return 'blue';
    }
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme');
      return (saved as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState<string | undefined>(undefined);

  // Sync profile with Firestore if remote exists
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'portfolio', 'profile'), (snap) => {
      if (snap.exists()) {
        const remoteData = snap.data() as Partial<ProfileData>;
        setProfile((prev) => ({
          ...prev,
          ...remoteData,
          socials: remoteData.socials || prev.socials,
          detailedBio: remoteData.detailedBio || prev.detailedBio,
          keyHighlights: remoteData.keyHighlights || prev.keyHighlights
        }));
      }
    }, (err) => {
      console.warn("Firestore profile snapshot:", err);
    });

    return () => unsub();
  }, []);

  const handleSaveProfile = async (newProfile: ProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));
    } catch (err) {
      console.error(err);
    }

    // Also persist to Firestore
    try {
      await setDoc(doc(db, 'portfolio', 'profile'), {
        ...newProfile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn("Could not sync profile to Firestore (requires auth):", err);
    }
  };

  const handleResetProfile = () => {
    setProfile(initialProfile);
    setAccent('blue');
    setThemeMode('dark');
    try {
      localStorage.removeItem('portfolio_profile');
      localStorage.removeItem('portfolio_accent');
      localStorage.removeItem('portfolio_theme');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetAccent = (newAccent: AccentColor) => {
    setAccent(newAccent);
    try {
      localStorage.setItem('portfolio_accent', newAccent);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetThemeMode = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    try {
      localStorage.setItem('portfolio_theme', newMode);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setPrefilledService(serviceTitle);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      themeMode === 'light' 
        ? 'bg-[#f8fafc] text-zinc-900' 
        : 'bg-[#050505] text-white'
    }`}>
      {/* Navigation */}
      <Navbar
        profile={profile}
        accent={accent}
        setAccent={handleSetAccent}
        themeMode={themeMode}
        setThemeMode={handleSetThemeMode}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero */}
        <Hero
          profile={profile}
          accent={accent}
          themeMode={themeMode}
          onExploreProjects={() => {
            const el = document.getElementById('projects');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        />

        {/* 2. Real-Time AI Voice Assistant Showcase */}
        <VoiceAssistantSection
          onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
          accent={accent}
          themeMode={themeMode}
        />

        {/* 3. About Me */}
        <About
          profile={profile}
          accent={accent}
          themeMode={themeMode}
        />

        {/* 4. Skills Matrix */}
        <Skills
          skillsData={skills}
          accent={accent}
          themeMode={themeMode}
        />

        {/* 5. Featured Projects */}
        <Projects
          projects={projects}
          accent={accent}
          themeMode={themeMode}
        />

        {/* 6. Career Experience */}
        <Experience
          experienceList={experience}
          accent={accent}
          themeMode={themeMode}
        />

        {/* 7. Services & Consulting */}
        <Services
          services={services}
          accent={accent}
          themeMode={themeMode}
          onSelectService={handleSelectService}
        />

        {/* 8. Testimonials */}
        <Testimonials
          testimonials={testimonials}
          accent={accent}
          themeMode={themeMode}
        />

        {/* 9. Technical Articles */}
        <Articles
          articles={articles}
          accent={accent}
          themeMode={themeMode}
        />

        {/* 10. Google Forms Client Discovery & Feedback */}
        <GoogleFormsSection
          accent={accent}
          themeMode={themeMode}
        />

        {/* 11. Live Firebase Guestbook */}
        <Guestbook
          accent={accent}
          themeMode={themeMode}
        />

        {/* 12. Contact Form with Firestore Ingestion */}
        <Contact
          profile={profile}
          accent={accent}
          themeMode={themeMode}
          prefilledSubject={prefilledService}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        accent={accent}
        themeMode={themeMode}
      />

      {/* Floating Voice Assistant Trigger */}
      <VoiceFloatingButton
        onClick={() => setIsVoiceModalOpen(true)}
        accent={accent}
      />

      {/* Interactive Gemini Live Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        accent={accent}
        themeMode={themeMode}
      />

      {/* Live Customizer Modal */}
      <LiveEditorModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetDefault={handleResetProfile}
        accent={accent}
        setAccent={handleSetAccent}
        themeMode={themeMode}
        setThemeMode={handleSetThemeMode}
      />
    </div>
  );
}
