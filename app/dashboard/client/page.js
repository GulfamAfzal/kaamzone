// app/dashboard/client/page.js
import { auth, signOut } from '../../../auth.js';
import Link from 'next/link';
import { db } from '../../../lib/db.js';

export default async function ClientDashboard() {
  const session = await auth();
  
  // Fetch real data from your MySQL database
  const userJobs = await db.job.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* 1. PERSISTENT SIDE NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-900 text-white p-6 shadow-2xl">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black tracking-tighter text-gold-400">KAAMZONE</h2>
          <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Client Edition</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-800 transition group">
            <span className="text-xl group-hover:scale-110 transition">🏠</span>
            <span className="font-semibold text-sm">Marketplace Home</span>
          </Link>
          <Link href="/dashboard/client" className="flex items-center gap-3 p-3 rounded-xl bg-emerald-700 shadow-inner border border-white/10">
            <span className="text-xl">📊</span>
            <span className="font-semibold text-sm">Command Center</span>
          </Link>
          <Link href="/dashboard/client/post-job" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-800 transition group">
            <span className="text-xl group-hover:scale-110 transition">➕</span>
            <span className="font-semibold text-sm">Post New Requirement</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-emerald-800/50">
            <p className="text-[10px] text-emerald-400 font-bold uppercase mb-2 px-3">History</p>
            <Link href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-800 transition text-emerald-200">
              <span className="text-xl text-slate-400">🕒</span>
              <span className="font-medium text-sm">Archived Jobs</span>
            </Link>
          </div>
        </nav>

        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-900/40 text-red-200 transition mt-auto">
            <span>🚪</span>
            <span className="font-bold text-sm">Secure Exit</span>
          </button>
        </form>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Navbar for Mobile/Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700 lg:hidden">☰</span>
            <h1 className="text-xl font-bold text-slate-800">Welcome, {session.user.email.split('@')[0]}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex bg-slate-100 rounded-full px-4 py-2 text-xs font-bold text-slate-500">
               Pakistan Standard Time
             </div>
             <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center font-bold text-white ring-4 ring-gold-100">
               {session.user.email[0].toUpperCase()}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Postings</p>
              <h3 className="text-3xl font-black text-emerald-600">{userJobs.length}</h3>
            </div>
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-200 text-white">
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Escrow Balance</p>
              <h3 className="text-3xl font-black">PKR 0.00</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Account Rating</p>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gold-500">5.0</span>
                <span className="text-gold-400">★★★★★</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List of Jobs */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800">Live Postings</h2>
                <Link href="/dashboard/client/post-job" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Manage All &rarr;</Link>
              </div>

              <div className="space-y-4">
                {userJobs.length > 0 ? userJobs.map((job) => (
                  <div key={job.id} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all hover:translate-x-1 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block">
                          {job.category}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">{job.title}</h4>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                           <span className="grayscale group-hover:grayscale-0 transition">📍</span> {job.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-800">Rs. {job.budget}</p>
                        <span className="text-[10px] font-bold text-blue-500 uppercase">{job.status}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-slate-700">No active jobs found</h3>
                    <p className="text-slate-400 mb-6">Post a requirement to find verified workers today.</p>
                    <Link href="/dashboard/client/post-job" className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-emerald-700">Get Started</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Verification & Trust Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                 <h3 className="font-black text-slate-800 mb-6">Security Profile</h3>
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                        <span className="text-slate-400">Identity Status</span>
                        <span className="text-emerald-600">Verified</span>
                     </div>
                     <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[100%]"></div>
                     </div>
                   </div>
                   
                   <div className="p-4 bg-gold-50 border border-gold-100 rounded-2xl">
                     <p className="text-xs text-gold-800 font-bold leading-relaxed">
                       Your account is 100% compliant with KaamZone security standards. You are eligible for JazzCash Escrow payments.
                     </p>
                   </div>
                 </div>
              </div>
              
              {/* Promotion / Support Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl">
                 <h4 className="font-bold mb-2">Need Help?</h4>
                 <p className="text-emerald-100 text-xs mb-6">Contact our 24/7 Mianwali-based support for assistance with workers.</p>
                 <button className="w-full bg-white text-emerald-900 font-bold py-3 rounded-xl text-sm">Talk to Admin</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}