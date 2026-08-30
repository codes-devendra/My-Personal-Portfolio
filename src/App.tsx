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
import { AuthModal, AuthTab } from './components/AuthModal';
import { AuthGateScreen } from './components/AuthGateScreen';
import { 
  initialProfile, initialProjects, initialSkills, 
  initialExperience, initialServices, initialTestimonials, initialArticles 
} from './data/initialData';
import { ProfileData, Project, SkillCategory, Experience as ExperienceType, Service, Testimonial, Article, AccentColor, ThemeMode } from './types';
import { db, doc, onSnapshot, setDoc, auth, onAuthStateChanged, signOut, User } from './lib/firebase';

const OWNER_EMAILS = ['solankidevendra726@gmail.com', 'shobhasolanki230@gmail.com'];

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
      return (saved as AccentColor) || 'rose';
    } catch {
      return 'rose';
    }
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme');
      return (saved as ThemeMode) || 'light';
    } catch {
      return 'light';
    }
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('user_login');
  const [prefilledService, setPrefilledService] = useState<string | undefined>(undefined);

  // Authentication State
  const [authInitialized, setAuthInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | any>(() => {
    try {
      const stored = localStorage.getItem('portfolio_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('portfolio_owner_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  // Track Firebase Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          localStorage.setItem('portfolio_current_user', JSON.stringify(user));
        } catch {}
        if (user.email && OWNER_EMAILS.some(e => e.toLowerCase() === user.email?.toLowerCase())) {
          setIsOwner(true);
          sessionStorage.setItem('portfolio_owner_unlocked', 'true');
        }
      }
      setAuthInitialized(true);
    });
    return () => unsub();
  }, []);

  // Sync profile with Firestore if remote exists
  useEffect(() => {
    let isCancelled = false;
    let unsub: (() => void) | null = null;

    try {
      unsub = onSnapshot(doc(db, 'portfolio', 'profile'), (snap) => {
        if (isCancelled) return;
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
      }, (_err) => {
        // If Firestore is not provisioned or offline, cancel subscription to avoid polling warnings
        if (unsub) {
          unsub();
          unsub = null;
        }
      });
    } catch {
      // Graceful fallback to local state
    }

    return () => {
      isCancelled = true;
      if (unsub) unsub();
    };
  }, []);

  const handleSaveProfile = async (newProfile: ProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));
    } catch (err) {
      // LocalStorage fallback
    }

    // Only attempt to persist to Firestore if the user is authenticated
    if (currentUser) {
      try {
        await setDoc(doc(db, 'portfolio', 'profile'), {
          ...newProfile,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (_err) {
        // Quietly fallback to local state
      }
    }
  };

  const handleResetProfile = () => {
    setProfile(initialProfile);
    setAccent('rose');
    setThemeMode('light');
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

  const handleOpenAuth = (tab: AuthTab = 'user_login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (_err) {
      // Quiet sign out
    }
    setCurrentUser(null);
    setIsOwner(false);
    try {
      sessionStorage.removeItem('portfolio_owner_unlocked');
      localStorage.removeItem('portfolio_current_user');
    } catch {}
  };

  const handleGateAuthenticated = (user: any, isOwnerUser: boolean) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('portfolio_current_user', JSON.stringify(user));
    } catch {}
    if (isOwnerUser) {
      setIsOwner(true);
      sessionStorage.setItem('portfolio_owner_unlocked', 'true');
    }
  };

  // 1. Mandatory Gate: Everyone MUST login or sign up to access the website
  const isAccessAllowed = Boolean(currentUser || isOwner);

  if (authInitialized && !isAccessAllowed) {
    return (
      <AuthGateScreen
        onAuthenticated={handleGateAuthenticated}
        accent={accent}
        themeMode={themeMode}
        profile={profile}
      />
    );
  }

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
        currentUser={currentUser}
        isOwner={isOwner}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
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
        isOwnerUser={isOwner}
      />

      {/* Dedicated Login / Owner Login / Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        isOwner={isOwner}
        onOwnerStatusChange={setIsOwner}
        accent={accent}
        themeMode={themeMode}
        profile={profile}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        initialTab={authModalTab}
      />
    </div>
  );
}
