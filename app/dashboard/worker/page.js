// app/dashboard/worker/page.js
import { auth, signOut } from '../../../auth.js';
import Link from 'next/link';

export default async function WorkerDashboard() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border-t-4 border-emerald-500">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Worker Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Logged in as: {session?.user?.email}</p>
          </div>
          
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}>
            <button className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition duration-200 font-semibold">
              Log Out
            </button>
          </form>
        </div>
        
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6 flex justify-between items-center">
          <div>
            <p className="text-emerald-800 font-medium">Welcome to KaamZone!</p>
            <p className="text-emerald-600 text-sm mt-1">Your account role is verified as: <strong>{session?.user?.role}</strong></p>
          </div>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Profile Pending
          </span>
        </div>

        {/* --- NEW SECTION: The Action Panel --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Identity & Portfolio</h2>
            <p className="text-slate-500 text-sm mb-4">You must complete your profile and CNIC verification before you can apply for jobs.</p>
            <Link 
              href="/dashboard/worker/profile" 
              className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              Update Profile
            </Link>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-xl h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <svg className="w-12 h-12 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <p>Job Feed Locked</p>
            <p className="text-xs mt-1">Complete your profile to unlock.</p>
          </div>
        </div>

      </div>
    </div>
  );
}