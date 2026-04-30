'use client';

import { useState } from 'react';
import { CandidateProfile } from '../lib/types';

export default function CandidateResearch() {
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setProfile(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tighter text-white text-glow">Candidate Research</h2>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Manifesto Analysis Engine</p>
      </div>

      <form onSubmit={handleSearch} className="relative group max-w-xl mx-auto w-full">
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-2xl group-focus-within:bg-white/10 transition-all duration-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Research a candidate or party manifesto..."
          className="w-full px-8 py-5 bg-[#171717] border border-white/5 rounded-2xl text-sm transition-all focus:border-white/20 focus:ring-0 placeholder:text-zinc-600 shadow-2xl relative z-10"
        />
        <button
          disabled={loading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-20 transition-all z-20 shadow-xl"
        >
          {loading ? '...' : '→'}
        </button>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
           <div className="relative">
             <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
             <div className="absolute inset-0 blur-xl bg-white/20 rounded-full animate-pulse" />
           </div>
           <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Manifestos...</p>
        </div>
      )}

      {profile && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="glass-card premium-gradient p-10 flex items-center gap-8">
             <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                {profile.party?.[0] || profile.name?.[0]}
             </div>
             <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tighter text-glow">{profile.name}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-zinc-500 font-medium">{profile.party}</p>
                  <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{profile.constituency || 'National'}</p>
                </div>
             </div>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] px-4">Key Strategic Promises</p>
            <div className="grid gap-4">
              {profile.promises.map((p, i) => (
                <div key={i} className="glass-card p-8 space-y-4 group hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white group-hover:border-white/20 transition-all">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-zinc-200 tracking-tight leading-tight">
                    {p.promise}
                  </p>
                  <div className="p-5 bg-black/20 rounded-2xl border-l-2 border-white/10">
                    <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                      &quot;{p.context}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="pt-10 border-t border-white/5 space-y-6">
             <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.3em]">Analysis Data Sources</p>
             <div className="flex flex-wrap gap-3">
                {profile.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" className="px-5 py-2.5 glass-card rounded-xl text-[10px] text-zinc-500 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest">
                    {s.title}
                  </a>
                ))}
             </div>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-card p-8 border-error/20 bg-error/5 text-center">
          <p className="text-sm text-error font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
