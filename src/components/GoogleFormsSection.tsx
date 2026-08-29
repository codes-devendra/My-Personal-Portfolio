import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, Plus, ExternalLink, RefreshCw, LogIn, CheckCircle2, 
  Eye, ListFilter, AlertCircle, ArrowUpRight, BarChart2, ShieldCheck, 
  HelpCircle, ChevronRight, X
} from 'lucide-react';
import { AccentColor, ThemeMode } from '../types';
import { googleSignIn, initAuth, logout, getAccessToken } from '../lib/googleAuth';
import { 
  listUserGoogleForms, getGoogleForm, getGoogleFormResponses, 
  createPortfolioGoogleForm, FormSummary, FormDetails, FormResponsesList 
} from '../lib/googleForms';
import { User } from 'firebase/auth';

interface GoogleFormsSectionProps {
  accent: AccentColor;
  themeMode: ThemeMode;
}

export const GoogleFormsSection: React.FC<GoogleFormsSectionProps> = ({ themeMode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Forms state
  const [formsList, setFormsList] = useState<FormSummary[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [formsError, setFormsError] = useState<string | null>(null);

  // Selected Form Inspector
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [formResponses, setFormResponses] = useState<FormResponsesList | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [createTemplate, setCreateTemplate] = useState<'discovery' | 'feedback' | 'consultation' | 'custom'>('discovery');
  const [customFormTitle, setCustomFormTitle] = useState('');
  const [createSuccessMsg, setCreateSuccessMsg] = useState<string | null>(null);

  // Active View Tab inside Forms Section
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'responses'>('list');

  // Initialize Auth listener
  useEffect(() => {
    const unsub = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(!!token);
        if (token) {
          loadForms();
        }
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
      }
    );
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setHasToken(true);
        await loadForms();
      }
    } catch (err: unknown) {
      console.error("Google Forms Auth Error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setAuthError(msg.includes('popup_closed_by_user') ? 'Sign-in popup was closed.' : 'Google Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setHasToken(false);
    setFormsList([]);
    setSelectedFormId(null);
    setFormDetails(null);
    setFormResponses(null);
  };

  const loadForms = useCallback(async () => {
    setIsLoadingForms(true);
    setFormsError(null);
    try {
      const forms = await listUserGoogleForms();
      setFormsList(forms);
      if (forms.length > 0 && !selectedFormId) {
        loadFormDetails(forms[0].id);
      }
    } catch (err: unknown) {
      console.error("Failed to load forms:", err);
      setFormsError(err instanceof Error ? err.message : 'Could not fetch Google Forms.');
    } finally {
      setIsLoadingForms(false);
    }
  }, [selectedFormId]);

  const loadFormDetails = async (formId: string) => {
    setSelectedFormId(formId);
    setIsLoadingDetails(true);
    try {
      const [details, responses] = await Promise.all([
        getGoogleForm(formId),
        getGoogleFormResponses(formId).catch(() => ({ responses: [] }))
      ]);
      setFormDetails(details);
      setFormResponses(responses);
    } catch (err: unknown) {
      console.error("Failed to load form details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateSuccessMsg(null);
    setFormsError(null);

    try {
      const newForm = await createPortfolioGoogleForm(
        createTemplate, 
        createTemplate === 'custom' ? customFormTitle : undefined
      );
      setCreateSuccessMsg(`"${newForm.info.title}" created successfully in your Google Drive!`);
      await loadForms();
      setSelectedFormId(newForm.formId);
      setFormDetails(newForm);
      setActiveTab('list');
    } catch (err: unknown) {
      console.error("Create form failed:", err);
      setFormsError(err instanceof Error ? err.message : 'Failed to create form in Google Forms.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section 
      id="forms" 
      className={`py-24 border-t transition-colors ${
        themeMode === 'light' 
          ? 'bg-slate-50 border-slate-200' 
          : 'bg-[#050505] border-[#27272a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] mb-3 border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <FileText className="w-3.5 h-3.5" />
              <span>Google Forms Integration</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-white'}`}>
              Client Intake & Discovery Questionnaires
            </h2>
            <p className="text-[#a1a1aa] text-base mt-2">
              Connect Google Forms to generate structured client discovery briefs, collect feedback, and monitor real-time submissions directly within your workflow.
            </p>
          </div>

          {/* User Auth Bar */}
          <div>
            {hasToken && currentUser ? (
              <div className="flex items-center gap-3 p-2 pl-3 rounded-full bg-[#111111] border border-[#27272a]">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'Google User'} 
                    className="w-7 h-7 rounded-full border border-[#27272a]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
                    {currentUser.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="text-left pr-2">
                  <div className="text-xs font-bold text-white leading-none">
                    {currentUser.displayName || currentUser.email}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Forms API Connected</span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1 text-xs font-mono rounded-full bg-[#1a1a1a] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                id="btn-google-forms-signin"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-all shadow-md"
              >
                {isAuthenticating ? (
                  <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {!hasToken ? (
          /* Unauthenticated State View */
          <div className={`p-10 rounded-2xl border text-center max-w-3xl mx-auto ${
            themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-[#111111] border-[#27272a]'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold font-display tracking-tight text-white mb-2">
              Connect Your Google Account
            </h3>
            <p className="text-sm text-[#a1a1aa] max-w-lg mx-auto mb-6 leading-relaxed">
              Authenticate with Google to grant permission for this applet to create, view, and inspect Google Forms and responses on your behalf.
            </p>
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-all shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Connect Google Forms</span>
            </button>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-6">
            
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <button
                  id="tab-btn-forms-list"
                  onClick={() => setActiveTab('list')}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight transition-all flex items-center gap-2 ${
                    activeTab === 'list'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-[#111111] text-[#a1a1aa] border border-[#27272a] hover:text-white'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>My Google Forms ({formsList.length})</span>
                </button>

                <button
                  id="tab-btn-forms-create"
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight transition-all flex items-center gap-2 ${
                    activeTab === 'create'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-[#111111] text-[#a1a1aa] border border-[#27272a] hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Intake Form</span>
                </button>
              </div>

              <button
                onClick={loadForms}
                disabled={isLoadingForms}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#a1a1aa] hover:text-white bg-[#111111] border border-[#27272a] flex items-center gap-1.5 transition-colors"
                title="Refresh Forms"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForms ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {createSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{createSuccessMsg}</span>
                </div>
                <button onClick={() => setCreateSuccessMsg(null)} className="text-[#a1a1aa] hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {formsError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formsError}</span>
              </div>
            )}

            {/* TAB 1: FORMS LIST & INSPECTOR */}
            {activeTab === 'list' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Forms List */}
                <div className="lg:col-span-5 space-y-3">
                  {isLoadingForms ? (
                    <div className="p-8 rounded-2xl border border-[#27272a] bg-[#111111] text-center text-xs font-mono text-[#a1a1aa]">
                      Fetching forms from Google Drive...
                    </div>
                  ) : formsList.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-[#27272a] bg-[#111111] text-center space-y-3">
                      <p className="text-sm text-[#a1a1aa]">No Google Forms found in your Google Drive.</p>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200"
                      >
                        Create Your First Form
                      </button>
                    </div>
                  ) : (
                    formsList.map((form) => {
                      const isSelected = selectedFormId === form.id;
                      return (
                        <div
                          key={form.id}
                          onClick={() => loadFormDetails(form.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-500/10 border-purple-500/40 text-white shadow-md'
                              : 'bg-[#111111] border-[#27272a] hover:border-zinc-700 text-[#a1a1aa]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                                  {form.name}
                                </h4>
                                <div className="text-[11px] font-mono text-[#a1a1aa] mt-1">
                                  Modified {form.modifiedTime ? new Date(form.modifiedTime).toLocaleDateString() : 'Recently'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-purple-400 translate-x-1' : 'text-zinc-600'}`} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right: Selected Form Details & Responses */}
                <div className="lg:col-span-7">
                  {isLoadingDetails ? (
                    <div className="p-12 rounded-2xl border border-[#27272a] bg-[#111111] text-center text-xs font-mono text-[#a1a1aa]">
                      Loading form architecture and live responses...
                    </div>
                  ) : formDetails ? (
                    <div className="p-7 rounded-2xl border border-[#27272a] bg-[#111111] space-y-6">
                      
                      {/* Details Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#27272a]">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            FORM ID: {formDetails.formId.slice(0, 10)}...
                          </span>
                          <h3 className="text-xl font-extrabold font-display tracking-tight text-white mt-1">
                            {formDetails.info.title}
                          </h3>
                          {formDetails.info.description && (
                            <p className="text-xs text-[#a1a1aa] mt-1">
                              {formDetails.info.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {formDetails.responderUri && (
                            <a
                              href={formDetails.responderUri}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <span>Fill Form</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`https://docs.google.com/forms/d/${formDetails.formId}/edit`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full border border-[#27272a] hover:bg-[#1a1a1a] text-[#a1a1aa] hover:text-white transition-colors"
                            title="Edit in Google Forms"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Stat Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#050505] text-center">
                          <div className="text-2xl font-extrabold text-white">
                            {formDetails.items?.length || 0}
                          </div>
                          <div className="text-[11px] font-mono text-[#a1a1aa]">
                            Questions & Fields
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#050505] text-center">
                          <div className="text-2xl font-extrabold text-purple-400">
                            {formResponses?.responses?.length || 0}
                          </div>
                          <div className="text-[11px] font-mono text-[#a1a1aa]">
                            Live Submissions
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#27272a] bg-[#050505] text-center col-span-2 sm:col-span-1">
                          <div className="text-2xl font-extrabold text-emerald-400">
                            Active
                          </div>
                          <div className="text-[11px] font-mono text-[#a1a1aa]">
                            Status
                          </div>
                        </div>
                      </div>

                      {/* Form Questions Overview */}
                      <div>
                        <h4 className="text-xs uppercase font-mono font-bold text-[#a1a1aa] tracking-wider mb-3">
                          Question Items ({formDetails.items?.length || 0})
                        </h4>
                        <div className="space-y-2">
                          {formDetails.items && formDetails.items.length > 0 ? (
                            formDetails.items.map((item, idx) => (
                              <div key={item.itemId || idx} className="p-3 rounded-xl border border-[#27272a] bg-[#050505] flex items-start gap-3">
                                <span className="w-5 h-5 rounded-md bg-[#1a1a1a] text-[#a1a1aa] flex items-center justify-center text-[10px] font-mono shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="text-left">
                                  <div className="text-xs font-bold text-white tracking-tight">
                                    {item.title}
                                  </div>
                                  {item.description && (
                                    <div className="text-[11px] text-[#a1a1aa] mt-0.5">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-[#a1a1aa] font-mono">No questions configured yet.</div>
                          )}
                        </div>
                      </div>

                      {/* Submissions Section */}
                      <div>
                        <h4 className="text-xs uppercase font-mono font-bold text-[#a1a1aa] tracking-wider mb-3 flex items-center gap-2">
                          <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Recent Submissions ({formResponses?.responses?.length || 0})</span>
                        </h4>

                        {formResponses?.responses && formResponses.responses.length > 0 ? (
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {formResponses.responses.map((resp, i) => (
                              <div key={resp.responseId || i} className="p-3.5 rounded-xl border border-[#27272a] bg-[#050505] text-left space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-mono text-[#a1a1aa] border-b border-[#1a1a1a] pb-1.5">
                                  <span>Response #{i + 1}</span>
                                  <span>{new Date(resp.createTime).toLocaleString()}</span>
                                </div>
                                <div className="space-y-1 text-xs">
                                  {resp.answers && Object.entries(resp.answers).map(([qId, rawAns]) => {
                                    const ans = rawAns as { textAnswers?: { answers?: { value: string }[] } };
                                    const matchingItem = formDetails.items?.find(it => it.questionItem?.question.questionId === qId);
                                    const label = matchingItem?.title || `Question (${qId.slice(0, 6)})`;
                                    const values = ans.textAnswers?.answers?.map(a => a.value).join(', ') || 'No answer';
                                    return (
                                      <div key={qId} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                        <span className="font-mono text-[#a1a1aa] shrink-0 text-[11px]">{label}:</span>
                                        <span className="text-white font-medium">{values}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-[#27272a] bg-[#050505] text-center text-xs font-mono text-[#a1a1aa]">
                            No submissions recorded yet for this form.
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="p-12 rounded-2xl border border-[#27272a] bg-[#111111] text-center text-xs font-mono text-[#a1a1aa]">
                      Select a form on the left to inspect questions and live response logs.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: CREATE NEW INTAKE FORM */}
            {activeTab === 'create' && (
              <div className="max-w-2xl mx-auto p-8 rounded-2xl border border-[#27272a] bg-[#111111]">
                <h3 className="text-xl font-extrabold font-display tracking-tight text-white mb-2">
                  Generate Google Forms Intake Questionnaire
                </h3>
                <p className="text-xs text-[#a1a1aa] mb-6">
                  Automatically provisions a new form with standardized questions directly inside your Google Drive using the Google Forms API.
                </p>

                <form onSubmit={handleCreateForm} className="space-y-5">
                  <div>
                    <label className="text-xs font-mono font-medium text-[#a1a1aa] block mb-2">
                      Select Form Template
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setCreateTemplate('discovery')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          createTemplate === 'discovery'
                            ? 'bg-purple-500/20 border-purple-500 text-white'
                            : 'bg-[#050505] border-[#27272a] text-[#a1a1aa] hover:border-zinc-600'
                        }`}
                      >
                        <div className="font-bold text-xs">Project Discovery</div>
                        <div className="text-[10px] mt-1 text-[#a1a1aa]">Scope, budget, deadlines</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCreateTemplate('feedback')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          createTemplate === 'feedback'
                            ? 'bg-purple-500/20 border-purple-500 text-white'
                            : 'bg-[#050505] border-[#27272a] text-[#a1a1aa] hover:border-zinc-600'
                        }`}
                      >
                        <div className="font-bold text-xs">Client Feedback</div>
                        <div className="text-[10px] mt-1 text-[#a1a1aa]">Quality ratings & reviews</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCreateTemplate('consultation')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          createTemplate === 'consultation'
                            ? 'bg-purple-500/20 border-purple-500 text-white'
                            : 'bg-[#050505] border-[#27272a] text-[#a1a1aa] hover:border-zinc-600'
                        }`}
                      >
                        <div className="font-bold text-xs">Consultation Brief</div>
                        <div className="text-[10px] mt-1 text-[#a1a1aa]">Pre-call topics & prep</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-medium text-[#a1a1aa] block mb-1.5">
                      Custom Form Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={customFormTitle}
                      onChange={(e) => setCustomFormTitle(e.target.value)}
                      placeholder="e.g. Acme Corp Technical Discovery Questionnaire"
                      className="w-full px-4 py-2.5 rounded-xl text-sm border bg-[#050505] border-[#27272a] text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-purple-500 transition-all"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight text-[#a1a1aa] hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isCreating}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight bg-white text-[#050505] hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                          <span>Provisioning Form...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create in Google Forms</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
