'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [voterId, setVoterId] = useState('');
  const [voterData, setVoterData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setVoterData({
        name: "Anjali Sharma",
        epicNumber: voterId || "ABC1234567",
        status: "Verified",
        booth: "Kendriya Vidyalaya, Sector 4, R.K. Puram",
        constituency: "New Delhi",
        nextElection: "May 2026",
        flags: ["Address update recommended (Last updated 2022)"]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Identity Dashboard</h2>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Electoral Roll Status</p>
      </div>

      <form onSubmit={handleCheck} className="relative group max-w-sm mx-auto w-full">
        <input
          type="text"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
          placeholder="EPIC Number..."
          className="w-full px-6 py-3 bg-[#171717] border border-[#262626] rounded-xl text-xs transition-all focus:border-zinc-700 focus:ring-0 placeholder:text-zinc-600"
        />
        <button
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white text-black rounded-lg text-[10px] font-bold hover:scale-105 active:scale-95 transition-all"
        >
          {loading ? '...' : 'Check'}
        </button>
      </form>

      {voterData && (
        <div className="animate-in slide-in-from-bottom-2 duration-500">
          <div className="bg-[#171717] border border-[#262626] p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
             <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-500 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{voterData.name}</h3>
                    <p className="text-zinc-600 text-[10px] font-mono">{voterData.epicNumber}</p>
                  </div>
                  <div className="px-2 py-0.5 bg-success/20 text-success rounded-md text-[9px] font-bold uppercase tracking-widest self-start">
                    {voterData.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest">Booth</p>
                    <p className="text-[11px] font-medium text-zinc-400 leading-tight">{voterData.booth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest">Election</p>
                    <p className="text-[11px] font-medium text-zinc-400">{voterData.nextElection}</p>
                  </div>
                </div>

                {voterData.flags.length > 0 && (
                  <div className="p-3 bg-warning/5 border border-warning/10 rounded-xl">
                    <p className="text-warning text-[9px] font-bold uppercase tracking-widest mb-1">Attention</p>
                    {voterData.flags.map((flag: string, i: number) => (
                      <p key={i} className="text-[10px] text-zinc-400 font-medium leading-tight">• {flag}</p>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Process Insight */}
      <div className="pt-8 border-t border-white/5 flex gap-3">
        <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 shrink-0">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-zinc-600 text-[11px] leading-relaxed italic">
          The Electoral Roll is maintained by the ERO through annual continuous revision. If your address has changed, submit **Form 8** via the NVSP portal.
        </p>
      </div>
    </div>
  );
}
