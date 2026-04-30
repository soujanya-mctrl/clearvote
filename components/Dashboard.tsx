'use client';

import { useState, useEffect } from 'react';
import { VerificationDocument } from '../lib/types';

const INITIAL_DOCS: (VerificationDocument & { howToFix: string })[] = [
  {
    id: 'epic',
    name: 'Voter ID (EPIC)',
    status: 'verified',
    description: 'The primary document required to cast your vote at the polling booth.',
    howToGet: 'Register online via the Voters\' Service Portal (NVSP) using Form 6.',
    howToFix: 'Submit Form 8 on the NVSP portal for correction of entries.'
  },
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    status: 'pending',
    description: 'Used for identity verification and record linking.',
    howToGet: 'Visit your nearest Aadhaar Seva Kendra or UIDAI portal.',
    howToFix: 'Use the SSUP portal for address/name corrections.'
  },
  {
    id: 'address',
    name: 'Address Proof',
    status: 'verified',
    description: 'Required to assign your specific polling booth.',
    howToGet: 'Utility bills or rent agreement in your name.',
    howToFix: 'Update your address on the NVSP portal via Form 8.'
  },
  {
    id: 'pan',
    name: 'PAN Card',
    status: 'missing',
    description: 'Secondary identity check for comprehensive profile verification.',
    howToGet: 'Apply via the NSDL or UTIITSL websites using Form 49A.',
    howToFix: 'Submit a correction request via the NSDL portal.'
  }
];

type DashboardDoc = VerificationDocument & { howToFix: string };

export default function Dashboard() {
  const [documents, setDocuments] = useState<DashboardDoc[]>([]);
  const [profile, setProfile] = useState<{ email?: string; phone?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DashboardDoc | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedDocs = localStorage.getItem('clearvote_docs');
      const savedProfile = localStorage.getItem('clearvote_user_profile');
      setDocuments(savedDocs ? JSON.parse(savedDocs) : INITIAL_DOCS);
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    
    // Simulate a complex cross-database verification delay
    setTimeout(() => {
      const updated = documents.map(doc => 
        doc.id === id ? { ...doc, status: 'verified' as const } : doc
      );
      setDocuments(updated);
      localStorage.setItem('clearvote_docs', JSON.stringify(updated));
      if (selectedDoc?.id === id) setSelectedDoc({ ...selectedDoc, status: 'verified' });
      setVerifyingId(null);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Vault...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-10 animate-in fade-in duration-1000 pb-20 px-4">
      
      {/* Personalized Header */}
      <div className="flex items-center justify-between glass-card p-6 premium-gradient">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-xl font-black text-white shadow-xl">
             {profile?.email?.[0]?.toUpperCase() || 'U'}
           </div>
           <div>
             <h2 className="text-lg font-bold text-white tracking-tight">{profile?.email || 'Guest User'}</h2>
             <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Verified Electoral Profile</p>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-xl">
           <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
           <span className="text-[9px] font-black text-success uppercase tracking-widest">Identity Synced</span>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            onClick={() => setSelectedDoc(doc)}
            className="glass-card p-4 group cursor-pointer hover:bg-white/[0.06] transition-all duration-300 relative overflow-hidden"
          >
            {verifyingId === doc.id && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center">
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                doc.status === 'verified' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {doc.status === 'verified' 
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  }
                </svg>
              </div>
              <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                doc.status === 'verified' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {doc.status}
              </span>
            </div>
            <h3 className="text-[11px] font-bold text-white mb-0.5 truncate">{doc.name}</h3>
            <p className="text-[8px] text-zinc-600 font-medium truncate">View details & actions</p>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg glass-card premium-gradient p-10 space-y-8 relative shadow-[0_0_50px_rgba(255,255,255,0.05)] border-white/10">
            <button 
              onClick={() => setSelectedDoc(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex items-center gap-6">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black ${
                 selectedDoc.status === 'verified' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
               }`}>
                 {verifyingId === selectedDoc.id ? '...' : selectedDoc.status === 'verified' ? '✓' : '!'}
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter text-glow">{selectedDoc.name}</h3>
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
                    {verifyingId === selectedDoc.id ? 'Analyzing Protocol...' : selectedDoc.status}
                  </p>
               </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              {selectedDoc.description}
            </p>

            <div className="grid gap-4">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">Procurement Path</p>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    {selectedDoc.howToGet}
                  </p>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">Correction Path</p>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    {selectedDoc.howToFix}
                  </p>
               </div>
            </div>

            {selectedDoc.status !== 'verified' && (
              <button 
                onClick={() => handleVerify(selectedDoc.id)}
                disabled={verifyingId === selectedDoc.id}
                className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-50"
              >
                {verifyingId === selectedDoc.id ? 'Processing Protocol...' : 'Sync with DigiLocker'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Compact Support Footer */}
      <div className="p-6 glass-card bg-zinc-900/40 text-center space-y-1 animate-float">
         <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em]">Official Support Center</p>
         <p className="text-xs text-zinc-400 font-light">Direct assistance: <span className="text-white font-bold text-glow">1950</span></p>
      </div>
    </div>
  );
}
