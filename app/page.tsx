'use client';

import { useState, useEffect } from 'react';
import Verifier from '../components/Verifier';
import Dashboard from '../components/Dashboard';
import Navigator from '../components/Navigator';
import CandidateResearch from '../components/CandidateResearch';
import AuthOnboarding from '../components/AuthOnboarding';
import EligibilityCheck from '../components/EligibilityCheck';

import PracticeLab from '../components/PracticeLab';

type Tab = 'dashboard' | 'intelligence' | 'navigator' | 'practice';

const LOADING_STEPS = [
  "Initializing Truth Engine",
  "Syncing Global Records",
  "Verifying Node Integrity",
  "Optimizing Readiness Vault",
  "Secure Connection Established"
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('intelligence');
  const [intelMode, setIntelMode] = useState<'verify' | 'research'>('verify');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEligibility, setShowEligibility] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [simStep, setSimStep] = useState<'idle' | 'selecting' | 'casting' | 'printing' | 'verified'>('idle');
  const [isAnimComplete, setIsAnimComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setShowPreloader(true);
    const profile = localStorage.getItem('clearvote_user_profile');
    if (profile) setUserProfile(JSON.parse(profile));
  }, []);

  useEffect(() => {
    if (showPreloader) {
      const stepInterval = setInterval(() => {
        setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1000);

      // Simulation Sequence
      const simSequence = [
        { step: 'selecting', delay: 200 },
        { step: 'casting', delay: 1200 },
        { step: 'printing', delay: 2200 },
        { step: 'verified', delay: 3400 }
      ];

      simSequence.forEach(({ step, delay }) => {
        setTimeout(() => setSimStep(step as any), delay);
      });

      // Trigger exit sequence after simulation and pause
      const exitTimer = setTimeout(() => {
        setIsAnimComplete(true);
        // Final unmount after exit animation finishes
        setTimeout(() => {
          setShowPreloader(false);
          sessionStorage.setItem('clearvote_preloader_seen', 'true');
        }, 1400); // Matches animate-premium-exit duration
      }, 5400); // 3.4s simulation + 2s pause

      return () => {
        clearInterval(stepInterval);
        clearTimeout(exitTimer);
      };
    }
  }, [showPreloader]);

  useEffect(() => {
    if (localStorage.getItem('clearvote_eligible') === 'true') {
      setIsEligible(true);
    }
  }, []);

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    const hasSeenOnboarding = localStorage.getItem('clearvote_onboarding_seen');
    if (tabId === 'dashboard' && !hasSeenOnboarding && !isEligible) {
      setShowEligibility(true);
    }
  };

  const handleEligibilityPassed = () => {
    localStorage.setItem('clearvote_eligible', 'true');
    setIsEligible(true);
    setShowEligibility(false);
    setShowOnboarding(true);
  };

  const handleDemoSkip = () => {
    localStorage.setItem('clearvote_eligible', 'true');
    localStorage.setItem('clearvote_onboarding_seen', 'true');
    
    // Initialize Demo Profile
    if (!localStorage.getItem('clearvote_user_profile')) {
      localStorage.setItem('clearvote_user_profile', JSON.stringify({
        email: "demo.voter@clearvote.in",
        phone: "+91 98765 43210",
        aadhaar: "XXXX XXXX 1234",
        pan: "ABCDE1234F",
        voterId: "XYZ1234567",
        updatedAt: new Date().toISOString()
      }));
    }

    setIsEligible(true);
    setShowEligibility(false);
    setShowOnboarding(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('clearvote_onboarding_seen', 'true');
    
    // Initialize Demo Profile if none exists
    if (!localStorage.getItem('clearvote_user_profile')) {
      localStorage.setItem('clearvote_user_profile', JSON.stringify({
        email: "demo.voter@clearvote.in",
        phone: "+91 98765 43210",
        aadhaar: "XXXX XXXX 1234",
        pan: "ABCDE1234F",
        voterId: "XYZ1234567",
        updatedAt: new Date().toISOString()
      }));
    }
    
    const profileData = localStorage.getItem('clearvote_user_profile');
    if (profileData) setUserProfile(JSON.parse(profileData));
    setShowOnboarding(false);
  };

  const tabs = [
    { 
      id: 'intelligence' as Tab, 
      label: 'Truth Engine', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      id: 'dashboard' as Tab, 
      label: 'Dashboard', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'navigator' as Tab, 
      label: 'Navigator', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    { 
      id: 'practice' as Tab, 
      label: 'Practice Lab', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    },
  ];

  if (!mounted) return <div className="fixed inset-0 bg-[#0b0b0b]" />;

  return (
    <>
      {showPreloader && (
        <div className={`fixed inset-0 z-[200] overflow-hidden ${isAnimComplete ? 'animate-premium-exit' : ''}`}>
          <div className={`w-full h-full bg-[#0b0b0b] flex flex-col items-center justify-center ${isAnimComplete ? 'animate-premium-exit' : ''}`}>
            
            <div className={`relative flex flex-col items-center gap-16 animate-premium-entry [animation-fill-mode:forwards] ${isAnimComplete ? 'animate-premium-exit' : ''}`}>
              
              {/* Simulation Area */}
              <div className="h-40 flex items-center justify-center">
                {simStep === 'selecting' && (
                  <div className="flex gap-4 animate-in fade-in zoom-in-95 duration-700">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-14 h-20 rounded-2xl border ${i === 2 ? 'border-white/40 bg-white/5 ring-4 ring-white/5 scale-110' : 'border-white/5 opacity-20'} transition-all duration-500 flex flex-col p-3 gap-2`}>
                        <div className="w-full h-1.5 bg-white/10 rounded-full" />
                        <div className="w-2/3 h-1.5 bg-white/5 rounded-full" />
                        <div className={`mt-auto w-4 h-4 rounded-full self-end ${i === 2 ? 'bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-white/5'}`} />
                      </div>
                    ))}
                  </div>
                )}
                {simStep === 'casting' && (
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full border border-white/20 animate-ping opacity-20" />
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center animate-in zoom-in duration-500">
                      <div className="w-6 h-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                    </div>
                  </div>
                )}
                {simStep === 'printing' && (
                  <div className="w-28 h-40 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden p-4 flex flex-col gap-3 animate-in slide-in-from-top-12 duration-700">
                    <div className="w-full h-2 bg-white/20 rounded-full" />
                    <div className="w-3/4 h-2 bg-white/10 rounded-full" />
                    <div className="mt-4 w-14 h-14 rounded-xl bg-white/5 self-center border border-white/10 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-white/10" />
                    </div>
                    <div className="mt-auto text-[6px] text-zinc-600 font-bold uppercase text-center tracking-widest">Verifying Slip...</div>
                  </div>
                )}
                {simStep === 'verified' && (
                  <div className="flex flex-col items-center gap-4 animate-in zoom-in-90 duration-500">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-4xl shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                      ✓
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 animate-pulse">Integrity Confirmed</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4 relative z-10">
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white animate-in zoom-in-95 duration-1000 flex items-center gap-1">
                  <span className="font-thin opacity-30">Clear</span>
                  <span className="text-glow">Vote</span>
                </h1>
                <div className="h-4 overflow-hidden flex justify-center w-full">
                  <p key={loadingStep} className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 animate-in slide-in-from-bottom-2 duration-500">
                    {LOADING_STEPS[loadingStep]}
                  </p>
                </div>
              </div>

              <div className="w-64 h-[1px] bg-white/[0.05] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/30 animate-loader-progress" />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="h-screen flex flex-col md:flex-row bg-background text-primary selection:bg-white/10 overflow-hidden font-sans">
      
      {/* Overlays */}
      {showEligibility && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-3xl">
          <EligibilityCheck onPassed={handleEligibilityPassed} onSkip={handleDemoSkip} />
        </div>
      )}
      {showOnboarding && <AuthOnboarding onComplete={completeOnboarding} />}


      {/* Minimalist Sidebar (Desktop Only) */}
      <aside 
        id="main-sidebar"
        aria-label="Main Navigation"
        className={`hidden md:flex ${isCollapsed ? 'w-[72px]' : 'w-64'} bg-[#0f0f10] flex-col border-r border-white/5 overflow-hidden transition-all duration-500 ease-in-out z-50`}
      >
        <div className={`flex flex-col h-full p-4 gap-4 ${isCollapsed ? 'w-[72px]' : 'w-64'} transition-all duration-500`}>
          <div className="flex items-center justify-between px-2 mb-4 mt-4">
            {!isCollapsed && (
              <h1 className="text-lg font-extrabold tracking-tighter flex items-center gap-0.5 animate-in fade-in duration-300">
                <span className="font-thin opacity-30">Clear</span>
                <span className="text-glow">Vote</span>
              </h1>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-expanded={!isCollapsed}
              aria-controls="main-sidebar"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`p-1.5 rounded-lg bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-all ${isCollapsed ? 'mx-auto' : ''}`}
            >
              <svg className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex flex-1 flex-col gap-1" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls="main-content"
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-medium ${
                  activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? tab.label : ''}
              >
                <div className="shrink-0" aria-hidden="true">{tab.icon}</div>
                {!isCollapsed && <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">{tab.label}</span>}
              </button>
            ))}
          </nav>


          {/* Onboarding Help Re-trigger */}
          <button 
            onClick={() => setShowEligibility(true)}
            className={`flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-zinc-300 transition-all text-[10px] font-bold uppercase tracking-widest ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={isCollapsed ? 'Check Eligibility' : ''}
          >
            <div className="shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            {!isCollapsed && <span className="truncate animate-in fade-in duration-300">Check Eligibility</span>}
          </button>

          {/* Bottom Profile */}
          <div className="mt-auto border-t border-white/5 pt-4">
            <div className={`flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group ${isCollapsed ? 'justify-center px-0' : ''}`}>
              <div className="w-7 h-7 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                {userProfile ? userProfile.email[0].toUpperCase() : 'G'}
              </div>
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                  <p className="text-xs font-medium truncate text-zinc-300 capitalize">
                    {userProfile ? userProfile.email.split('@')[0] : 'Guest'}
                  </p>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                    {userProfile ? 'Verified Account' : 'Limited Access'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-white/[0.03] rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-white/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Main Area */}
      <div 
        id="main-content"
        role="main"
        aria-live="polite"
        className="flex-1 overflow-hidden flex flex-col relative bg-background p-7"
      >
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 w-full bg-transparent flex items-center justify-between px-4 sm:px-6 py-2" aria-label="Tool options">
          <div className="hidden md:flex items-center gap-3 sm:gap-4 md:min-w-[200px]">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-1">
              <span className="font-thin opacity-50">
                {activeTab === 'intelligence' ? 'Intelligence' : activeTab === 'practice' ? 'Practice' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
              <span>
                {activeTab === 'intelligence' ? 'Hub' : activeTab === 'practice' ? 'Lab' : ''}
              </span>
            </h2>
          </div>

            {activeTab === 'intelligence' && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 flex p-1 bg-white/5 rounded-full border border-white/5 scale-90 sm:scale-100"
                role="group"
                aria-label="Truth Engine Mode"
              >
                 <div 
                   className={`absolute top-0.5 bottom-0.5 transition-all duration-500 ease-out bg-white/10 border border-white/10 rounded-full shadow-lg ${
                     intelMode === 'verify' ? 'left-1 w-[calc(50%-0.25rem)]' : 'left-[50%] w-[calc(50%-0.25rem)]'
                   }`} 
                 />
                 <button 
                   onClick={() => setIntelMode('verify')}
                   aria-pressed={intelMode === 'verify'}
                   className={`relative z-10 px-5 sm:px-8 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                     intelMode === 'verify' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                   }`}
                 >
                   Verify
                 </button>
                 <button 
                   onClick={() => setIntelMode('research')}
                   aria-pressed={intelMode === 'research'}
                   className={`relative z-10 px-5 sm:px-8 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                     intelMode === 'research' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                   }`}
                 >
                   Research
                 </button>
              </div>
            )}

        </header>

        <div className="flex-1 overflow-y-auto relative scroll-smooth pb-24 md:pb-0">
          <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-12 min-h-full max-w-3xl mx-auto">
            {activeTab === 'intelligence' && (
              <div className="w-full flex flex-col items-center">
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  {intelMode === 'verify' ? <Verifier /> : <CandidateResearch />}
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              !isEligible ? (
                <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 animate-in fade-in duration-700 px-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] sm:rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl animate-float">🛡️</div>
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-glow">Identity Locked</h2>
                    <p className="text-zinc-500 text-xs sm:text-sm font-light max-w-[250px] sm:max-w-xs mx-auto leading-relaxed">Verify your legal voting eligibility to unlock your personal Readiness Vault.</p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <button 
                      onClick={() => setShowEligibility(true)}
                      className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-black rounded-2xl font-extrabold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    >
                      Check Eligibility
                    </button>
                    <button 
                      onClick={handleDemoSkip}
                      className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.3em] hover:text-zinc-300 transition-colors py-2"
                    >
                      Skip for Demo
                    </button>
                  </div>
                  <div className="pt-4 border-t border-white/5 w-full max-w-[200px]">
                    <p className="text-[7px] sm:text-[8px] text-zinc-600 text-center leading-tight uppercase tracking-widest font-medium">
                      Legal Notice: This is a demonstration environment. No real legal verification is performed. ClearVote is an independent project and is not affiliated with the Election Commission of India.
                    </p>
                  </div>
                </div>
              ) : <Dashboard />
            )}

            {activeTab === 'navigator' && <Navigator />}
            {activeTab === 'practice' && <PracticeLab />}
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f10]/80 backdrop-blur-2xl border-t border-white/5 px-6 pb-8 pt-3 flex items-center justify-between">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => handleTabChange(tab.id)}
               className={`flex flex-col items-center gap-1.5 transition-all ${
                 activeTab === tab.id ? 'text-white' : 'text-zinc-600'
               }`}
             >
               <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-white/10 scale-110 shadow-lg shadow-white/5' : ''}`}>
                 {tab.icon}
               </div>
               <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 scale-50'} transition-all duration-300`}>
                 {tab.label.split(' ')[0]}
               </span>
             </button>
           ))}
        </nav>
      </div>
    </main>
  </>
  );
}
