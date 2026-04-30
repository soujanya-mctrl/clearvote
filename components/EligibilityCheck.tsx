'use client';

import { useState } from 'react';

export default function EligibilityCheck({ onPassed }: { onPassed: () => void }) {
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);

  const questions = [
    { 
      id: 'age', 
      title: 'Age Requirement', 
      text: 'Are you 18 years of age or older on the qualifying date (typically Jan 1st of the election year)?',
      icon: '🎂'
    },
    { 
      id: 'citizen', 
      title: 'Citizenship', 
      text: 'Are you a citizen of India?',
      icon: '🇮🇳'
    },
    { 
      id: 'resident', 
      title: 'Ordinary Residence', 
      text: 'Are you an ordinary resident in the constituency where you want to be registered?',
      icon: '🏠'
    }
  ];

  const handleAnswer = (value: boolean) => {
    if (!value) {
      setFailed(true);
      return;
    }

    const nextStep = step + 1;
    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      onPassed();
    }
  };

  if (failed) {
    return (
      <div className="w-full max-w-md glass-card p-10 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-4xl mx-auto text-error">✕</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tighter">Ineligible to Vote</h2>
          <p className="text-sm text-zinc-500 leading-relaxed font-light">
            Based on your answers, you do not currently meet the legal requirements for electoral registration in India.
          </p>
        </div>
        <button onClick={() => setFailed(false)} className="w-full py-4 bg-white/5 text-zinc-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-white transition-all">Try Again</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md glass-card p-10 text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white tracking-tighter text-glow">Eligibility Check</h2>
        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">Step {step + 1} of {questions.length}</p>
      </div>

      <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
        <div className="text-4xl">{questions[step].icon}</div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight">{questions[step].title}</h3>
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            {questions[step].text}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleAnswer(false)}
          className="py-4 bg-white/5 border border-white/5 rounded-2xl font-bold text-xs uppercase tracking-widest text-zinc-500 hover:bg-error/10 hover:text-error transition-all"
        >
          No
        </button>
        <button 
          onClick={() => handleAnswer(true)}
          className="py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
        >
          Yes
        </button>
      </div>
    </div>
  );
}
