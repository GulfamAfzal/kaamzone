'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Navbar({ session }) {
  const pathname = usePathname();

  return (
    <nav className="bg-emerald-950 border-b border-white/10 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. LOGO SECTION */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Decreased box size slightly (w-11 h-11) and kept rounded edges */}
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white shadow-inner flex items-center justify-center border border-white/20">
                <Image 
                  src="/logo.jpg" 
                  alt="KaamZone Logo" 
                  width={48}
                  height={48}
                  // Increased internal scale to 115% for that "very little bit" zoom
                  className="object-contain scale-90 group-hover:scale-125 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-none tracking-tighter">
                  KAAM<span className="text-amber-400">ZONE</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
                  Verified Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* 2. CENTRAL NAVIGATION (Button Pill Style) */}
          <div className="hidden md:flex items-center bg-emerald-900/50 rounded-2xl p-1.5 border border-white/5">
            {[
              { name: 'Home', href: '/' },
              { name: 'Browse Jobs', href: '/jobs' },
              { name: 'Find Workers', href: '/workers' }
            ].map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  pathname === link.href 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 3. USER ACTIONS */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-900/80 rounded-full border border-emerald-700/50 text-[10px] font-bold text-amber-400">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
               </span>
               LIVE: PAKISTAN
            </div>

            {session ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard/client" 
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-6 py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)] active:scale-95 border-b-4 border-amber-600 hover:border-amber-500"
                >
                  DASHBOARD
                </Link>

                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 group shadow-lg shadow-red-900/20"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-emerald-100 font-bold text-sm px-4 hover:text-white transition">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3 rounded-2xl text-sm transition shadow-xl border border-white/10"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}