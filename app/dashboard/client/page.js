// app/dashboard/client/page.js
import { auth, signOut } from '../../../auth.js';
import Link from 'next/link';
import { db } from '../../../lib/db.js';

export default async function ClientDashboard() {
  const session = await auth();
  
  // Realistic Data Fetching: Get the user's actual posted jobs from MySQL
  const userJobs = await db.job.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Client Workspace</h1>
            <p className="text-slate-500">Manage your postings and track work progress.</p>
          </div>
          <Link 
            href="/dashboard/client/post-job" 
            className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg text-center"
          >
            + Post a New Job
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Active Jobs & Postings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 text-lg">Your Recent Postings</h2>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                  Live on Market
                </span>
              </div>
              
              <div className="divide-y divide-slate-100">
                {userJobs.length > 0 ? userJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                      <span className="text-sm font-semibold text-slate-500">PKR {job.budget.toString()}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500 items-center">
                      <span className="flex items-center gap-1">📍 {job.city}</span>
                      <span className="flex items-center gap-1">🏷️ {job.category}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${job.status === 'OPEN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-400">
                    <p className="mb-4">You haven't posted any jobs yet.</p>
                    <Link href="/dashboard/client/post-job" className="text-emerald-600 font-bold underline">Post your first requirement</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Escrow & Account Status */}
          <div className="space-y-6">
            {/* JazzCash Escrow Status Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Financial Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">PKR 0.00</p>
                  <p className="text-slate-400 text-xs">Total Escrow Funds Held</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-amber-400 font-bold text-sm">● 0 Payments Pending Approval</p>
                </div>
              </div>
            </div>

            {/* Profile & Trust Score */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Verification Status</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-xl">👤</div>
                <div>
                  <p className="font-bold text-slate-900">{session.user.email.split('@')[0]}</p>
                  <p className="text-xs text-slate-500 italic">Verified Client</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gold-500 w-[100%] h-full"></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Account Security: 100%</p>
            </div>

            {/* Logout Action */}
            <form action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}>
              <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition">
                Secure Logout
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}