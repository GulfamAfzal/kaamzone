'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '../../../lib/actions/auth-actions.js';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/30 transition-all transform active:scale-95 mt-4 border-b-4 border-emerald-800 uppercase tracking-widest text-xs disabled:opacity-50"
    >
      {pending ? 'Verifying...' : 'Log In to KaamZone'}
    </button>
  );
}

export default function LoginPage() {
  const [state, dispatch] = useActionState(authenticate, undefined);
  const router = useRouter();

  // Role-Based Redirection logic
  useEffect(() => {
    if (state?.success) {
      if (state.role === 'JOB_PROVIDER') {
        router.push('/dashboard/client');
      } else if (state.role === 'WORKER') {
        router.push('/dashboard/worker');
      }
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      
      {/* 1. BACKGROUND LAYER WITH OVERLAY (Matches Register) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/background.png" 
          alt="Background" 
          fill 
          className="object-cover"
          priority
        />
        {/* Deepened overlay for consistent contrast */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-brightness-50"></div>
      </div>

      {/* 2. GLOWING DESIGN ELEMENTS */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/30 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60 z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl opacity-40 z-0"></div>

      <div className="max-w-md w-full z-10 px-4">
        {/* Main Card: Matches the Register Page mint-green tint */}
        <div className="bg-emerald-50/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-white/40 p-8 md:p-10">
          
          <div className="text-center mb-10">
            {/* 3. LOGO CONTAINER: Matches the zoomed w-20 container from Register */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-4 shadow-2xl border-4 border-white overflow-hidden p-0.5 transform transition-transform hover:scale-110 active:rotate-2">
              <Image 
                src="/logo.jpg" 
                alt="KaamZone Logo" 
                width={120} 
                height={120} 
                className="object-contain scale-100" 
              />
            </div>
            
            <h2 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">Welcome Back</h2>
            <p className="text-emerald-800/80 text-xs font-black uppercase tracking-widest">Access your verified marketplace</p>
          </div>
          
          {/* Detailed Error Feedback */}
          {typeof state === 'string' && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold animate-bounce text-center shadow-sm">
              ⚠️ {state}
            </div>
          )}

          <form action={dispatch} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full bg-white/90 border border-emerald-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-slate-800 shadow-inner"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full bg-white/90 border border-emerald-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-slate-800 shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <SubmitButton />
          </form>

          <div className="mt-8 text-center border-t border-emerald-200 pt-6">
            <p className="text-sm text-emerald-900 font-bold">
              Need an account? {' '}
              <Link href="/" className="text-emerald-700 font-black hover:underline underline-offset-4 decoration-2">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}