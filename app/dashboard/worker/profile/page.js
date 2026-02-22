// app/dashboard/worker/profile/page.js
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateWorkerProfile } from '../../../../lib/actions/worker-actions.js';
import Link from 'next/link';

// Use the exact same lists from your validation file
const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Mianwali"];
const SKILLS = ["Electrician", "Plumber", "Mason", "Carpenter", "Painter", "AC Technician", "Welder", "Domestic Helper", "Driver", "Gardener"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-emerald-600 text-white font-bold py-3 mt-8 rounded-lg hover:bg-emerald-700 transition duration-200 disabled:opacity-50"
    >
      {pending ? 'Saving Profile...' : 'Submit Profile for Verification'}
    </button>
  );
}

export default function WorkerProfilePage() {
  const [state, dispatch] = useActionState(updateWorkerProfile, undefined);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 border-t-4 border-emerald-500">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Setup Your Worker Profile</h1>
          <Link href="/dashboard/worker" className="text-sm text-slate-500 hover:text-emerald-600">
            &larr; Back
          </Link>
        </div>

        {state?.error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6 text-sm">
            <strong>Error:</strong> {state.error}
          </div>
        )}
        {state?.success && (
          <div className="bg-emerald-100 text-emerald-800 p-4 rounded-lg mb-6 text-sm">
            {state.success}
          </div>
        )}

        <form action={dispatch} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name (As per CNIC)</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              placeholder="e.g., Ali Khan"
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {state?.fieldErrors?.fullName && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.fullName[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <select name="city" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500">
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input 
                type="text" 
                name="phoneNumber" 
                required 
                placeholder="03XXXXXXXXX"
                pattern="03[0-9]{9}"
                title="Must be a valid 11-digit Pakistani number starting with 03"
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {state?.fieldErrors?.phoneNumber && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.phoneNumber[0]}</p>}
            </div>
          </div>

          {/* Skills (Checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Your Skills (Max 5)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SKILLS.map(skill => (
                <label key={skill} className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 cursor-pointer hover:bg-emerald-50">
                  <input 
                    type="checkbox" 
                    name="skills" 
                    value={skill} 
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
            {state?.fieldErrors?.skills && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.skills[0]}</p>}
          </div>

          {/* CNIC Upload (Placeholder for MVP) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CNIC Document Link (For Verification)</label>
            <input 
              type="text" 
              name="cnicUrl" 
              required 
              placeholder="https://secure-storage.com/my-cnic.jpg"
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">In a full production build, this will be a secure file upload button.</p>
            {state?.fieldErrors?.cnicUrl && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.cnicUrl[0]}</p>}
          </div>

          <SubmitButton />
        </form>

      </div>
    </div>
  );
}