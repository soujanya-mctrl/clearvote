'use client';

import { useState } from 'react';

const FLOWS = [
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
    id: 'rights',
    title: 'Polling Rights',
    steps: [
      { title: 'Entry', content: 'You have the right to enter the booth if your name is on the electoral roll.' },
      { title: 'Assistance', content: 'You can request assistance from the Presiding Officer if needed.' },
      { title: 'Secrecy', content: 'No one is allowed to see who you voted for. It is a strictly confidential process.' },
      { title: 'Challenge', content: 'If someone challenges your identity, you can still vote after a summary inquiry by the PO.' }
    ]
  }
];

export default function Navigator() {
  const [activeFlow, setActiveFlow] = useState(FLOWS[0]);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="w-full max-w-2xl space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Process Navigator</h2>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Guided Task Education</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {FLOWS.map((flow) => (
          <button
            key={flow.id}
            onClick={() => { setActiveFlow(flow); setActiveStep(0); }}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeFlow.id === flow.id 
              ? 'bg-white text-black' 
              : 'text-zinc-600 hover:text-white border border-[#262626]'
            }`}
          >
            {flow.title}
          </button>
        ))}
      </div>

      <div className="bg-[#171717] border border-[#262626] p-8 rounded-2xl min-h-[300px] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center font-black text-xs">
              {activeStep + 1}
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">
              {activeFlow.steps[activeStep].title}
            </h3>
          </div>
          
          <p className="text-base text-zinc-400 font-light leading-relaxed max-w-xl">
            {activeFlow.steps[activeStep].content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <div className="flex gap-1.5">
            {activeFlow.steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-0.5 bg-white/5 rounded-full overflow-hidden`}
              >
                <div 
                  className={`h-full bg-white transition-all duration-300 ${i <= activeStep ? 'w-full' : 'w-0'}`} 
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => prev - 1)}
              className="p-3 bg-white/5 border border-white/5 rounded-lg text-zinc-600 hover:text-white disabled:opacity-20 transition-all"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              disabled={activeStep === activeFlow.steps.length - 1}
              onClick={() => setActiveStep(prev => prev + 1)}
              className="p-3 bg-white text-black rounded-lg hover:scale-105 active:scale-95 disabled:opacity-20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
