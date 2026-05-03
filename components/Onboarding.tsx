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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full sm:max-w-md glass-card premium-gradient p-8 sm:p-10 space-y-6 sm:space-y-8 relative overflow-hidden rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border-white/10">
        {/* Progress Dots */}
        <div className="flex gap-1.5 justify-center">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/10'
              }`} 
            />
          ))}
        </div>

        <div className="text-center space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-2 sm:mb-4">
            {isAuditing ? (
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              STEPS[currentStep].icon
            )}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white text-glow">
              {isAuditing ? "Auditing Documents..." : STEPS[currentStep].title}
            </h2>
            <p className="text-[13px] sm:text-sm text-zinc-500 leading-relaxed font-light px-4 sm:px-0">
              {isAuditing ? "Exchanging data with the DigiLocker repository to verify your electoral eligibility." : STEPS[currentStep].description}
            </p>
          </div>
        </div>

        <div className="pt-2 sm:pt-4 flex flex-col gap-3">
          <button 
            onClick={handleNext}
            disabled={isAuditing}
            className="w-full py-4.5 sm:py-4 bg-white text-black rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 shadow-xl"
          >
            {isAuditing ? "Please Wait..." : STEPS[currentStep].action}
          </button>
          
          {currentStep === 0 && (
            <button 
              onClick={onComplete}
              className="py-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors"
            >
              Skip Introduction
            </button>
          )}
        </div>

        {/* Mobile Swipe-down indicator */}
        <div className="sm:hidden flex justify-center pt-2">
           <div className="w-12 h-1 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>

  );
}
