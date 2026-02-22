// components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut } from '../auth.js';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.jpg" 
                alt="KaamZone Logo" 
                width={40} 
                height={40} 
                className="rounded-md"
              />
              <span className="text-2xl font-bold text-emerald-600 tracking-tight">
                Kaam<span className="text-gold-500">Zone</span>
              </span>
            </Link>
          </div>

          {/* Right: Actions and Profile [cite: 379] */}
          <div className="flex items-center gap-4">
            
            {/* Bilingual Toggle Placeholder */}
            <button className="text-sm font-semibold text-slate-500 hover:text-emerald-600 hidden sm:block">
              EN / اردو
            </button>

            {/* Voice Mode Toggle (with animate-pulse as requested) */}
            <button className="text-emerald-500 hover:text-emerald-600 animate-pulse hidden sm:block" title="Voice Mode">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.5a6.5 6.5 0 000-13v13z"></path>
              </svg>
            </button>

            {/* Auth Logic */}
            {session?.user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-emerald-600">
                  Dashboard
                </Link>
                <form action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}>
                  <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition">
                    Log Out
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow-sm">
                Log In
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}