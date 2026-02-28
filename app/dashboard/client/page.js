import { auth, signOut } from '../../../auth.js';
import Link from 'next/link';
import { db } from '../../../lib/db.js';
import { redirect } from 'next/navigation';

export default async function ClientDashboard() {
  const session = await auth();

  // 1. Fetch User with their ClientProfile
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { clientProfile: true }
  });

  // 2. Safety Redirect: Force profile completion if missing
  if (!user?.clientProfile) {
    redirect('/dashboard/client/setup'); // Ensure this route exists
  }

  // 3. Fetch Real-time Dashboard Data
  const [userJobs, activeCount, escrowData, ratingData] = await Promise.all([
    // Latest 6 jobs for the "Live Postings" list
    db.job.findMany({
      where: { clientId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    // Count only jobs that are strictly "OPEN"
    db.job.count({
      where: { 
        clientId: session.user.id,
        status: "OPEN" 
      }
    }),
    // Sum of all money currently in Escrow for this client
    db.payment.aggregate({
      where: { 
        payerId: session.user.id,
        status: "ESCROW_HELD" 
      },
      _sum: {
        amount: true
      }
    }),
    // Calculate average star rating from reviews received
    db.review.aggregate({
      where: { targetId: session.user.id },
      _avg: {
        rating: true
      }
    })
  ]);

  const escrowBalance = escrowData._sum.amount?.toNumber() || 0;
  const averageRating = ratingData._avg.rating ? ratingData._avg.rating.toFixed(1) : "N/A";
  const identityProgress = user.clientProfile.isVerified ? "100%" : "60%";

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDE NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-900 text-white p-6 shadow-2xl">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black tracking-tighter text-amber-400">KAAMZONE</h2>
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {/* Displaying Full Name from ClientProfile instead of email */}
              Welcome, {user.clientProfile.fullName}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex bg-slate-100 rounded-full px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {user.clientProfile.district}, {user.clientProfile.province}
             </div>
             <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-white ring-4 ring-amber-100 uppercase">
               {user.clientProfile.fullName[0]}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Postings</p>
              <h3 className="text-3xl font-black text-emerald-600">{activeCount}</h3>
            </div>
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-200 text-white">
              <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-1">Escrow Balance</p>
              <h3 className="text-3xl font-black">PKR {escrowBalance.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Account Rating</p>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-amber-500">{averageRating}</span>
                <span className="text-amber-400">★★★★★</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List of Jobs */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Live Postings</h2>
                <Link href="#" className="text-sm font-bold text-emerald-600 hover:underline">Manage All &rarr;</Link>
              </div>

              <div className="space-y-4">
                {userJobs.length > 0 ? userJobs.map((job) => (
                  <div key={job.id} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block tracking-tighter">
                          {job.category}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">{job.title}</h4>
                        <p className="text-slate-500 text-[10px] mt-1 font-bold flex items-center gap-2 uppercase tracking-widest">
                           📍 {job.tehsil}, {job.district}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-800">Rs. {job.budget.toString()}</p>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{job.status}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-16 px-10 text-center">
                    <div className="text-6xl mb-6">📝</div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Ready to hire?</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm font-medium leading-relaxed">Post your requirement and find experts in {user.clientProfile.district}.</p>
                    <Link href="/dashboard/client/post-job" className="inline-block bg-emerald-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 uppercase tracking-wider text-sm">
                      Post Job
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Security Profile Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                 <h3 className="font-black text-slate-800 mb-6 text-xs uppercase tracking-widest">Security Profile</h3>
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                        <span className="text-slate-400">Identity Status</span>
                        <span className={user.clientProfile.isVerified ? "text-emerald-600" : "text-amber-600"}>
                          {user.clientProfile.isVerified ? "100% Verified" : "Verification Pending"}
                        </span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${user.clientProfile.isVerified ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: identityProgress }}
                        ></div>
                     </div>
                   </div>
                   
                   <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                     <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase tracking-tight">
                        CNIC ending in: {user.clientProfile.cnicNumber.slice(-4)}
                     </p>
                     <p className="text-[11px] text-slate-500 mt-1 font-medium italic">
                        Account linked to {user.clientProfile.district} district.
                     </p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}