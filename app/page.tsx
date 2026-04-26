'use client';

import { useState, useEffect } from 'react';
import Verifier from '../components/Verifier';
import Dashboard from '../components/Dashboard';
import Navigator from '../components/Navigator';
import Onboarding from '../components/Onboarding';

type Tab = 'dashboard' | 'verifier' | 'navigator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('verifier');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('clearvote_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('clearvote_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  const tabs = [
    { 
      id: 'verifier' as Tab, 
      label: 'Verifier', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      {/* Minimalist Sidebar */}
      <aside 
        className={`h-screen bg-[#111] flex flex-col transition-all duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } relative border-r border-white/5`}
      >
        <div className="flex flex-col h-full p-4 gap-4 overflow-hidden whitespace-nowrap">
          {/* Header */}
          <div className="flex items-center justify-between px-2 mb-4">
            <h1 className="text-sm font-bold tracking-tight">ClearVote</h1>
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
                onClick={() => setActiveTab(tab.id)}
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
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-zinc-300 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            How it works
          </button>

          {/* Bottom Profile */}
          <div className="mt-auto border-t border-white/5 pt-4">
            <div className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">SM</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium truncate text-zinc-300">Soujanya Mallick</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle when closed */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 p-2 bg-[#111] border border-white/5 rounded-md hover:bg-white/10 transition-all z-50 text-zinc-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto flex flex-col relative bg-background">
        <header className="p-4 flex items-center justify-between z-40">
          <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Protocol v2.0.4</span>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full pb-20">
          {activeTab === 'verifier' && <Verifier />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'navigator' && <Navigator />}
        </div>
      </div>
    </main>
  );
}
