'use client';

import { useState, useActionState } from 'react';
import { createJob } from '../../../../lib/actions/job-actions.js';
import Link from 'next/link';

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

export default function PostJobPage() {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [state, dispatch] = useActionState(createJob, undefined);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/client" className="p-2 bg-white rounded-full shadow-sm hover:text-emerald-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Describe the Work</h1>
        </div>

        <form action={dispatch} className="space-y-6">
          {/* Section 1: The Basics */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-emerald-700 mb-6 flex items-center gap-2">
              <span className="bg-emerald-100 p-1 rounded">01</span> Project Overview
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                <input name="title" type="text" placeholder="e.g. Need plumber for bathroom pipe leakage" className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select name="category" className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500">
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Construction</option>
                    <option>Cleaning</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Urgency</label>
                  <select name="urgency" className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500">
                    <option value="Standard">Standard</option>
                    <option value="Urgent">Urgent (ASAP)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location (Hierarchical) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-emerald-700 mb-6 flex items-center gap-2">
              <span className="bg-emerald-100 p-1 rounded">02</span> Precise Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="province" onChange={(e) => {setProvince(e.target.value); setDistrict('');}} className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500">
                <option value="">Province</option>
                {Object.keys(PAKISTAN_DATA).map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <select name="district" disabled={!province} onChange={(e) => setDistrict(e.target.value)} className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
                <option value="">District</option>
                {province && Object.keys(PAKISTAN_DATA[province]).map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select name="tehsil" disabled={!district} className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
                <option value="">Tehsil</option>
                {district && PAKISTAN_DATA[province][district].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Section 3: Budget & Details */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-emerald-700 mb-6 flex items-center gap-2">
              <span className="bg-emerald-100 p-1 rounded">03</span> Budget & Scope
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Proposed Budget (PKR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-400 font-bold">Rs.</span>
                  <input name="budget" type="number" className="w-full p-4 pl-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="Minimum 500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea name="description" rows="4" className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="Explain the work in detail..."></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:bg-emerald-700 transition-all transform active:scale-95">
            Publish Job to Marketplace
          </button>
        </form>
      </div>
    </div>
  );
}