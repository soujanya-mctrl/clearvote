'use client';

import { useState, useEffect } from 'react';
import Verifier from '../components/Verifier';
import Dashboard from '../components/Dashboard';
import Navigator from '../components/Navigator';
import CandidateResearch from '../components/CandidateResearch';
import AuthOnboarding from '../components/AuthOnboarding';
import EligibilityCheck from '../components/EligibilityCheck';

type Tab = 'dashboard' | 'intelligence' | 'navigator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('intelligence');
  const [intelMode, setIntelMode] = useState<'verify' | 'research'>('verify');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEligibility, setShowEligibility] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

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
  ];

  return (
    <main className="h-screen flex bg-background text-primary selection:bg-white/10 overflow-hidden font-sans">
      
      {/* Overlays */}
      {showEligibility && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-3xl">
          <EligibilityCheck onPassed={handleEligibilityPassed} />
        </div>
      )}
      {showOnboarding && <AuthOnboarding onComplete={completeOnboarding} />}

      {/* Minimalist Sidebar */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 bg-[#0f0f10] flex flex-col transition-all duration-300 z-50 border-r border-white/5 overflow-hidden ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'
        }`}>
        <div className={`flex flex-col h-full p-4 gap-4 w-64 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          {/* Header */}
          <div className="flex items-center justify-between px-2 mb-4 mt-12">
            <h1 className="text-sm font-extrabold tracking-tight">ClearVote</h1>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-zinc-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-medium ${
                  activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Onboarding Help Re-trigger */}
          <button 
            onClick={() => setShowEligibility(true)}
            className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-zinc-300 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Check Eligibility
          </button>

          {/* Bottom Profile */}
          <div className="mt-auto border-t border-white/5 pt-4">
            <div className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">SM</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium truncate text-zinc-300">Soujanya Mallick</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Admin Account</p>
              </div>
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

      {/* Toggle when closed */}
      {/* Toggle when closed (Removed as it's now in the header) */}

      

      {/* Main Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-background">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-[#0f0f10]/60 backdrop-blur-xl flex items-center justify-between px-6 py-4">
           <div className="flex items-center gap-4 min-w-[200px]">
             {!isSidebarOpen && (
               <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-zinc-400"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                 </svg>
               </button>
             )}
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
               {activeTab === 'intelligence' ? 'Intelligence Hub' : activeTab}
             </span>
           </div>

            {activeTab === 'intelligence' && (
              <div className="absolute left-1/2 -translate-x-1/2 flex p-1 bg-white/5 rounded-full border border-white/5 scale-90 sm:scale-100">
                 <div 
                   className={`absolute top-1 bottom-1 transition-all duration-500 ease-out bg-white/10 border border-white/10 rounded-full shadow-lg ${
                     intelMode === 'verify' ? 'left-1 w-[calc(50%-0.25rem)]' : 'left-[50%] w-[calc(50%-0.25rem)]'
                   }`} 
                 />
                 <button 
                   onClick={() => setIntelMode('verify')}
                   className={`relative z-10 px-5 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                     intelMode === 'verify' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                   }`}
                 >
                   Verify
                 </button>
                 <button 
                   onClick={() => setIntelMode('research')}
                   className={`relative z-10 px-5 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                     intelMode === 'research' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                   }`}
                 >
                   Research
                 </button>
              </div>
            )}

           <div className="hidden md:flex items-center justify-end gap-3 min-w-[200px]">
              <div className="px-3 py-1.5 bg-success/10 border border-success/20 rounded-full flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                 <span className="text-[8px] font-black text-success uppercase tracking-widest">System Active</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto relative scroll-smooth">
          <div className="flex flex-col items-center justify-center px-4 py-12 min-h-full max-w-3xl mx-auto">
            {activeTab === 'intelligence' && (
              <div className="w-full flex flex-col items-center">
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  {intelMode === 'verify' ? <Verifier /> : <CandidateResearch />}
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              !isEligible ? (
                <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-2xl animate-float">🛡️</div>
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tighter text-glow">Identity Locked</h2>
                    <p className="text-zinc-500 text-sm font-light max-w-xs mx-auto">Verify your legal voting eligibility to unlock your personal Readiness Vault.</p>
                  </div>
                  <button 
                    onClick={() => setShowEligibility(true)}
                    className="px-10 py-5 bg-white text-black rounded-2xl font-extrabold text-xs uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                  >
                    Check Eligibility
                  </button>
                </div>
              ) : <Dashboard />
            )}

            {activeTab === 'navigator' && <Navigator />}
          </div>
        </div>
      </div>
    </main>
  );
}
