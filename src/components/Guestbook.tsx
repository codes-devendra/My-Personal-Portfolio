import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, LogIn, LogOut, Trash2, Clock } from 'lucide-react';
import { AccentColor, ThemeMode } from '../types';
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

export const Guestbook: React.FC<GuestbookProps> = ({ themeMode }) => {
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
    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(25)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: GuestbookEntry[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<GuestbookEntry, 'id'>)
        }));
        setEntries(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Guestbook snapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
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
    try {
      await addDoc(collection(db, path), {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous Guest',
        userAvatar: currentUser.photoURL || '',
        message: newMessage.trim().slice(0, 500),
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string, authorId: string) => {
    if (!currentUser || currentUser.uid !== authorId) return;
    const path = `guestbook/${entryId}`;
    try {
      await deleteDoc(doc(db, 'guestbook', entryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
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
          <p className="text-[#a1a1aa] text-base mt-2">
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
                  <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                    <div className="flex items-center gap-3">
                      {currentUser.photoURL && currentUser.photoURL.trim() !== '' ? (
                        <img 
                          src={currentUser.photoURL.trim()} 
                          alt={currentUser.displayName || 'User'} 
                          className="w-9 h-9 rounded-full border border-[#27272a]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                          {currentUser.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-white tracking-tight">
                          {currentUser.displayName}
                        </div>
                        <div className="text-xs font-mono text-[#a1a1aa]">
                          Verified Visitor
                        </div>
                      </div>
                    </div>

                    <button
                      id="btn-guestbook-signout"
                      onClick={handleSignOut}
                      className="p-2 rounded-lg text-xs font-mono text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-colors flex items-center gap-1.5"
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
                          ? 'bg-slate-50 border-slate-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500'
                          : 'bg-[#050505] border-[#27272a] text-white placeholder:text-zinc-600 focus:border-zinc-500'
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#a1a1aa]">
                        {500 - newMessage.length} characters left
                      </span>

                      <button
                        id="btn-guestbook-submit"
                        type="submit"
                        disabled={isSubmitting || !newMessage.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
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
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white tracking-tight">
                      Sign in to Leave a Message
                    </h3>
                    <p className="text-xs text-[#a1a1aa] mt-1 max-w-xs mx-auto">
                      Use your Google account to verify your name and join the public portfolio guestbook.
                    </p>
                  </div>
                  <button
                    id="btn-guestbook-google-signin"
                    onClick={handleSignIn}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-all shadow-md"
                  >
                    <LogIn className="w-4 h-4" />
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
              <div className="py-12 text-center text-[#a1a1aa] text-xs font-mono">
                Loading live guestbook entries from Firestore...
              </div>
            ) : entries.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center ${
                themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-[#111111] border-[#27272a]'
              }`}>
                <p className="text-sm text-[#a1a1aa]">No entries yet. Be the first to leave a greeting!</p>
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
                          className="w-7 h-7 rounded-full border border-[#27272a]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {entry.userName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold text-white tracking-tight">
                          {entry.userName}
                        </span>
                      </div>
                    </div>

                    {currentUser && currentUser.uid === entry.userId && (
                      <button
                        onClick={() => handleDelete(entry.id, entry.userId)}
                        className="p-1 text-[#a1a1aa] hover:text-rose-400 transition-colors"
                        title="Delete your entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed pl-9">
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
