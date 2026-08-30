import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, LogIn, LogOut, Trash2 } from 'lucide-react';
import { AccentColor, ThemeMode } from '../types';
import { accentThemes } from '../utils/theme';
import { 
  db, auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser,
  collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, deleteDoc, doc,
  handleFirestoreError, OperationType
} from '../lib/firebase';

interface GuestbookProps {
  accent: AccentColor;
  themeMode: ThemeMode;
}

interface GuestbookEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  createdAt?: { seconds: number; nanoseconds: number } | string | null;
}

export const Guestbook: React.FC<GuestbookProps> = ({ accent, themeMode }) => {
  const themeConfig = accentThemes[accent] || accentThemes.rose || accentThemes.blue;
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Realtime Guestbook from Firestore
  useEffect(() => {
    let isCancelled = false;
    let unsub: (() => void) | null = null;

    try {
      const q = query(
        collection(db, 'guestbook'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      unsub = onSnapshot(
        q,
        (snapshot) => {
          if (isCancelled) return;
          const docs: GuestbookEntry[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<GuestbookEntry, 'id'>)
          }));
          setEntries(docs);
          try {
            localStorage.setItem('portfolio_guestbook_entries', JSON.stringify(docs));
          } catch {}
          setLoading(false);
        },
        (_err) => {
          // If Firestore is unprovisioned or returns not found, stop listener polling
          if (unsub) {
            unsub();
            unsub = null;
          }
          // Load from local storage cache if available
          try {
            const cached = localStorage.getItem('portfolio_guestbook_entries');
            if (cached) {
              setEntries(JSON.parse(cached));
            }
          } catch {}
          if (!isCancelled) setLoading(false);
        }
      );
    } catch {
      try {
        const cached = localStorage.getItem('portfolio_guestbook_entries');
        if (cached) setEntries(JSON.parse(cached));
      } catch {}
      setLoading(false);
    }

    return () => {
      isCancelled = true;
      if (unsub) unsub();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Google Sign-In was cancelled or encountered an issue.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const path = 'guestbook';
    const localEntry: GuestbookEntry = {
      id: `local-${Date.now()}`,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous Guest',
      userAvatar: currentUser.photoURL || '',
      message: newMessage.trim().slice(0, 500),
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
    };

    try {
      await addDoc(collection(db, path), {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous Guest',
        userAvatar: currentUser.photoURL || '',
        message: newMessage.trim().slice(0, 500),
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (_err) {
      // Fallback to local state if Firestore database is unprovisioned
      setEntries((prev) => {
        const updated = [localEntry, ...prev.filter(e => e.id !== localEntry.id)];
        try {
          localStorage.setItem('portfolio_guestbook_entries', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setNewMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string, authorId: string) => {
    if (!currentUser || currentUser.uid !== authorId) return;
    const path = `guestbook/${entryId}`;
    try {
      await deleteDoc(doc(db, 'guestbook', entryId));
    } catch (_err) {
      // Fallback local deletion
    }
    setEntries((prev) => {
      const updated = prev.filter(e => e.id !== entryId);
      try {
        localStorage.setItem('portfolio_guestbook_entries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <section 
      id="guestbook" 
      className={`py-24 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-slate-50/50 border-slate-200' 
          : 'bg-[#050505] border-[#27272a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] mb-3 border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Guestbook</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            Leave a Note or Greeting
          </h2>
          <p className={`text-base mt-2 ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
            Connect directly via Google Authentication and sign the real-time public guestbook powered by Firebase Firestore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form & Auth Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-7 rounded-2xl border ${
              themeMode === 'light'
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-[#111111] border-[#27272a]'
            }`}>
              {currentUser ? (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between pb-3 border-b ${
                    themeMode === 'light' ? 'border-slate-200' : 'border-[#27272a]'
                  }`}>
                    <div className="flex items-center gap-3">
                      {currentUser.photoURL && currentUser.photoURL.trim() !== '' ? (
                        <img 
                          src={currentUser.photoURL.trim()} 
                          alt={currentUser.displayName || 'User'} 
                          className="w-9 h-9 rounded-full border border-slate-300 dark:border-[#27272a]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ backgroundColor: `${themeConfig.hex}20`, color: themeConfig.hex }}
                        >
                          {currentUser.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <div className={`text-sm font-bold tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                          {currentUser.displayName}
                        </div>
                        <div className={`text-xs font-mono ${themeMode === 'light' ? 'text-zinc-500' : 'text-[#a1a1aa]'}`}>
                          Verified Visitor
                        </div>
                      </div>
                    </div>

                    <button
                      id="btn-guestbook-signout"
                      onClick={handleSignOut}
                      className={`p-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                        themeMode === 'light'
                          ? 'text-zinc-600 hover:text-zinc-900 hover:bg-slate-100'
                          : 'text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]'
                      }`}
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                      id="guestbook-input-message"
                      rows={3}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Say hello, share feedback on a project, or drop a quick note..."
                      maxLength={500}
                      required
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500'
                          : 'bg-[#050505] border-[#27272a] text-white placeholder:text-zinc-600 focus:border-zinc-500'
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono ${themeMode === 'light' ? 'text-zinc-500' : 'text-[#a1a1aa]'}`}>
                        {500 - newMessage.length} characters left
                      </span>

                      <button
                        id="btn-guestbook-submit"
                        type="submit"
                        disabled={isSubmitting || !newMessage.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight text-white transition-opacity shadow-md disabled:opacity-50 hover:opacity-95"
                        style={{ backgroundColor: themeConfig.hex }}
                      >
                        {isSubmitting ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Sign Guestbook</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: `${themeConfig.hex}15`, color: themeConfig.hex }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-display font-bold text-base tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                      Sign in to Leave a Message
                    </h3>
                    <p className={`text-xs mt-1 max-w-xs mx-auto ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
                      Use your Google account to verify your name and join the public portfolio guestbook.
                    </p>
                  </div>
                  <button
                    id="btn-guestbook-google-signin"
                    onClick={handleSignIn}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-tight transition-all shadow-md hover:shadow-lg active:scale-[0.98] border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-3 text-xs text-rose-400 font-mono bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Entries Feed */}
          <div className="lg:col-span-7 space-y-3">
            {loading ? (
              <div className={`py-12 text-center text-xs font-mono ${themeMode === 'light' ? 'text-zinc-500' : 'text-[#a1a1aa]'}`}>
                Loading live guestbook entries from Firestore...
              </div>
            ) : entries.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center ${
                themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-[#111111] border-[#27272a]'
              }`}>
                <p className={`text-sm ${themeMode === 'light' ? 'text-zinc-600' : 'text-[#a1a1aa]'}`}>
                  No entries yet. Be the first to leave a greeting!
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <div 
                  key={entry.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    themeMode === 'light' 
                      ? 'bg-white border-slate-200 shadow-xs' 
                      : 'bg-[#111111] border-[#27272a] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      {entry.userAvatar && entry.userAvatar.trim() !== '' ? (
                        <img 
                          src={entry.userAvatar.trim()} 
                          alt={entry.userName || 'User'} 
                          className="w-7 h-7 rounded-full border border-slate-200 dark:border-[#27272a]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: `${themeConfig.hex}20`, color: themeConfig.hex }}
                        >
                          {entry.userName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <span className={`text-xs font-bold tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                          {entry.userName}
                        </span>
                      </div>
                    </div>

                    {currentUser && currentUser.uid === entry.userId && (
                      <button
                        onClick={() => handleDelete(entry.id, entry.userId)}
                        className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                        title="Delete your entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className={`text-sm leading-relaxed pl-9 ${themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    {entry.message}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
