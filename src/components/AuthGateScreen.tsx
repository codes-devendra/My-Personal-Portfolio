import React, { useState } from 'react';
import { 
  Lock, Shield, User, Sparkles, AlertCircle, ArrowRight, Eye, EyeOff, 
  Github, Globe, RefreshCw, KeyRound, Check, LogIn
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
  db,
  doc,
  setDoc,
  User as FirebaseUser
} from '../lib/firebase';
import { AccentColor, ThemeMode, ProfileData } from '../types';
import { accentThemes } from '../utils/theme';

export type GateTab = 'user_login' | 'signup' | 'owner_login';

interface AuthGateScreenProps {
  onAuthenticated: (user: FirebaseUser, isOwnerUser: boolean) => void;
  accent: AccentColor;
  themeMode: ThemeMode;
  profile: ProfileData;
}

const OWNER_EMAIL = 'shobhasolanki230@gmail.com';
const OWNER_PASSWORDS = ['owner2026', 'admin2026', 'shobha2026'];

export const AuthGateScreen: React.FC<AuthGateScreenProps> = ({
  onAuthenticated,
  accent,
  themeMode,
  profile
}) => {
  const [activeTab, setActiveTab] = useState<GateTab>('user_login');
  
  // User Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // User Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('Client / Hiring Manager');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Owner Secret Gateway State
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const themeConfig = accentThemes[accent] || accentThemes.blue;

  // Google Popup Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isOwnerAccount = Boolean(
        user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()
      );

      if (isOwnerAccount) {
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      }

      // Record profile in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email,
          photoURL: user.photoURL || null,
          role: isOwnerAccount ? 'Portfolio Owner' : 'Visitor / Client',
          lastLoginAt: new Date().toISOString(),
          provider: 'google'
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore user doc write:', err);
      }

      setSuccessMessage(`Welcome, ${user.displayName || user.email}!`);
      setTimeout(() => {
        onAuthenticated(user, isOwnerAccount);
      }, 500);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in window was closed. Please try again.');
      } else {
        setErrorMessage(error.message || 'Google sign in failed.');
      }
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
      const isOwnerAccount = Boolean(
        user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()
      );

      if (isOwnerAccount) {
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      }

      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || 'GitHub User',
          email: user.email,
          role: isOwnerAccount ? 'Portfolio Owner' : 'Developer / Visitor',
          lastLoginAt: new Date().toISOString(),
          provider: 'github'
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore user doc write:', err);
      }

      setSuccessMessage(`Welcome, ${user.displayName || user.email}!`);
      setTimeout(() => {
        onAuthenticated(user, isOwnerAccount);
      }, 500);
    } catch (error: any) {
      console.warn('GitHub Sign In notice:', error);
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        setErrorMessage('GitHub OAuth is not yet enabled in Firebase Console. Please use Google or Email.');
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
      const isOwnerAccount = Boolean(
        user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()
      );

      if (isOwnerAccount) {
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      }

      setSuccessMessage(`Welcome, ${user.displayName || user.email}!`);
      setTimeout(() => {
        onAuthenticated(user, isOwnerAccount);
      }, 500);
    } catch (error: any) {
      console.warn('Facebook Sign In notice:', error);
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        setErrorMessage('Facebook OAuth is not enabled in Firebase Console. Please use Google or Email.');
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
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const user = result.user;
      const isOwnerAccount = Boolean(
        user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()
      );

      if (isOwnerAccount) {
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      }

      setSuccessMessage(`Welcome back, ${user.displayName || user.email}!`);
      setTimeout(() => {
        onAuthenticated(user, isOwnerAccount);
      }, 500);
    } catch (error: any) {
      console.error('Email Sign In Error:', error);
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential'
      ) {
        setErrorMessage('Invalid email or password. New user? Click "Sign Up" above to create an account.');
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
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, signupEmail.trim(), signupPassword);
      const user = result.user;

      await updateProfile(user, {
        displayName: signupName.trim()
      });

      const isOwnerAccount = Boolean(
        user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()
      );

      if (isOwnerAccount) {
        sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      }

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

      setSuccessMessage(`Account created! Welcome, ${signupName}!`);
      setTimeout(() => {
        onAuthenticated(user, isOwnerAccount);
      }, 500);
    } catch (error: any) {
      console.error('Sign Up Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Please switch to "User Login".');
      } else {
        setErrorMessage(error.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Owner Secret Passcode Authentication
  const handleOwnerUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = ownerPassword.trim().toLowerCase();

    if (OWNER_PASSWORDS.includes(cleanPwd)) {
      sessionStorage.setItem('portfolio_owner_unlocked', 'true');
      setSuccessMessage('Owner access granted! Master password verified & administrative rights unlocked.');
      setOwnerPassword('');
      setErrorMessage(null);

      // Create synthetic owner user if no firebase user is logged in
      const ownerUser = auth.currentUser || ({
        uid: 'owner-session',
        email: OWNER_EMAIL,
        displayName: profile.name,
        photoURL: profile.avatarUrl || null,
        emailVerified: true
      } as unknown as FirebaseUser);

      setTimeout(() => {
        onAuthenticated(ownerUser, true);
      }, 600);
    } else {
      setErrorMessage('Incorrect owner secret key. Only the portfolio owner can access this gate.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-200 ${
      themeMode === 'light' ? 'bg-[#f4f6fb] text-zinc-900' : 'bg-[#060608] text-white'
    }`}>
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: themeConfig.hex }}
        />
        <div 
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: themeConfig.hex }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md my-8">
        
        {/* Profile / Site Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl font-display font-extrabold text-2xl"
              style={{ backgroundColor: themeConfig.hex }}
            >
              {profile.name.charAt(0)}
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight">
            {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-mono">
            {profile.role}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full text-[11px] font-mono border bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Lock className="w-3 h-3" />
            <span>Authentication Required to Access Portfolio</span>
          </div>
        </div>

        {/* Card Container */}
        <div className={`rounded-3xl border shadow-2xl overflow-hidden transition-all backdrop-blur-xl ${
          themeMode === 'light'
            ? 'bg-white/95 border-zinc-200 text-zinc-900'
            : 'bg-[#0f0f13]/95 border-zinc-800 text-zinc-100'
        }`}>
          
          {/* Gate Tabs */}
          <div className={`flex border-b pt-3 px-4 gap-1 ${
            themeMode === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'
          }`}>
            <button
              id="gate-tab-login"
              type="button"
              onClick={() => {
                setActiveTab('user_login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'user_login'
                  ? themeMode === 'light'
                    ? 'border-blue-600 text-blue-600 bg-white shadow-xs font-bold'
                    : 'border-blue-400 text-blue-400 bg-zinc-900 shadow-xs font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Login</span>
            </button>

            <button
              id="gate-tab-signup"
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? themeMode === 'light'
                    ? 'border-emerald-600 text-emerald-600 bg-white shadow-xs font-bold'
                    : 'border-emerald-400 text-emerald-400 bg-zinc-900 shadow-xs font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>

            <button
              id="gate-tab-owner"
              type="button"
              onClick={() => {
                setActiveTab('owner_login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'owner_login'
                  ? themeMode === 'light'
                    ? 'border-amber-500 text-amber-600 bg-white shadow-xs font-bold'
                    : 'border-amber-400 text-amber-400 bg-zinc-900 shadow-xs font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>
          </div>

          {/* Form Area */}
          <div className="p-6 space-y-4">
            
            {/* Feedback Notifications */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{successMessage}</div>
              </div>
            )}

            {/* TAB 1: USER LOGIN */}
            {activeTab === 'user_login' && (
              <div className="space-y-4">
                
                {/* 1-Click Social Sign-In */}
                <div className="space-y-2">
                  <button
                    id="btn-gate-google-signin"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleGithubSignIn}
                      disabled={loading}
                      className="py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFacebookSignIn}
                      disabled={loading}
                      className="py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>Facebook</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
                  <span className="bg-white dark:bg-[#0f0f13] px-3 text-[11px] font-mono text-zinc-400 shrink-0">
                    or with email
                  </span>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-medium text-zinc-400">Email Address</label>
                    <input
                      id="gate-login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        themeMode === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-400'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-medium text-zinc-400">Password</label>
                    <div className="relative">
                      <input
                        id="gate-login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-3.5 pr-9 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
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
                    id="btn-gate-submit-login"
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:opacity-95 mt-2"
                    style={{ backgroundColor: themeConfig.hex }}
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                    <span>Sign In & Unlock Website</span>
                  </button>
                </form>

                <div className="text-center pt-2 text-xs text-zinc-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="text-blue-400 hover:underline font-semibold"
                  >
                    Sign up here
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SIGN UP */}
            {activeTab === 'signup' && (
              <form onSubmit={handleEmailSignUp} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400">Full Name *</label>
                  <input
                    id="gate-signup-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                      themeMode === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900 focus:border-emerald-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-emerald-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400">Email Address *</label>
                  <input
                    id="gate-signup-email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                      themeMode === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900 focus:border-emerald-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-emerald-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400">Role / Purpose</label>
                  <select
                    id="gate-signup-role"
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                      themeMode === 'light'
                        ? 'bg-white border-zinc-300 text-zinc-900'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <option value="Client / Hiring Manager">Client / Hiring Manager</option>
                    <option value="Recruiter / Talent Scout">Recruiter / Talent Scout</option>
                    <option value="Fellow Developer / Collaborator">Fellow Developer / Collaborator</option>
                    <option value="Visitor / Portfolio Explorer">Visitor / Portfolio Explorer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-medium text-zinc-400">Create Password (min. 6 chars) *</label>
                  <div className="relative">
                    <input
                      id="gate-signup-password"
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-3.5 pr-9 py-2.5 rounded-xl text-xs border focus:outline-hidden transition-colors ${
                        themeMode === 'light'
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-emerald-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-emerald-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-gate-submit-signup"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:opacity-95 bg-emerald-600 hover:bg-emerald-500 mt-3"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Create Account & Enter Portfolio</span>
                </button>

                <div className="text-center pt-2 text-xs text-zinc-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('user_login')}
                    className="text-blue-400 hover:underline font-semibold"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: OWNER LOGIN PORTAL */}
            {activeTab === 'owner_login' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border ${
                  themeMode === 'light' ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs mb-1">
                    <Shield className="w-4 h-4" />
                    <span>Portfolio Owner Portal</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Exclusive gateway for {profile.name}. Authenticating here unlocks live profile editing, customizer settings, and administrative privileges.
                  </p>
                </div>

                <form onSubmit={handleOwnerUnlock} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1.5">
                      <KeyRound className="w-3 h-3 text-amber-400" />
                      <span>Owner Master Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="gate-owner-password"
                        type={showOwnerPassword ? 'text' : 'password'}
                        required
                        value={ownerPassword}
                        onChange={(e) => {
                          setOwnerPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Enter owner secret master password..."
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
                    id="btn-gate-submit-owner"
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:opacity-95 bg-amber-600 hover:bg-amber-500 mt-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Authenticate & Access Owner Mode</span>
                  </button>
                </form>

                {/* Owner One-Click Google Auth for verified owner email */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Or Sign in with {OWNER_EMAIL}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Card Footer Note */}
          <div className={`p-4 border-t text-center text-[11px] font-mono ${
            themeMode === 'light' ? 'bg-zinc-50/80 border-zinc-200 text-zinc-500' : 'bg-zinc-950/40 border-zinc-800 text-zinc-500'
          }`}>
            <span>Protected Portfolio Experience • Secure Firebase Auth</span>
          </div>

        </div>
      </div>
    </div>
  );
};
