'use client';

import { useState, useEffect } from 'react';
import { FactCheckResponse } from '../lib/types';

const SOURCES_BEING_CHECKED = [
  "eci.gov.in/faqs/evm",
  "thehindu.com/elections",
  "timesofindia.com/elections",
  "ndtv.com/india-news",
  "eci.gov.in/mcc"
];

export default function Verifier() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingUrl, setCheckingUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) {
      let i = 0;
      const interval = setInterval(() => {
        setCheckingUrl(SOURCES_BEING_CHECKED[i % SOURCES_BEING_CHECKED.length]);
        i++;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading]);

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
        body: JSON.stringify({ query: finalQuery }),
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Verification failed`);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center pb-20">
      {!result && !loading && (
        <div className="text-center mb-12 space-y-3 animate-in fade-in duration-1000">
          <h2 className="text-4xl font-black tracking-tighter text-white text-glow">How can I help?</h2>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Verify Election Integrity with AI</p>
        </div>
      )}

      {/* Main Search Bar (Premium) */}
      <div className={`w-full transition-all duration-700 ${result || loading ? 'order-last mt-12' : ''}`}>
        <form onSubmit={(e) => handleVerify(e)} className="relative group max-w-xl mx-auto w-full">
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-2xl group-focus-within:bg-white/10 transition-all duration-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Verify an election claim or rule..."
            className="w-full px-8 py-5 bg-[#171717] border border-white/5 rounded-2xl text-sm transition-all focus:border-white/20 focus:ring-0 placeholder:text-zinc-600 shadow-2xl relative z-10"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-20 transition-all z-20 shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
      </div>

      {/* Loading State (Premium) */}
      {loading && (
        <div className="w-full mt-20 animate-in fade-in duration-1000 flex flex-col items-center gap-6">
           <div className="relative">
             <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
             <div className="absolute inset-0 blur-xl bg-white/20 rounded-full animate-pulse" />
           </div>
           <div className="text-center space-y-2">
             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Analyzing Ground Truth</p>
             <div className="px-4 py-2 glass-card rounded-xl text-[10px] font-mono text-zinc-400">
               {checkingUrl}
             </div>
           </div>
        </div>
      )}

      {/* Result Display (Premium) */}
      {result && (
        <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="glass-card premium-gradient p-10 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`text-4xl font-black tracking-tighter text-glow verdict-${result.verdict}`}>
                  {result.verdict}
                </h2>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{result.confidence_score}% Confidence</span>
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${result.confidence_score}%` }} />
                  </div>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-zinc-300 font-light">
                {result.explanation}
              </p>
            </div>

            {result.sources.length > 0 && (
              <div className="pt-8 border-t border-white/5 space-y-6">
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Verified Sources</p>
                <div className="grid gap-4">
                  {result.sources.map((source, i) => (
                    <div key={i} className="space-y-3 group">
                      <a href={source.url} target="_blank" className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all">
                        <span className="text-xs font-bold text-zinc-400 group-hover:text-white">{source.title}</span>
                        <svg className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </a>
                      {source.snippet && (
                        <div className="mx-4 p-5 bg-white/[0.02] border-l-2 border-white/10 rounded-r-2xl">
                          <p className="text-xs text-zinc-500 italic leading-relaxed font-light">
                            "{source.snippet}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error (Premium) */}
      {error && (
        <div className="mt-12 glass-card p-6 bg-error/5 border-error/20 text-center space-y-3">
          <p className="text-error text-[10px] font-black uppercase tracking-widest">System Alert</p>
          <p className="text-sm text-zinc-400">{error}</p>
          <button onClick={() => handleVerify()} className="text-[10px] text-white font-bold uppercase underline-offset-4 underline decoration-white/20">Attempt Retry</button>
        </div>
      )}
    </div>
  );
}
