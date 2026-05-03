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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <main className="h-screen flex flex-col md:flex-row bg-background text-primary selection:bg-white/10 overflow-hidden font-sans">
      
      {/* Overlays */}
      {showEligibility && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-3xl">
          <EligibilityCheck onPassed={handleEligibilityPassed} />
        </div>
      )}
      {showOnboarding && <AuthOnboarding onComplete={completeOnboarding} />}

      {/* Sidebar Overlay (Mobile Only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Minimalist Sidebar (Drawer on mobile) */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 bg-[#0f0f10] flex flex-col transition-all duration-500 ease-in-out z-50 border-r border-white/5 overflow-hidden shadow-2xl md:shadow-none ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-64 md:translate-x-0'
        }`}>
        <div className={`flex flex-col h-full p-4 gap-4 w-72 md:w-64 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between px-2 mb-4 mt-8 md:mt-4">
            <h1 className="text-sm font-extrabold tracking-tight">ClearVote</h1>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-zinc-600 md:hidden"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation (Desktop) */}
          <div className="hidden md:flex flex-1 flex-col gap-1">
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

          {/* Mobile Info/Actions */}
          <div className="md:hidden flex flex-col gap-4 py-4">
             <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] px-2">Navigation</p>
             <div className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { handleTabChange(tab.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-xs font-bold ${
                      activeTab === tab.id 
                      ? 'bg-white/10 text-white shadow-lg' 
                      : 'text-zinc-500 hover:bg-white/5'
                    }`}
                  >
                    <div className={activeTab === tab.id ? 'text-white' : 'text-zinc-600'}>{tab.icon}</div>
                    <span>{tab.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Onboarding Help Re-trigger */}
          <button 
            onClick={() => { setShowEligibility(true); setIsSidebarOpen(false); }}
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

      {/* Main Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-background">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0f0f10]/60 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
           <div className="flex items-center gap-3 sm:gap-4 md:min-w-[200px]">
             <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-zinc-400 md:hidden"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
             </button>
             <span className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] truncate max-w-[100px] sm:max-w-none">
               {activeTab === 'intelligence' ? 'Intelligence' : activeTab}
             </span>
           </div>

            {activeTab === 'intelligence' && (
              <div className="absolute left-1/2 -translate-x-1/2 flex p-0.5 sm:p-1 bg-white/5 rounded-full border border-white/5 scale-[0.8] sm:scale-90 md:scale-100">
                 <div 
                   className={`absolute top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 transition-all duration-500 ease-out bg-white/10 border border-white/10 rounded-full shadow-lg ${
                     intelMode === 'verify' ? 'left-0.5 sm:left-1 w-[calc(50%-0.125rem)] sm:w-[calc(50%-0.25rem)]' : 'left-[50%] w-[calc(50%-0.125rem)] sm:w-[calc(50%-0.25rem)]'
                   }`} 
                 />
                 <button 
                   onClick={() => setIntelMode('verify')}
                   className={`relative z-10 px-3 sm:px-5 py-1.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                     intelMode === 'verify' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                   }`}
                 >
                   Verify
                 </button>
                 <button 
                   onClick={() => setIntelMode('research')}
                   className={`relative z-10 px-3 sm:px-5 py-1.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
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

           {/* Mobile Status Indicator */}
           <div className="md:hidden w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
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
                  <button 
                    onClick={() => setShowEligibility(true)}
                    className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-black rounded-2xl font-extrabold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                  >
                    Check Eligibility
                  </button>
                </div>
              ) : <Dashboard />
            )}

            {activeTab === 'navigator' && <Navigator />}
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

  );
}
