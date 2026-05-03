'use client';

import { useState, useEffect } from 'react';

type VotingState = 'idle' | 'voting' | 'verifying' | 'completed';

const CANDIDATES = [
  { id: 1, name: 'Candidate A', symbol: '🍎' },
  { id: 2, name: 'Candidate B', symbol: '🥦' },
  { id: 3, name: 'Candidate C', symbol: '🚲' },
  { id: 4, name: 'Candidate D', symbol: '🪁' },
];

export default function PracticeLab() {
  const [gameState, setGameState] = useState<VotingState>('idle');
  const [selectedCandidate, setSelectedCandidate] = useState<typeof CANDIDATES[0] | null>(null);
  const [vvpatTimer, setVvpatTimer] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'verifying') {
      setVvpatTimer(7);
      timer = setInterval(() => {
        setVvpatTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleVote = (candidate: typeof CANDIDATES[0]) => {
    if (gameState !== 'idle') return;
    setSelectedCandidate(candidate);
    setGameState('verifying');
  };

  const reset = () => {
    setGameState('idle');
    setSelectedCandidate(null);
    setVvpatTimer(0);
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-in fade-in duration-1000 pb-20 pt-10 px-4">
      
      {/* VVPAT Simulator Section */}
      <div className="space-y-6 order-2 lg:order-1">
        <div className="text-center lg:text-left space-y-2">
           <h2 className="text-2xl font-extrabold tracking-tighter text-white text-glow">VVPAT Simulator</h2>
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Voter Verifiable Paper Audit Trail</p>
        </div>

        <div className="relative aspect-[1/1.1] bg-zinc-900 border-4 border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-w-[320px] mx-auto lg:mx-0">
          {/* Glass Window Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-0 ring-1 ring-white/10 inset-2 rounded-2xl z-10 pointer-events-none" />
          
          <div className="flex-1 flex items-center justify-center p-6 bg-black/40 relative">
             {gameState === 'verifying' && selectedCandidate ? (
               <div className="w-full max-w-[200px] aspect-[2/3] bg-white rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col p-6 animate-in slide-in-from-top-20 duration-1000 ease-out">
                  <div className="flex-1 border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center gap-4">
                     <span className="text-5xl">{selectedCandidate.symbol}</span>
                     <div className="text-center">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Candidate</p>
                        <p className="text-sm font-black text-black leading-none">{selectedCandidate.id}</p>
                     </div>
                  </div>
                  <div className="mt-6 space-y-1">
                    <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Verification Slip</p>
                    <p className="text-[10px] font-black text-black truncate">{selectedCandidate.name}</p>
                  </div>
                  
                  {/* Timer Badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center font-black text-black text-xs shadow-xl">
                    {vvpatTimer}s
                  </div>
               </div>
             ) : (
               <div className="text-center space-y-4 opacity-20">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Window Locked</p>
               </div>
             )}
          </div>

          <div className="h-16 bg-zinc-800/50 border-t border-white/5 p-4 flex items-center justify-center">
             <div className="flex gap-4">
                <div className={`w-3 h-3 rounded-full shadow-lg ${gameState === 'verifying' ? 'bg-success animate-pulse' : 'bg-zinc-700'}`} />
                <div className={`w-3 h-3 rounded-full shadow-lg ${gameState === 'idle' ? 'bg-warning animate-pulse' : 'bg-zinc-700'}`} />
             </div>
          </div>
        </div>

        <div className="p-5 glass-card bg-zinc-900/40 rounded-3xl border border-white/5 space-y-3 max-w-[320px] mx-auto lg:mx-0">
           <div className="flex items-center gap-2">
             <div className="w-6 h-[1px] bg-white/20" />
             <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em]">Protocol Insight</p>
           </div>
           <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
             The VVPAT allows you to verify that your vote was cast correctly. The slip is visible for <span className="text-white font-bold underline decoration-white/20 underline-offset-4">7 seconds</span> before automatically falling into the secure ballot box.
           </p>
        </div>
      </div>

      {/* Ballot Unit Section */}
      <div className="space-y-8 order-1 lg:order-2">
        <div className="text-center lg:text-left space-y-2">
           <h2 className="text-2xl font-extrabold tracking-tighter text-white text-glow">Ballot Unit</h2>
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Electronic Voting Machine</p>
        </div>

        <div className="glass-card premium-gradient p-4 sm:p-6 rounded-[2.5rem] space-y-3 shadow-2xl relative overflow-hidden">
          {gameState === 'completed' && (
            <div className="absolute inset-0 z-30 bg-[#0f0f10]/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center space-y-6 animate-in fade-in duration-500">
               <div className="w-20 h-20 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-4xl text-success shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-bounce">✓</div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white tracking-tighter text-glow">Vote Cast Successfully</h3>
                  <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">The Control Unit has registered your vote. You have successfully practiced the voting protocol.</p>
               </div>
               <button 
                onClick={reset}
                className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-xl"
               >
                 Next Practice
               </button>
            </div>
          )}

          {CANDIDATES.map((candidate) => (
            <div 
              key={candidate.id}
              className={`flex items-center gap-2 p-3 sm:p-4 rounded-xl border transition-all duration-500 ${
                gameState !== 'idle' ? 'opacity-40 cursor-default grayscale' : 'hover:bg-white/[0.04] border-white/5 cursor-pointer group'
              }`}
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-xs sm:text-base font-extrabold text-zinc-500 group-hover:text-white transition-all">
                {candidate.id}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[9px] sm:text-xs font-black text-white whitespace-nowrap overflow-hidden tracking-tight">{candidate.name}</p>
                <p className="text-[7px] text-zinc-600 font-black uppercase tracking-tighter">Party</p>
              </div>
              
              <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                {candidate.symbol}
              </div>

              <div className="w-10 sm:w-12 shrink-0 flex flex-col items-center justify-center gap-1.5">
                 <div className={`w-1.5 h-1.5 rounded-full border border-black/40 transition-all duration-300 ${
                   selectedCandidate?.id === candidate.id ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-zinc-900'
                 }`} />
                 <button 
                  disabled={gameState !== 'idle'}
                  onClick={() => handleVote(candidate)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-sky-500 shadow-[0_3px_0_rgb(14,165,233)] active:translate-y-[1px] active:shadow-[0_1px_0_rgb(14,165,233)] transition-all flex items-center justify-center text-white/50 hover:text-white ${
                    gameState !== 'idle' ? 'opacity-50 grayscale pointer-events-none' : ''
                  }`}
                 >
                   <div className="w-3 h-3 rounded-full border-2 border-current opacity-30" />
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 py-5 bg-zinc-900/60 rounded-[1.5rem] border border-white/5 shadow-inner">
           <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${gameState === 'idle' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-zinc-700'}`} />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {gameState === 'idle' ? 'Ready to Vote' : 'Protocol in Progress...'}
              </span>
           </div>
           <div className="text-[10px] font-bold text-zinc-500 flex items-center gap-2">
              <span className="text-zinc-600 uppercase tracking-tighter">Control Unit:</span> 
              <span className="text-emerald-500/80">Active</span>
           </div>
        </div>
      </div>
    </div>
  );
}
