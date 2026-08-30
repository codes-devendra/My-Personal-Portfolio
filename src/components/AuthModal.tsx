import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User, Shield, ShieldCheck, KeyRound, 
  ArrowRight, Check, Eye, EyeOff, Sparkles, AlertCircle, LogOut,
  Sliders, RefreshCw
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  githubProvider, 
  facebookProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut,
  db,
  doc,
  setDoc,
  User as FirebaseUser
} from '../lib/firebase';
import { AccentColor, ThemeMode, ProfileData } from '../types';
import { accentThemes } from '../utils/theme';

export type AuthTab = 'user_login' | 'owner_login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  isOwner: boolean;
  onOwnerStatusChange: (isOwner: boolean) => void;
  accent: AccentColor;
  themeMode: ThemeMode;
  profile: ProfileData;
  onOpenCustomizer?: () => void;
  initialTab?: AuthTab;
}

const OWNER_PASSWORDS = ['devendra2026', 'owner2026', 'admin2026', 'shobha2026'];
const OWNER_EMAILS = ['solankidevendra726@gmail.com', 'shobhasolanki230@gmail.com'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isOwner,
  onOwnerStatusChange,
  accent,
  themeMode,
  profile,
  onOpenCustomizer,
  initialTab = 'user_login'
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('Client / Hiring Manager');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Owner Login State
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const themeConfig = accentThemes[accent] || accentThemes.rose || accentThemes.blue;

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Auto elevate to owner if email matches portfolio owner
      if (user.email && OWNER_EMAILS.some(e => e.toLowerCase() === user.email?.toLowerCase())) {
        onOwnerStatusChange(true);
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
        setSuccessMessage(`Welcome back, Owner (${user.displayName || user.email})!`);
      } else {
        setSuccessMessage(`Signed in successfully as ${user.displayName || user.email}!`);
      }

      // Save user profile record in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email,
          avatarUrl: user.photoURL || '',
          provider: 'google.com',
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore user record write notice:', err);
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      setErrorMessage(error.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  // GitHub Sign In
  const handleGithubSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      if (user.email && OWNER_EMAILS.some(e => e.toLowerCase() === user.email?.toLowerCase())) {
        onOwnerStatusChange(true);
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      }
      setSuccessMessage(`Signed in with GitHub as ${user.displayName || user.email}!`);
      setTimeout(() => onClose(), 900);
    } catch (error: any) {
      console.warn('GitHub Sign In notice:', error);
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        setErrorMessage('GitHub OAuth is not yet enabled in Firebase Console. Please use Google or Email login.');
      } else {
        setErrorMessage(error.message || 'GitHub sign in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Facebook Sign In
  const handleFacebookSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      if (user.email && OWNER_EMAILS.some(e => e.toLowerCase() === user.email?.toLowerCase())) {
        onOwnerStatusChange(true);
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      }
      setSuccessMessage(`Signed in with Facebook as ${user.displayName || user.email}!`);
      setTimeout(() => onClose(), 900);
    } catch (error: any) {
      console.warn('Facebook Sign In notice:', error);
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        setErrorMessage('Facebook OAuth is not yet configured in Firebase Console. Please use Google or Email login.');
      } else {
        setErrorMessage(error.message || 'Facebook sign in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const user = result.user;
      
      if (user.email && OWNER_EMAILS.some(e => e.toLowerCase() === user.email?.toLowerCase())) {
        onOwnerStatusChange(true);
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
        setSuccessMessage(`Welcome back, Owner (${user.displayName || user.email})!`);
      } else {
        setSuccessMessage(`Welcome back, ${user.displayName || user.email}!`);
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (error: any) {
      console.error('Email Sign In Error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. New user? Click the "Sign Up" tab above!');
      } else {
        setErrorMessage(error.message || 'Failed to sign in with email.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, signupEmail.trim(), signupPassword);
      const user = result.user;

      // Update user display name
      await updateProfile(user, {
        displayName: signupName.trim()
      });

      // Save user doc
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: signupName.trim(),
          email: user.email,
          role: signupRole,
          createdAt: new Date().toISOString(),
          provider: 'password'
        }, { merge: true });
      } catch (err) {
        console.warn('User profile sync:', err);
      }

      setSuccessMessage(`Account created successfully! Welcome, ${signupName}!`);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (error: any) {
      console.error('Sign Up Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Please sign in instead.');
      } else {
        setErrorMessage(error.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Owner PIN / Master Password Authentication
  const handleOwnerUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = ownerPassword.trim().toLowerCase();
    
    if (OWNER_PASSWORDS.includes(cleanPwd)) {
      onOwnerStatusChange(true);
      sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      setSuccessMessage('Owner access granted! Customizer tabs and administrative privileges unlocked.');
      setOwnerPassword('');
      setErrorMessage(null);
      setTimeout(() => {
        onClose();
        if (onOpenCustomizer) {
          onOpenCustomizer();
        }
      }, 800);
    } else {
      setErrorMessage('Incorrect owner password. Please enter the valid owner authorization key.');
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      onOwnerStatusChange(false);
      sessionStorage.removeItem('portfolio_owner_unlocked');
      setSuccessMessage('Signed out successfully.');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage('Error signing out: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-md flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          themeMode === 'light'
            ? 'bg-white border-zinc-200 text-zinc-900'
            : 'bg-[#0f0f13] border-zinc-800 text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          themeMode === 'light' ? 'bg-zinc-50/70 border-zinc-200' : 'bg-zinc-950/70 border-zinc-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: themeConfig.hex }}
            >
              {activeTab === 'owner_login' ? (
                <Shield className="w-4 h-4" />
              ) : activeTab === 'signup' ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className={`font-display font-bold text-sm tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                {activeTab === 'owner_login' 
                  ? 'Owner Authentication' 
                  : activeTab === 'signup' 
                    ? 'Create Portfolio Account' 
                    : 'Portfolio Sign In'}
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                {activeTab === 'owner_login'
                  ? 'Master controls & live customizer access'
                  : 'Connect with Google, socials, or email'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              themeMode === 'light'
                ? 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className={`px-4 pt-3 pb-0 border-b flex items-center justify-between gap-1 ${
          themeMode === 'light' ? 'bg-zinc-100/60 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
        }`}>
          <button
            id="tab-user-login"
            onClick={() => {
              setActiveTab('user_login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'user_login'
                ? themeMode === 'light'
                  ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                  : 'border-white text-white bg-zinc-900 shadow-xs'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User Login</span>
          </button>

          <button
            id="tab-owner-login"
            onClick={() => {
              setActiveTab('owner_login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'owner_login'
                ? themeMode === 'light'
                  ? 'border-amber-500 text-amber-600 bg-white shadow-xs'
                  : 'border-amber-400 text-amber-400 bg-zinc-900 shadow-xs'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Owner Login</span>
            {isOwner && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
          </button>

          <button
            id="tab-user-signup"
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? themeMode === 'light'
                  ? 'border-emerald-600 text-emerald-600 bg-white shadow-xs'
                  : 'border-emerald-400 text-emerald-400 bg-zinc-900 shadow-xs'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Active User Notification */}
          {currentUser && (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
              isOwner 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
            }`}>
              <div className="flex items-center gap-2.5 overflow-hidden">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-8 h-8 rounded-full border border-white/20 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="truncate">
                  <div className="text-xs font-bold truncate text-zinc-100 flex items-center gap-1.5">
                    <span>{currentUser.displayName || 'Signed In'}</span>
                    {isOwner && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                        Owner
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <button
                id="btn-auth-signout"
                onClick={handleSignOut}
                disabled={loading}
                title="Sign Out"
                className="p-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 shrink-0" />
              <div>{successMessage}</div>
            </div>
          )}

          {/* TAB 1: USER SIGN IN */}
          {activeTab === 'user_login' && (
            <div className="space-y-4">
              
              {/* Quick Social Buttons with Brand Colors */}
              <div className="space-y-2.5">
                <button
                  id="btn-auth-google"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md active:scale-[0.99] ${
                    themeMode === 'light'
                      ? 'bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-900'
                      : 'bg-[#18181b] hover:bg-[#27272a] border-zinc-700 text-white'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    id="btn-auth-github"
                    type="button"
                    onClick={handleGithubSignIn}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-[#24292e] hover:bg-[#1b1f23] text-white border border-[#444c56] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </button>

                  <button
                    id="btn-auth-facebook"
                    type="button"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white border border-[#1877F2] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-zinc-700/50"></div>
                <span className="shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">or with email</span>
                <div className="grow border-t border-zinc-700/50"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-blue-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                      themeMode === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Password</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="input-login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-3.5 pr-9 py-2 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        themeMode === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-email-login"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:opacity-95 mt-2"
                  style={{ backgroundColor: themeConfig.hex }}
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>Sign In with Email</span>
                </button>
              </form>

              <div className="text-center pt-2 text-xs text-zinc-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-blue-400 hover:underline font-medium"
                >
                  Sign up here
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: OWNER LOGIN */}
          {activeTab === 'owner_login' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${
                themeMode === 'light' ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
              }`}>
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Owner & Administrator Portal</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Logging in as the portfolio owner grants full editing permissions to customize profile details, bio stats, and social links.
                </p>
              </div>

              {/* Owner Password Form */}
              <form onSubmit={handleOwnerUnlock} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3 text-amber-400" />
                    <span>Owner Secret PIN / Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="input-owner-password"
                      type={showOwnerPassword ? 'text' : 'password'}
                      required
                      value={ownerPassword}
                      onChange={(e) => {
                        setOwnerPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Enter owner secret key..."
                      className={`w-full pl-3.5 pr-9 py-2.5 rounded-xl text-xs font-mono border focus:outline-hidden transition-colors ${
                        themeMode === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-amber-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200"
                    >
                      {showOwnerPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-owner-login"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:opacity-95 bg-amber-600 hover:bg-amber-500"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate as Owner</span>
                </button>
              </form>

              {/* Direct 1-click Google option for owner */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-700/60 hover:bg-zinc-800 text-xs font-medium text-zinc-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Or sign in with owner Google account</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: USER SIGN UP */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
              
              {/* Quick Google Sign Up */}
              <button
                id="btn-signup-google"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                  themeMode === 'light'
                    ? 'bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-800'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-100'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                </svg>
                <span>Sign Up with Google</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-zinc-700/50"></div>
                <span className="shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">or sign up with email</span>
                <div className="grow border-t border-zinc-700/50"></div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-blue-400" />
                    <span>Your Full Name</span>
                  </label>
                  <input
                    id="input-signup-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                      themeMode === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-emerald-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    id="input-signup-email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                      themeMode === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-400'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-medium text-zinc-400">
                      Primary Interest
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        themeMode === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                      }`}
                    >
                      <option value="Client / Hiring Manager">Client / Hiring</option>
                      <option value="Recruiter / Talent Scout">Recruiter</option>
                      <option value="Fellow Engineer / Collaborator">Collaborator</option>
                      <option value="Visitor / Reader">Visitor</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-rose-400" />
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="input-signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className={`w-full px-3 pr-8 py-2 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                          themeMode === 'light'
                            ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-200"
                      >
                        {showSignupPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-submit-signup"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:opacity-95 mt-2 bg-emerald-600 hover:bg-emerald-500"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Create Free Account</span>
                </button>
              </form>

              <div className="text-center pt-2 text-xs text-zinc-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('user_login')}
                  className="text-blue-400 hover:underline font-medium"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer / Info */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-[11px] font-mono text-zinc-400 ${
          themeMode === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Secure Firebase Auth</span>
          </div>
          {isOwner && onOpenCustomizer && (
            <button
              onClick={() => {
                onClose();
                onOpenCustomizer();
              }}
              className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-xs"
            >
              <Sliders className="w-3 h-3" />
              <span>Open Customizer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
