'use client';

import { useState } from 'react';

const STEPS = [
  {
    id: 'welcome',
    title: "Welcome to ClearVote",
    description: "Your impartial engine for election process integrity. We help you separate logistics from rumors using official ground truth.",
    icon: "🗳️",
    action: "Let's Begin"
  },
  {
    id: 'digilocker',
    title: "DigiLocker Readiness",
    description: "We securely audit your essential documents (Aadhaar, EPIC) via Data Exchange to ensure you are ready to vote.",
    icon: "🔐",
    action: "Run Initial Audit"
  },
  {
    id: 'verifier',
    title: "The Claim Verifier",
    description: "Paste any election-related claim. Our engine scrapes official archives and news to give you a cited, high-confidence verdict.",
    icon: "🔍",
    action: "Next"
  },
  {
    id: 'navigator',
    title: "Process Navigator",
    description: "Interactive guides for complex tasks like registration and understanding your rights on polling day.",
    icon: "🗺️",
    action: "Start Exploring"
  }
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleNext = () => {
    if (STEPS[currentStep].id === 'digilocker' && !isAuditing) {
      setIsAuditing(true);
      setTimeout(() => {
        setIsAuditing(false);
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

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
            {isAuditing ? (
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              STEPS[currentStep].icon
            )}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isAuditing ? "Auditing Documents..." : STEPS[currentStep].title}
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {isAuditing ? "Exchanging data with the DigiLocker repository to verify your electoral eligibility." : STEPS[currentStep].description}
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button 
            onClick={handleNext}
            disabled={isAuditing}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20"
          >
            {isAuditing ? "Please Wait..." : STEPS[currentStep].action}
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
