'use client';

import { useState, useActionState, useEffect } from 'react';
import { createJob } from '../../../../lib/actions/job-actions.js';
import Link from 'next/link';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';

const PAKISTAN_DATA = {
  Punjab: {
    Mianwali: ["Mianwali", "Isakhel", "Piplan"],
    Lahore: ["Lahore City", "Raiwind", "Shalimar"],
    Faisalabad: ["Faisalabad City", "Jaranwala", "Sammundri"]
  },
  Sindh: {
    Karachi: ["East", "West", "South", "Central", "Malir"],
    Hyderabad: ["Hyderabad City", "Latifabad"]
  },
  KPK: { Peshawar: ["Peshawar City", "Hayatabad"], Mardan: ["Mardan", "Takht Bhai"] },
  Balochistan: { Quetta: ["Quetta City", "Panjpai"], Gwadar: ["Gwadar", "Pasni"] }
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl hover:bg-emerald-500 transition-all transform active:scale-[0.98] border-b-4 border-emerald-800 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? 'Broadcasting...' : 'Broadcast Job Posting'}
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

  useEffect(() => {
    setTotalBudget(days * salary);
  }, [days, salary]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-12">
      
      {/* BACKGROUND LAYER - Adjusted opacity for clarity */}
      <div className="absolute inset-0 z-0">
        <Image src="/background.png" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[2px]"></div>
      </div>

      {/* HEADER BAR */}
      <div className="bg-emerald-950 py-4 px-6 shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/dashboard/client" className="text-emerald-400 hover:text-white transition font-black text-xl">←</Link>
             <div>
               <h1 className="text-xl font-black text-white tracking-tighter">Post Requirement</h1>
               <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Client Command Center</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-4 relative z-10">
        <form action={dispatch} className="space-y-6">
          
          {/* Section 1: Project Particulars */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white/60">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-700 font-black text-lg shadow-sm">1</div>
              <h2 className="text-lg font-black text-emerald-950">Job Particulars</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Job Heading</label>
                <input 
                  name="title" 
                  type="text" 
                  placeholder="e.g. Need experienced mason for house renovation" 
                  className={`w-full p-4 bg-white/80 border ${state?.fieldErrors?.title ? 'border-red-500' : 'border-emerald-100'} rounded-2xl outline-none font-bold text-slate-800 shadow-sm`}
                />
                {state?.fieldErrors?.title && <p className="mt-2 ml-2 text-[11px] font-bold text-red-600">⚠️ {state.fieldErrors.title[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Skill Category</label>
                  <select name="category" className="w-full p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-black text-slate-800 shadow-sm">
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Construction</option>
                    <option>Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Work Priority</label>
                  <select name="urgency" className="w-full p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-black text-slate-800 shadow-sm">
                    <option value="Standard">Standard</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Timing & Salary (New Section) */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white/60">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 font-black text-lg shadow-sm">2</div>
              <h2 className="text-lg font-black text-emerald-950">Timing & Daily Salary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Hours Per Day</label>
                <input name="workHours" type="number" placeholder="e.g. 8" className="w-full p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-bold text-slate-800 shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Worker Start Time</label>
                <input name="startTime" type="time" className="w-full p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-bold text-slate-800 shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Number of Days</label>
                <input 
                  name="totalDays" 
                  type="number" 
                  onChange={(e) => setDays(Number(e.target.value))}
                  placeholder="e.g. 5" 
                  className="w-full p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-bold text-slate-800 shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Salary Per Day (PKR)</label>
                <input 
                  name="salaryPerDay" 
                  type="number" 
                  onChange={(e) => setSalary(Number(e.target.value))}
                  placeholder="e.g. 1200" 
                  className="w-full p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-bold text-slate-800 shadow-sm" 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white/60">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-700 font-black text-lg shadow-sm">3</div>
              <h2 className="text-lg font-black text-emerald-950">Work Location</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="province" onChange={(e) => {setProvince(e.target.value); setDistrict('');}} className="p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-bold text-slate-800 text-sm shadow-sm">
                <option value="">Province</option>
                {Object.keys(PAKISTAN_DATA).map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <select name="district" disabled={!province} onChange={(e) => setDistrict(e.target.value)} className="p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-bold text-slate-800 text-sm shadow-sm disabled:opacity-30">
                <option value="">District</option>
                {province && Object.keys(PAKISTAN_DATA[province]).map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select name="tehsil" disabled={!district} className="p-4 bg-white/80 border border-emerald-100 rounded-2xl outline-none font-bold text-slate-800 text-sm shadow-sm disabled:opacity-30">
                <option value="">Tehsil</option>
                {district && PAKISTAN_DATA[province][district].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Section 4: Budget & Details */}
          <div className="bg-emerald-50/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white/60">
             <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 font-black text-lg shadow-sm">4</div>
              <h2 className="text-lg font-black text-emerald-950">Calculated Budget</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Estimated Total Budget (PKR)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-sm">Rs.</span>
                  <input 
                    name="budget" 
                    type="number" 
                    value={totalBudget}
                    readOnly
                    className="w-full p-4 pl-14 bg-emerald-100/50 border border-emerald-200 rounded-2xl outline-none font-black text-xl text-emerald-900 shadow-sm" 
                  />
                </div>
                <p className="mt-2 text-[10px] text-emerald-600 font-bold ml-1 italic">Note: Automatically calculated as (Days × Daily Salary)</p>
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2 ml-1">Detailed Description</label>
                <textarea 
                  name="description" 
                  rows="4" 
                  className={`w-full p-4 bg-white/80 border ${state?.fieldErrors?.description ? 'border-red-500' : 'border-emerald-100'} rounded-2xl outline-none font-medium text-slate-700 text-sm shadow-sm`} 
                  placeholder="Explain the specific work details..."
                ></textarea>
                {state?.fieldErrors?.description && <p className="mt-2 ml-2 text-[11px] font-bold text-red-600">⚠️ {state.fieldErrors.description[0]}</p>}
              </div>
            </div>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}