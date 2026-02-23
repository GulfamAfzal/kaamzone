'use client';

import { useActionState, useEffect } from 'react';
import { registerUser } from '@/lib/actions/auth-actions';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [state, dispatch] = useActionState(registerUser, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      
      {/* 1. BACKGROUND LAYER WITH OVERLAY */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/background.png" 
          alt="Background" 
          fill 
          className="object-cover"
          priority
        />
        {/* Deepened overlay for maximum contrast against the light-green card */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-brightness-50"></div>
      </div>

      {/* 2. GLOWING DESIGN ELEMENTS */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60 z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-40 z-0"></div>

      <div className="w-full max-w-md z-10 px-4">
        {/* Main Card: Subtle light-mint tint with high-end glassmorphism */}
        <div className="bg-emerald-50/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-white/40 p-8 md:p-10">
          
          <div className="text-center mb-10">
            {/* 3. LOGO CONTAINER: Zoomed logo in w-20 container with internal scale */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-4 shadow-2xl border-4 border-white overflow-hidden p-0.5 transform transition-transform hover:scale-110 active:rotate-2">
              <Image 
                src="/logo.jpg" 
                alt="KaamZone Logo" 
                width={120} 
                height={120} 
                className="object-contain scale-125" 
              />
            </div>
            
            <h1 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">Create Account</h1>
            <p className="text-emerald-800/80 text-xs font-black uppercase tracking-widest">Join the Verified Workforce</p>
          </div>

          <form action={dispatch} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                name="email" 
                type="email" 
                required
                placeholder="name@example.com" 
                className="w-full p-4 bg-white/90 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-slate-800 shadow-inner" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
              <input 
                name="password" 
                type="password" 
                required
                placeholder="••••••••" 
                className="w-full p-4 bg-white/90 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-slate-800 shadow-inner" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Account Role</label>
              <div className="relative">
                <select 
                  name="role" 
                  required 
                  className="w-full p-4 bg-white/90 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer outline-none text-slate-800 font-black shadow-inner"
                >
                  <option value="WORKER">Worker (Looking for work)</option>
                  <option value="JOB_PROVIDER">Client (Looking to hire)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                  ▼
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl animate-bounce shadow-sm">
                ⚠️ {state.error}
              </div>
            )}

            {state?.success && (
              <div className="p-4 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg border-2 border-emerald-400">
                ✅ {state.success}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/30 transition-all transform active:scale-95 mt-4 border-b-4 border-emerald-800 uppercase tracking-widest text-xs"
            >
              Register Account
            </button>
          </form>

          <div className="mt-8 text-center border-t border-emerald-200 pt-6">
            <p className="text-sm text-emerald-900 font-bold">
              Already a member? {' '}
              <Link href="/login" className="text-emerald-700 font-black hover:underline underline-offset-4 decoration-2">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}