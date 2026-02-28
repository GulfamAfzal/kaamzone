'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { createClientProfile } from '../../../../lib/actions/profile-actions';
import PAKISTAN_DATA from '../../../../lib/data/pakistan-geography.json';
import Image from 'next/image';
import Link from 'next/link';

const PAK_BANKS = [
  { name: 'JazzCash', code: 'JAZZ', length: 11, category: 'Wallet' },
  { name: 'Easypaisa', code: 'EASY', length: 11, category: 'Wallet' },
  { name: 'SadaPay', code: 'SADA', length: 11, category: 'Wallet' },
  { name: 'NayaPay', code: 'NAYA', length: 11, category: 'Wallet' },
  { name: 'Allied Bank Limited', code: 'ABPA', length: 13, category: 'Bank' },
  { name: 'Askari Bank Limited', code: 'ASCM', length: 13, category: 'Bank' },
  { name: 'Bank Alfalah Limited', code: 'ALFH', length: 12, category: 'Bank' },
  { name: 'Bank Al Habib Limited', code: 'BAHL', length: 14, category: 'Bank' },
  { name: 'BankIslami Pakistan Ltd.', code: 'BKIP', length: 15, category: 'Bank' },
  { name: 'The Bank of Punjab', code: 'BPUN', length: 17, category: 'Bank' },
  { name: 'Faysal Bank Limited', code: 'FAYS', length: 14, category: 'Bank' },
  { name: 'Habib Bank Limited', code: 'HABB', length: 14, category: 'Bank' },
  { name: 'Habib Metropolitan Bank', code: 'MPBL', length: 14, category: 'Bank' },
  { name: 'JS Bank', code: 'JSBL', length: 6, category: 'Bank' },
  { name: 'Meezan Bank Limited', code: 'MZBL', length: 14, category: 'Bank' },
  { name: 'Standard Chartered Bank', code: 'SCBL', length: 11, category: 'Bank' },
  { name: 'United Bank Limited', code: 'UNIL', length: 12, category: 'Bank' },
  { name: 'IBAN (International)', code: 'IBAN', length: 24, category: 'International' }
];

export default function ClientSetupPage() {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [state, dispatch] = useActionState(createClientProfile, undefined);

  // Searchable Dropdown States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState(PAK_BANKS[0]);
  const [accountError, setAccountError] = useState('');
  const dropdownRef = useRef(null);

  const filteredBanks = PAK_BANKS.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle outside click to close search
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time Length Validation
  const validateLength = (value) => {
    if (value.length !== selectedBank.length) {
      setAccountError(`Must be exactly ${selectedBank.length} digits for ${selectedBank.name}`);
    } else {
      setAccountError('');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image src="/background.png" alt="BG" fill className="object-cover" />
        <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        <div className="bg-emerald-900 p-5 text-white flex justify-between items-center border-b border-emerald-800">
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Identity Setup</h1>
            <p className="text-emerald-400 text-[8px] font-bold uppercase tracking-widest mt-1">Verified Provider Profile</p>
          </div>
          <Link href="/dashboard/client" className="text-[9px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition font-black uppercase border border-white/10">← Cancel</Link>
        </div>

        <form action={dispatch} className="p-6 space-y-5">
          
          {/* Section 1: Personal Identity */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest border-b border-emerald-50 pb-1">1. Personal Identity</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 ml-1">Full Name</label>
                <input name="fullName" defaultValue={state?.inputs?.fullName} type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xs" />
              </div>
              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 ml-1">CNIC (13 Digits)</label>
                <input name="cnicNumber" defaultValue={state?.inputs?.cnicNumber} type="text" maxLength="13" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xs" />
              </div>
            </div>
          </div>

          {/* Section 2: Financial Gateway with Searchable Dropdown */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest border-b border-emerald-50 pb-1">2. Financial Gateway</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative" ref={dropdownRef}>
                <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 ml-1">Bank / Wallet</label>
                <div 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[10px] cursor-pointer flex justify-between items-center"
                >
                  <span className="truncate">{selectedBank.name}</span>
                  <span className="text-[8px]">▼</span>
                </div>
                
                {isSearchOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search Bank..." 
                      className="w-full p-2 text-[10px] border-b border-slate-100 outline-none font-bold"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="max-h-40 overflow-y-auto">
                      {filteredBanks.map(bank => (
                        <div 
                          key={bank.code}
                          className="p-2 text-[10px] hover:bg-emerald-50 cursor-pointer font-bold border-b border-slate-50"
                          onClick={() => { setSelectedBank(bank); setIsSearchOpen(false); setSearchTerm(''); }}
                        >
                          {bank.name} <span className="text-slate-300 text-[8px]">({bank.category})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <input type="hidden" name="paymentType" value={selectedBank.name} />
              </div>

              <div>
                <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 ml-1">
                  Acc No ({selectedBank.length} Digits)
                </label>
                <input 
                  name="accountNumber" 
                  defaultValue={state?.inputs?.accountNumber}
                  onChange={(e) => validateLength(e.target.value)}
                  type="text" 
                  className={`w-full p-2.5 bg-slate-50 border ${accountError ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xs`}
                  placeholder={`${selectedBank.length} digits...`}
                />
              </div>
            </div>
            {accountError && <p className="text-red-500 text-[8px] font-bold animate-pulse uppercase tracking-tighter">⚠️ {accountError}</p>}
          </div>

          {/* Section 3: Location */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest border-b border-emerald-50 pb-1">3. Business Location</p>
            <div className="grid grid-cols-3 gap-2">
              <select name="province" onChange={(e) => {setProvince(e.target.value); setDistrict('');}} className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[9px] outline-none">
                <option value="">Province</option>
                {Object.keys(PAKISTAN_DATA).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select name="district" disabled={!province} onChange={(e) => setDistrict(e.target.value)} className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[9px] outline-none disabled:opacity-50">
                <option value="">District</option>
                {province && Object.keys(PAKISTAN_DATA[province]).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select name="tehsil" disabled={!district} className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[9px] outline-none disabled:opacity-50">
                <option value="">Tehsil</option>
                {district && PAKISTAN_DATA[province][district].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {state?.error && <div className="p-2.5 bg-red-50 text-red-600 text-[9px] font-bold rounded-xl border border-red-100 uppercase">⚠️ {state.error}</div>}

          <button 
            type="submit" 
            disabled={!!accountError}
            className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-xl shadow-lg hover:bg-emerald-500 transition-all uppercase tracking-widest text-[10px] border-b-4 border-emerald-800 active:translate-y-1 active:border-b-0 disabled:opacity-50"
          >
            Verify & Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}