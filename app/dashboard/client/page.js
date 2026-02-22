// app/(dashboard)/client/page.js
import { auth, signOut } from '../../../auth.js';

export default async function ClientDashboard() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border-t-4 border-emerald-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Client Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Logged in as: {session?.user?.email}</p>
          </div>
          
          {/* Secure Server-Action Logout Button */}
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}>
            <button className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition duration-200 font-semibold">
              Log Out
            </button>
          </form>
        </div>
        
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6">
          <p className="text-emerald-800 font-medium">Welcome to KaamZone!</p>
          <p className="text-emerald-600 text-sm mt-1">Your account role is verified as: <strong>{session?.user?.role}</strong></p>
        </div>

        {/* We will build the "Post a Job" button and table here next! */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl h-64 flex items-center justify-center text-slate-400">
          Job Management System Coming Soon...
        </div>
      </div>
    </div>
  );
}