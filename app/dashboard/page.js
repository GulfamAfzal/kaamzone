// app/page.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Data strictly for Pakistan Nationwide hierarchy [cite: 13, 160]
const LOCATION_DATA = {
  Punjab: {
    Lahore: ["Lahore City", "Shalimar", "Model Town", "Raiwind"],
    Mianwali: ["Mianwali City", "Isakhel", "Piplan"],
    Faisalabad: ["Faisalabad City", "Jaranwala", "Sammundri"]
  },
  Sindh: {
    Karachi: ["East", "West", "South", "Central", "Malir"],
    Hyderabad: ["Hyderabad City", "Latifabad", "Qasimabad"]
  }
};

const CATEGORIES = [
  { name: "Electrical", icon: "⚡" },
  { name: "Plumbing", icon: "🚰" },
  { name: "Construction", icon: "🏗️" },
  { name: "Cleaning", icon: "🧹" },
  { name: "Driving", icon: "🚗" },
  { name: "Cooking", icon: "🍳" }
];

export default function HomePage() {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION: Massive Search & Location Engine [cite: 350, 379] */}
      <section className="relative pt-20 pb-32 px-4 bg-gradient-to-br from-emerald-800 to-emerald-600 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Pakistan’s First <span className="text-gold-500 underline decoration-white/20">Verified</span> <br/> Labor Marketplace
          </h1>
          <p className="text-emerald-50 text-xl mb-12 max-w-3xl mx-auto font-medium">
            Bridging the trust deficit by connecting households with 100% CNIC-verified workers[cite: 11, 26].
          </p>

          {/* Hierarchical Search Box [cite: 350, 379] */}
          <div className="bg-white p-4 rounded-3xl shadow-2xl max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Province */}
              <select 
                onChange={(e) => {setProvince(e.target.value); setDistrict(''); setTehsil('');}}
                className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-semibold"
              >
                <option value="">Select Province</option>
                {Object.keys(LOCATION_DATA).map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              {/* District */}
              <select 
                disabled={!province}
                onChange={(e) => {setDistrict(e.target.value); setTehsil('');}}
                className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-semibold disabled:opacity-50"
              >
                <option value="">Select District</option>
                {province && Object.keys(LOCATION_DATA[province]).map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              {/* Tehsil */}
              <select 
                disabled={!district}
                onChange={(e) => setTehsil(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-semibold disabled:opacity-50"
              >
                <option value="">Select Tehsil</option>
                {district && LOCATION_DATA[province][district].map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              {/* Action Button */}
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                Search Workers
              </button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
              <span>Popular:</span>
              <button className="hover:text-emerald-600">Electrician</button>
              <button className="hover:text-emerald-600">Plumber</button>
              <button className="hover:text-emerald-600">Mason (Raj-mistri)</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY GRID: Recognizeable SVG Icons [cite: 350] */}
      <section className="py-24 px-4 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Browse by Skill</h2>
                <p className="text-slate-500">Only showing workers available in your selected area[cite: 363].</p>
              </div>
              <Link href="/register" className="text-emerald-600 font-bold hover:underline">View All Categories &rarr;</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="flex flex-col items-center p-6 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition group cursor-pointer">
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <h3 className="font-bold text-slate-700 group-hover:text-emerald-700">{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST SIGNALS: Real Data Verification [cite: 11, 21, 351] */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-white rounded-2xl border-l-4 border-emerald-500 shadow-sm">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-2xl">🛡️</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3 text-emerald-600">CNIC Verified [cite: 12]</h4>
              <p className="text-slate-600 leading-relaxed">
                Zero-tolerance for dummy data[cite: 11]. Every worker uploads their CNIC, which is manually verified by our admins before approval[cite: 43, 56].
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl border-l-4 border-gold-500 shadow-sm">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-2xl">💸</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3 text-gold-600">JazzCash Escrow [cite: 53, 110]</h4>
              <p className="text-slate-600 leading-relaxed">
                Your money is safe. We hold the payment until you confirm the work is complete[cite: 54, 110].
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl border-l-4 border-slate-500 shadow-sm">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-2xl">🌍</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3 text-slate-700">Bilingual UI [cite: 13, 69]</h4>
              <p className="text-slate-600 leading-relaxed">
                Easy to use for everyone. Switch between English and Urdu with a single click[cite: 80].
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION (CTA) */}
      <section className="py-20 px-4 bg-emerald-900 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 italic font-urdu">معیاری کام، بھروسے کے ساتھ</h2>
          <h2 className="text-3xl font-bold mb-8">Ready to Hire Professional Help?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg">
              Register as Worker
            </Link>
            <Link href="/dashboard/client/post-job" className="bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg">
              Post a Job for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}