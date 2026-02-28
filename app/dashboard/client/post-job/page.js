'use client';

import { useState, useActionState, useEffect } from 'react';
import { createJob } from '../../../../lib/actions/job-actions.js';
import Link from 'next/link';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import PAKISTAN_DATA from '../../../../lib/data/pakistan-geography.json';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-4 bg-emerald-600 text-white font-black text-base rounded-2xl shadow-xl hover:bg-emerald-500 transition-all transform active:scale-[0.98] border-b-4 border-emerald-800 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Broadcasting...
        </span>
      ) : 'Broadcast Job Posting'}
    </button>
  );
}

export default function PostJobPage() {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [state, dispatch] = useActionState(createJob, undefined);
  
  // Dynamic Budget Calculation Logic
  const [days, setDays] = useState(0);
  const [salary, setSalary] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  // Success State Logic
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setTotalBudget(days * salary);
  }, [days, salary]);

  // Trigger Success Animation if the action returns success (or redirects)
  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
    }
  }, [state]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-8 font-sans">
      
      {/* SUCCESS OVERLAY ANIMATION */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="text-center p-8 bg-white rounded-[3rem] shadow-2xl scale-in-center animate-bounce-short">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">✓</div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Requirement Live!</h2>
            <p className="text-slate-500 font-bold text-sm mb-6">Your job has been broadcasted to all workers in {district}.</p>
            <Link href="/dashboard/client" className="inline-block bg-emerald-600 text-white font-black px-8 py-3 rounded-2xl hover:bg-emerald-500 transition-all uppercase tracking-widest text-xs">Return to Command Center</Link>
          </div>
        </div>
      )}

      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <Image src="/background.png" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]"></div>
      </div>

      {/* REFINED PROFESSIONAL HEADER BAR */}
      <div className="bg-emerald-950/95 backdrop-blur-md py-4 px-8 shadow-2xl relative z-10 border-b border-white/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Link href="/dashboard/client" className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
             </Link>
             <div>
               <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Broadcast Requirement</h1>
               </div>
               <p className="text-[10px] text-emerald-400/70 font-black uppercase tracking-[0.2em]">Secure Node: Client Command Center</p>
             </div>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Protocol v4.2</p>
             <p className="text-[10px] text-emerald-500 font-black">ACTIVE SESSION</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 px-4 relative z-10">
        <form action={dispatch} className="space-y-4">
          
          {/* Section 1: Project Particulars */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-700 font-black text-base shadow-sm border border-emerald-100">1</div>
              <h2 className="text-sm font-black text-emerald-950 uppercase tracking-tight">Job Particulars</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1">Job Heading</label>
                <input 
                  name="title" 
                  type="text" 
                  placeholder="e.g. Need experienced mason for house renovation" 
                  className={`w-full p-3 bg-white/80 border ${state?.fieldErrors?.title ? 'border-red-500' : 'border-emerald-100'} rounded-xl outline-none font-bold text-slate-800 shadow-sm text-sm focus:border-emerald-400 transition-colors`}
                />
                {state?.fieldErrors?.title && <p className="mt-1.5 ml-2 text-[10px] font-bold text-red-600">⚠️ {state.fieldErrors.title[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1">Skill Category</label>
                  <select name="category" className="w-full p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-black text-slate-800 shadow-sm text-xs cursor-pointer">
                    <option value="Construction">Construction</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Driving">Driving</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Moving">Moving</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1">Work Priority</label>
                  <select name="urgency" className="w-full p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-black text-slate-800 shadow-sm text-xs cursor-pointer">
                    <option value="Standard">Standard</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Timing & Salary */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-amber-600 font-black text-base shadow-sm border border-amber-50">2</div>
              <h2 className="text-sm font-black text-emerald-950 uppercase tracking-tight">Timing & Daily Salary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1">Hours Per Day</label>
                <input name="workHours" type="number" placeholder="e.g. 8" className="w-full p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-bold text-slate-800 shadow-sm text-sm" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1">Worker Start Time</label>
                <input name="startTime" type="time" className="w-full p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-bold text-slate-800 shadow-sm text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1">Number of Days</label>
                <input 
                  name="totalDays" 
                  type="number" 
                  onChange={(e) => setDays(Number(e.target.value))}
                  placeholder="e.g. 5" 
                  className="w-full p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-bold text-slate-800 shadow-sm text-sm" 
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1">Salary Per Day (PKR)</label>
                <input 
                  name="salaryPerDay" 
                  type="number" 
                  onChange={(e) => setSalary(Number(e.target.value))}
                  placeholder="e.g. 1200" 
                  className="w-full p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-bold text-slate-800 shadow-sm text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-700 font-black text-base shadow-sm border border-emerald-50">3</div>
              <h2 className="text-base font-black text-emerald-950 uppercase tracking-tight">Work Location</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select 
                name="province" 
                onChange={(e) => {setProvince(e.target.value); setDistrict('');}} 
                className="p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-bold text-slate-800 text-xs shadow-sm cursor-pointer"
              >
                <option value="">Province</option>
                {Object.keys(PAKISTAN_DATA).map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <select 
                name="district" 
                disabled={!province} 
                onChange={(e) => setDistrict(e.target.value)} 
                className="p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-bold text-slate-800 text-xs shadow-sm disabled:opacity-30 cursor-pointer"
              >
                <option value="">District</option>
                {province && Object.keys(PAKISTAN_DATA[province]).map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select 
                name="tehsil" 
                disabled={!district} 
                className="p-3 bg-white/80 border border-emerald-100 rounded-xl outline-none font-bold text-slate-800 text-xs shadow-sm disabled:opacity-30 cursor-pointer"
              >
                <option value="">Tehsil</option>
                {district && PAKISTAN_DATA[province][district].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Section 4: Budget & Details */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/60">
             <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-blue-600 font-black text-base shadow-sm border border-blue-50">4</div>
              <h2 className="text-base font-black text-emerald-950 uppercase tracking-tight">Calculated Budget</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1 ml-1">Total Budget (PKR)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-sm">Rs.</span>
                  <input 
                    name="budget" 
                    type="number" 
                    value={totalBudget}
                    readOnly
                    className="w-full p-3 pl-14 bg-emerald-100/30 border border-emerald-200 rounded-xl outline-none font-black text-lg text-emerald-900 shadow-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1 ml-1">Detailed Description</label>
                <textarea 
                  name="description" 
                  rows="3" 
                  className={`w-full p-3 bg-white/80 border ${state?.fieldErrors?.description ? 'border-red-500' : 'border-emerald-100'} rounded-xl outline-none font-medium text-slate-700 text-xs shadow-sm focus:border-emerald-400 transition-colors`} 
                  placeholder="Explain the specific work details..."
                ></textarea>
                {state?.fieldErrors?.description && <p className="mt-1 text-[10px] font-bold text-red-600">⚠️ {state.fieldErrors.description[0]}</p>}
              </div>
            </div>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}