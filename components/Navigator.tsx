'use client';

import { useState } from 'react';

const FEATURED_FLOWS = [
  {
    id: 'register',
    title: 'Registration',
    steps: [
      { title: 'Eligibility', content: 'You must be a citizen of India and 18+ years of age on the qualifying date.' },
      { title: 'Form 6', content: 'Apply online via the NVSP portal or physically at your ERO office using Form 6.' },
      { title: 'Verification', content: 'A Booth Level Officer (BLO) will visit your address for verification.' },
      { title: 'Approval', content: 'Once approved, your name is added to the roll and EPIC card is dispatched.' }
    ]
  },
  {
    id: 'counting',
    title: 'EVM Counting',
    steps: [
      { title: 'Strong Room', content: 'EVMs are brought from the strong room under 24/7 security and observer presence.' },
      { title: 'Seal Verification', content: 'Counting agents verify the unique address tags and paper seals of each CU.' },
      { title: 'Result Display', content: 'The Result button is pressed; the display shows votes for each candidate.' },
      { title: 'Tabulation', content: 'Results are recorded in Form 17C and cross-verified with VVPAT slips if ordered.' }
    ]
  }
];

export default function Navigator() {
  const [query, setQuery] = useState('');
  const [activeFlow, setActiveFlow] = useState(FEATURED_FLOWS[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (data.steps) {
        setActiveFlow({ id: 'dynamic', title: query, steps: data.steps });
        setActiveStep(0);
      }
    } catch (err) {
      console.error("Navigation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tighter text-white text-glow">Process Navigator</h2>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Interactive Protocol Intelligence</p>
      </div>

      <form onSubmit={handleSearch} className="relative group max-w-xl mx-auto w-full">
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-2xl group-focus-within:bg-white/10 transition-all duration-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about a specific election process..."
          className="w-full px-8 py-4 bg-[#171717] border border-white/5 rounded-2xl text-sm transition-all focus:border-white/20 focus:ring-0 placeholder:text-zinc-600 shadow-2xl relative z-10"
        />
        <button
          disabled={loading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white text-black rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-20 transition-all z-20 shadow-xl"
        >
          {loading ? '...' : '→'}
        </button>
      </form>

      <div className="flex flex-wrap gap-3 justify-center">
        {FEATURED_FLOWS.map((flow) => (
          <button
            key={flow.id}
            onClick={() => { setActiveFlow(flow); setActiveStep(0); }}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              activeFlow.id === flow.id 
              ? 'bg-white text-black shadow-2xl shadow-white/10' 
              : 'text-zinc-500 hover:text-white border border-white/5 bg-white/[0.02]'
            }`}
          >
            {flow.title}
          </button>
        ))}
      </div>

      <div className="glass-card premium-gradient p-12 min-h-[400px] flex flex-col justify-between relative overflow-hidden group">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#171717]/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
             <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
             <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">Retrieving Protocols...</p>
          </div>
        )}

        <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-3xl bg-zinc-800 text-white flex items-center justify-center font-black text-xl shadow-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
              {activeStep + 1}
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tighter text-white leading-none text-glow">
                {activeFlow.steps[activeStep].title}
              </h3>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">{activeFlow.title}</p>
            </div>
          </div>
          
          <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-xl">
            {activeFlow.steps[activeStep].content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-12 border-t border-white/5">
          <div className="flex gap-2">
            {activeFlow.steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === activeStep ? 'w-10 bg-white' : i < activeStep ? 'w-4 bg-white/20' : 'w-4 bg-white/5'}`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => prev - 1)}
              className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-20 transition-all hover:bg-white/10"
            >
              ←
            </button>
            <button
              disabled={activeStep === activeFlow.steps.length - 1}
              onClick={() => setActiveStep(prev => prev + 1)}
              className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-2xl hover:scale-110 active:scale-95 disabled:opacity-20 transition-all shadow-xl"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="text-center opacity-30 flex items-center justify-center gap-3 animate-float">
         <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
         <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white">Live Handbook Node: eci.gov.in</p>
      </div>
    </div>
  );
}
