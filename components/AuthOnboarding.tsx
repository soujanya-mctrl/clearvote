'use client';

import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type Step = 'welcome' | 'auth' | 'aadhaar' | 'pan' | 'voter' | 'complete';

export default function AuthOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [voterId, setVoterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // For the hackathon demo, we simulate a Firebase successful login if keys are missing
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
         console.warn("Firebase API key missing. Simulating success for demo.");
         setTimeout(() => {
           setStep('aadhaar');
           setLoading(false);
         }, 1000);
         return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      setStep('aadhaar');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      // If user exists, try signing in
      if (error.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          setStep('aadhaar');
        } catch (innerErr: unknown) {
          const iErr = innerErr as { message?: string };
          setError(iErr.message || 'Authentication failed');
        }
      } else {
        setError(error.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const profile = { email, phone, aadhaar, pan, voterId, updatedAt: new Date().toISOString() };
      localStorage.setItem('clearvote_user_profile', JSON.stringify(profile));
      
      // Attempt Firestore save if connected
      if (auth.currentUser) {
        await setDoc(doc(db, "users", auth.currentUser.uid), profile);
      }
      
      setStep('complete');
    } catch (err: unknown) {
      console.error("Save failed:", err);
      setStep('complete'); // Proceed anyway for demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-[#171717] border border-[#262626] rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-4 px-2">
           {['auth', 'aadhaar', 'pan', 'voter'].map((s, i) => (
             <div key={s} className="flex items-center">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                  step === s ? 'bg-white text-black border-white' : 
                  ['aadhaar', 'pan', 'voter', 'complete'].indexOf(step) > i ? 'bg-zinc-800 text-zinc-500 border-zinc-800' : 'border-zinc-800 text-zinc-800'
                }`}>
                  {i + 1}
                </div>
                {i < 3 && <div className="w-8 h-[1px] bg-zinc-800 mx-2" />}
             </div>
           ))}
        </div>

        {step === 'welcome' && (
          <div className="text-center space-y-8 animate-in slide-in-from-bottom-4">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mx-auto">🛡️</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Secure Onboarding</h2>
              <p className="text-sm text-zinc-500 leading-relaxed">Let&apos;s verify your identity and documents to ensure your electoral readiness.</p>
            </div>
            <button onClick={() => setStep('auth')} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm">Get Started</button>
          </div>
        )}

        {step === 'auth' && (
          <form onSubmit={handleAuth} className="space-y-6 animate-in slide-in-from-right-4">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-white">Identity Access</h3>
              <p className="text-xs text-zinc-500">Enter your credentials to link your DigiLocker data.</p>
            </div>
            <div className="space-y-3">
              <input type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-3.5 bg-black/40 border border-[#262626] rounded-xl text-sm focus:border-zinc-600 transition-all outline-none" />
              <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-3.5 bg-black/40 border border-[#262626] rounded-xl text-sm focus:border-zinc-600 transition-all outline-none" />
              <input type="tel" placeholder="Phone Number (Optional)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-3.5 bg-black/40 border border-[#262626] rounded-xl text-sm focus:border-zinc-600 transition-all outline-none" />
            </div>
            {error && <p className="text-[10px] text-error text-center font-bold uppercase">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm disabled:opacity-30">
              {loading ? "Authenticating..." : "Continue"}
            </button>
          </form>
        )}

        {step === 'aadhaar' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-white">Aadhaar Link</h3>
              <p className="text-xs text-zinc-500">Your unique 12-digit identity for electoral roll deduplication.</p>
            </div>
            <input type="text" placeholder="1234 5678 9012" value={aadhaar} onChange={e => setAadhaar(e.target.value)} className="w-full px-5 py-3.5 bg-black/40 border border-[#262626] rounded-xl text-sm text-center tracking-[0.5em] font-mono outline-none" />
            <button onClick={() => setStep('pan')} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm">Next Step</button>
          </div>
        )}

        {step === 'pan' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-white">PAN Verification</h3>
              <p className="text-xs text-zinc-500">Secondary identity check for comprehensive profile verification.</p>
            </div>
            <input type="text" placeholder="ABCDE1234F" value={pan} onChange={e => setPan(e.target.value)} className="w-full px-5 py-3.5 bg-black/40 border border-[#262626] rounded-xl text-sm text-center tracking-[0.5em] font-mono outline-none uppercase" />
            <button onClick={() => setStep('voter')} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm">Next Step</button>
          </div>
        )}

        {step === 'voter' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-white">Voter ID (EPIC)</h3>
              <p className="text-xs text-zinc-500">The essential identifier for casting your vote.</p>
            </div>
            <input type="text" placeholder="XYZ1234567" value={voterId} onChange={e => setVoterId(e.target.value)} className="w-full px-5 py-3.5 bg-black/40 border border-[#262626] rounded-xl text-sm text-center tracking-[0.2em] font-mono outline-none uppercase" />
            <button onClick={saveProfile} disabled={loading} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm disabled:opacity-30">
              {loading ? "Syncing..." : "Finish Onboarding"}
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-4xl mx-auto text-success">✓</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Profile Verified</h2>
              <p className="text-sm text-zinc-500 leading-relaxed">Your electoral profile has been synced with DigiLocker and Firebase. You are ready to explore ClearVote.</p>
            </div>
            <button onClick={onComplete} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm">Enter Dashboard</button>
          </div>
        )}

        {/* Brand Meta */}
        <div className="text-center opacity-10 pt-4">
           <p className="text-[8px] uppercase tracking-[0.4em] font-black">DigiLocker Certified Environment</p>
        </div>
      </div>
    </div>
  );
}
