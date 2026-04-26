'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  {
    title: "Welcome to ClearVote",
    description: "Your impartial engine for election process integrity. We help you separate logistics from rumors using official ground truth.",
    icon: "🗳️",
    action: "Let's Begin"
  },
  {
    title: "The Claim Verifier",
    description: "Paste any election-related claim. Our engine scrapes official ECI portals and news archives to give you a cited, high-confidence verdict.",
    icon: "🔍",
    action: "Next"
  },
  {
    title: "Electoral Identity",
    description: "Check your EPIC status and booth allocation. We educate you on the continuous revision process so you never miss a vote.",
    icon: "👤",
    action: "Next"
  },
  {
    title: "Process Navigator",
    description: "Interactive guides for complex tasks like registration and understanding your rights on polling day.",
    icon: "🗺️",
    action: "Start Exploring"
  }
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-[#171717] border border-[#262626] rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Progress Dots */}
        <div className="flex gap-1.5 justify-center mb-4">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/10'
              }`} 
            />
          ))}
        </div>

        <div className="text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mx-auto mb-4">
            {STEPS[currentStep].icon}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {STEPS[currentStep].description}
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {STEPS[currentStep].action}
          </button>
          
          {currentStep === 0 && (
            <button 
              onClick={onComplete}
              className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors"
            >
              Skip Introduction
            </button>
          )}
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
      </div>
    </div>
  );
}
