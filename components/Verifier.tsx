'use client';

import { useState, useEffect, useRef } from 'react';
import { FactCheckResponse } from '../lib/types';

const SOURCES_BEING_CHECKED = [
  "eci.gov.in/faqs/evm",
  "thehindu.com/elections",
  "timesofindia.com/elections",
  "ndtv.com/india-news",
  "eci.gov.in/mcc"
];

const EXAMPLE_PROMPTS = [
  "Free electricity scheme eligibility in Delhi",
  "Is the new education policy implemented in all states?",
  "Aadhaar linking deadline for voter ID",
  "Rules for NRI voting in 2024"
];

const VERDICT_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  'True':        { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '✓' },
  'False':       { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20',     icon: '✗' },
  'Misleading':  { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: '⚠' },
  'Unverified':  { color: 'text-zinc-400',    bg: 'bg-zinc-500/10',    border: 'border-zinc-500/20',    icon: '?' },
  'Out of Scope':{ color: 'text-zinc-500',    bg: 'bg-zinc-500/10',    border: 'border-zinc-500/20',    icon: '—' },
};

function getVerdictStyle(verdict: string) {
  return VERDICT_CONFIG[verdict] || VERDICT_CONFIG['Unverified'];
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}

export default function Verifier() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingUrl, setCheckingUrl] = useState('');
  const [error, setError] = useState('');
  const [attachedUrls, setAttachedUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlError, setUrlError] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) {
      let i = 0;
      const allUrls = [...SOURCES_BEING_CHECKED, ...attachedUrls.map(u => getDomain(u))];
      const interval = setInterval(() => {
        setCheckingUrl(allUrls[i % allUrls.length]);
        i++;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, attachedUrls]);

  useEffect(() => {
    if (showUrlInput && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [showUrlInput]);

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    
    if (!isValidUrl(trimmed)) {
      setUrlError('Please enter a valid URL (https://...)');
      return;
    }
    if (attachedUrls.includes(trimmed)) {
      setUrlError('URL already attached');
      return;
    }
    if (attachedUrls.length >= 5) {
      setUrlError('Maximum 5 URLs allowed');
      return;
    }

    setAttachedUrls(prev => [...prev, trimmed]);
    setUrlInput('');
    setUrlError('');
  };

  const handleRemoveUrl = (url: string) => {
    setAttachedUrls(prev => prev.filter(u => u !== url));
  };

  const handleVerify = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setCheckingUrl(SOURCES_BEING_CHECKED[0]);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery, urls: attachedUrls }),
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Verification failed`);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuery = () => {
    setResult(null);
    setQuery('');
    setAttachedUrls([]);
    setError('');
  };

  const verdictStyle = result ? getVerdictStyle(result.verdict) : null;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center pb-20">
      {!result && !loading && (
        <div className="text-center mb-6 space-y-3 animate-in fade-in duration-1000 px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white text-glow">How can I help?</h2>
          <p className="text-zinc-600 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.4em]">Verify Election Integrity with AI</p>
        </div>
      )}

      {/* Main Search Bar */}
      <div className={`w-full transition-all duration-700 ${result || loading ? 'sticky bottom-4 sm:bottom-10 z-40 px-4 sm:px-6' : 'relative mt-4 px-4 sm:px-0'}`}>
        <form onSubmit={(e) => handleVerify(e)} className="relative group w-full">
          <label htmlFor="verifier-query" className="sr-only">Verification query</label>
          <div className="absolute inset-0 bg-[#171717]/90 backdrop-blur-3xl rounded-2xl group-focus-within:bg-white/5 transition-colors duration-300 border border-white/5 shadow-2xl" />
          <input
            id="verifier-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Verify a claim..."
            className="w-full px-5 sm:px-8 py-4 sm:py-5 bg-transparent rounded-2xl text-[13px] sm:text-sm transition-all focus:border-white/20 focus:ring-0 placeholder:text-zinc-500 relative z-10 pr-24"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
            {/* Attach URL Button */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              title="Attach article URL"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                showUrlInput || attachedUrls.length > 0
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {attachedUrls.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {attachedUrls.length}
                </span>
              )}
            </button>
            {/* Submit Button */}
            <button
              type="submit"
              aria-label="Run verification"
              disabled={loading || !query.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-xl"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </form>

        {/* URL Input Dropdown */}
        {showUrlInput && !result && !loading && (
          <div className="mt-3 p-4 bg-[#141414] border border-white/5 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={urlInputRef}
                  type="url"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setUrlError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                  placeholder="Paste URL..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs focus:border-white/20 focus:ring-0 placeholder:text-zinc-600 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/15 transition-all shrink-0"
              >
                Add
              </button>
            </div>
            {urlError && (
              <p className="text-[10px] text-red-400 font-medium px-1">{urlError}</p>
            )}
            <p className="text-[9px] text-zinc-600 px-1 leading-relaxed">
              Attach up to 5 article URLs for AI parsing.
            </p>
          </div>
        )}

        {/* Attached URL Chips */}
        {attachedUrls.length > 0 && !result && !loading && (
          <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in duration-300">
            {attachedUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                <svg className="w-3 h-3 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-[10px] text-zinc-400 max-w-[120px] sm:max-w-[200px] truncate">{getDomain(url)}</span>
                <button
                  onClick={() => handleRemoveUrl(url)}
                  className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Example Prompts */}
        {!result && !loading && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 animate-in fade-in slide-in-from-top-4 duration-500 px-2">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => { setQuery(prompt); handleVerify(undefined, prompt); }}
                className="px-3.5 py-2.5 sm:px-3 sm:py-2 rounded-2xl sm:rounded-full border border-white/6 bg-white/[0.02] sm:bg-transparent text-[11px] sm:text-[12px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full mt-12 sm:mt-20 animate-in fade-in duration-1000 flex flex-col items-center gap-6 px-6">
           <div className="relative">
             <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
             <div className="absolute inset-0 blur-xl bg-white/20 rounded-full animate-pulse" />
           </div>
           <div className="text-center space-y-3">
             <p className="text-zinc-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">Analyzing Ground Truth</p>
             <div className="px-4 py-2.5 glass-card rounded-xl text-[9px] sm:text-[10px] font-mono text-zinc-400 max-w-[200px] sm:max-w-none truncate">
               {checkingUrl}
             </div>
           </div>
        </div>
      )}

      {/* Result Display */}
      {result && verdictStyle && (
        <div className="w-full mt-4 sm:mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 px-4 sm:px-0">
          
          {/* Verdict Header Card */}
          <div className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border ${verdictStyle.bg} ${verdictStyle.border} shadow-xl`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${verdictStyle.bg} border ${verdictStyle.border} flex items-center justify-center text-lg sm:text-xl font-bold ${verdictStyle.color} shrink-0`}>
              {verdictStyle.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h3 className={`text-base sm:text-lg font-extrabold tracking-tight ${verdictStyle.color}`}>
                  {result.verdict}
                </h3>
                <span className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest">Verdict</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 sm:mt-2">
                <div className="flex-1 max-w-[120px] sm:max-w-[160px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      result.confidence_score >= 75 ? 'bg-emerald-400' : 
                      result.confidence_score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                    }`} 
                    style={{ width: `${result.confidence_score}%` }} 
                  />
                </div>
                <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold tabular-nums">{result.confidence_score}%</span>
              </div>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="glass-card p-5 sm:p-6 space-y-4">
            <p className="text-[9px] sm:text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Analysis</p>
            <p className="text-[13px] sm:text-sm leading-relaxed text-zinc-300 font-light">
              {result.explanation}
            </p>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="glass-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] sm:text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Verified Sources</p>
                <span className="text-[8px] sm:text-[9px] text-zinc-700 font-bold">{result.sources.length} source{result.sources.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid gap-3">
                {result.sources.map((source, i) => (
                  <div key={i} className="space-y-2">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 sm:p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[8px] sm:text-[9px] font-bold text-zinc-500">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] sm:text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors truncate">{source.title}</p>
                        <p className="text-[9px] sm:text-[10px] text-zinc-600 truncate mt-0.5">{source.url}</p>
                      </div>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700 group-hover:text-white transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    {source.snippet && (
                      <div className="ml-8 sm:ml-10 p-3 bg-white/[0.01] border-l-2 border-white/10 rounded-r-xl">
                        <p className="text-[10px] sm:text-[11px] text-zinc-500 italic leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                          &quot;{source.snippet}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Query Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleNewQuery}
              className="px-6 py-3 sm:py-2.5 rounded-xl border border-white/5 text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white hover:bg-white/5 hover:border-white/10 transition-all"
            >
              New Verification
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 sm:mt-12 glass-card p-6 bg-error/5 border-error/20 text-center space-y-3 mx-4">
          <p className="text-error text-[9px] sm:text-[10px] font-black uppercase tracking-widest">System Alert</p>
          <p className="text-xs sm:text-sm text-zinc-400">{error}</p>
          <button onClick={() => handleVerify()} className="text-[9px] sm:text-[10px] text-white font-bold uppercase underline-offset-4 underline decoration-white/20">Attempt Retry</button>
        </div>
      )}
    </div>
  );
}
