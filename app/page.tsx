'use client';

import { useState, useEffect } from 'react';
import { FactCheckResponse } from '@/lib/types';

const SUGGESTED_QUERIES = [
  "Can I vote if my name is not on the voter list?",
  "Is it true that I can vote online this year?",
  "What documents are required at the polling booth?",
  "Can I wear a party t-shirt inside the polling station?",
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  const steps = [
    "Searching official election commission archives...",
    "Extracting relevant procedural protocols...",
    "Analyzing claim against ground-truth data...",
    "Synthesizing impartial verdict...",
  ];

  useEffect(() => {
    if (loading) {
      let i = 0;
      const interval = setInterval(() => {
        setLoadingStep(steps[i % steps.length]);
        i++;
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleVerify = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setLoadingStep(steps[0]);
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
        throw new Error(data.error || `Verification failed (Status ${response.status})`);
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while verifying the claim.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-background py-12 px-6 md:px-24">
      <div className="w-full max-w-3xl space-y-16">
        {/* Header */}
        <div className="space-y-6 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
            Impartial Process Verification
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-primary">
            Clear<span className="font-bold">Vote</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
            Verify election logistics, rules, and hardware. <br/>
            Combat misinformation with official sources.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-6">
          <form onSubmit={(e) => handleVerify(e)} className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about voting rules, EVMs, or ID requirements..."
              className="w-full px-8 py-6 bg-secondary/50 border border-border rounded-3xl text-lg transition-all focus:border-white/20 focus:ring-8 focus:ring-white/5 placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-3 top-3 bottom-3 px-8 bg-primary text-background font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {loading ? 'Processing...' : 'Verify'}
            </button>
          </form>

          {/* Suggested Queries */}
          {!result && !loading && (
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(q); handleVerify(undefined, q); }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8 py-12 text-center">
            <div className="inline-block w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-zinc-400 text-sm font-mono tracking-wider animate-pulse">{loadingStep}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 bg-error/10 border border-error/20 rounded-[2rem] text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="space-y-2">
              <p className="text-error font-black uppercase tracking-widest text-xs">Verification Interrupted</p>
              <p className="text-white/80 text-sm font-light leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => handleVerify()}
              className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/10 transition-all"
            >
              Retry Verification
            </button>
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Verdict Card */}
            <div className="glass p-10 rounded-[2.5rem] space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Process Verdict</p>
                  <h2 className={`text-5xl font-black tracking-tight verdict-${result.verdict}`}>
                    {result.verdict}
                  </h2>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Trust Index</p>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: `${result.confidence_score}%` }}
                      />
                    </div>
                    <p className="text-3xl font-mono font-bold">{result.confidence_score}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Official Analysis</p>
                <p className="text-xl leading-relaxed text-zinc-200 font-light">
                  {result.explanation}
                </p>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Citations</p>
                  <div className="grid gap-3">
                    {result.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">{source.title}</p>
                          <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[250px] md:max-w-md">{source.url}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => { setResult(null); setQuery(''); }}
              className="w-full py-4 text-zinc-500 text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              Verify another claim
            </button>
          </div>
        )}

        {/* Info Section */}
        {!result && !loading && (
          <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
            <div className="space-y-3">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Impartial</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                ClearVote does not evaluate candidates or political parties. We strictly verify process rules.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Evidence-Based</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Every response is grounded in official election commission documents and legal protocols.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Real-Time</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Our engine scrapes current official portals to ensure you get the latest logistical updates.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-24 text-zinc-800 text-[10px] uppercase tracking-[0.5em] font-black">
        ClearVote Protocol v1.0 • Process Integrity First
      </footer>
    </main>
  );
}
