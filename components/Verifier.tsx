'use client';

import { useState, useEffect } from 'react';
import { FactCheckResponse } from '../lib/types';

const SUGGESTED_QUERIES = [
  "Can I vote if my name is not on the voter list?",
  "Is it true that I can vote online this year?",
  "What documents are required at the polling booth?",
  "Can I wear a party t-shirt inside the polling station?",
];

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
      if (!response.ok || data.error) {
        throw new Error(data.error || `Verification failed`);
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      {!result && !loading && (
        <div className="text-center mb-10 space-y-2 animate-in fade-in duration-500">
          <h2 className="text-3xl font-bold tracking-tight text-white">How can I help?</h2>
          <p className="text-zinc-500 text-xs font-medium">Verify election logistics with Gemini 2.5 Flash</p>
        </div>
      )}

      {/* Main Search Bar (More Compact) */}
      <div className={`w-full transition-all duration-500 ${result || loading ? 'order-last mt-10' : ''}`}>
        <form onSubmit={(e) => handleVerify(e)} className="relative group max-w-xl mx-auto w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Verify an election claim..."
            className="w-full px-6 py-3.5 bg-[#171717] border border-[#262626] rounded-xl text-sm transition-all focus:border-zinc-700 focus:ring-0 placeholder:text-zinc-600 shadow-xl relative z-10"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-20 transition-all z-20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>

        {!result && !loading && (
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {SUGGESTED_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => { setQuery(q); handleVerify(undefined, q); }}
                className="px-3 py-1.5 bg-[#171717] border border-[#262626] rounded-lg text-[10px] text-zinc-500 hover:border-zinc-700 hover:text-white transition-all font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Source Verification UX (Compact) */}
      {loading && (
        <div className="w-full mt-12 animate-in fade-in duration-500 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
             <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Searching</p>
           </div>
           <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-400">
             Checking: {checkingUrl}
           </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">CV</div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <h2 className={`text-2xl font-black tracking-tight verdict-${result.verdict}`}>
                    {result.verdict}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${result.confidence_score}%` }} />
                    </div>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{result.confidence_score}% Confidence</span>
                  </div>
                </div>

                <p className="text-base leading-relaxed text-zinc-300 font-light">
                  {result.explanation}
                </p>

                {result.sources.length > 0 && (
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Ground Truth Sources</p>
                    <div className="grid gap-2">
                      {result.sources.map((source, i) => (
                        <div key={i} className="space-y-1">
                          <a href={source.url} target="_blank" className="flex items-center justify-between p-3 bg-[#171717] border border-[#262626] rounded-xl hover:border-zinc-700 transition-all group">
                            <span className="text-[11px] font-bold text-zinc-400">{source.title}</span>
                            <svg className="w-3 h-3 text-zinc-700 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </a>
                          {source.snippet && (
                            <div className="mx-3 p-3 bg-white/5 border-l border-zinc-700 rounded-r-lg">
                              <p className="text-[10px] text-zinc-500 italic leading-relaxed">
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
          </div>
        </div>
      )}

      {/* Error View */}
      {error && (
        <div className="mt-10 p-4 bg-error/10 border border-error/20 rounded-xl text-center space-y-2 animate-in zoom-in duration-300">
          <p className="text-error text-[10px] font-bold uppercase tracking-widest">Error</p>
          <p className="text-xs text-white/40">{error}</p>
          <button onClick={() => handleVerify()} className="text-[9px] text-white font-bold uppercase underline">Retry</button>
        </div>
      )}
    </div>
  );
}
