// app/dashboard/worker/profile/page.js
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateWorkerProfile } from '../../../../lib/actions/worker-actions.js';
import Link from 'next/link';

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Mianwali"];
const SKILLS = ["Electrician", "Plumber", "Mason", "Carpenter", "Painter", "AC Technician", "Welder", "Domestic Helper", "Driver", "Gardener"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-emerald-600 text-white font-bold py-3 mt-8 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
      {pending ? 'Uploading Documents...' : 'Submit Profile for Verification'}
    </button>
  );
}

export default function WorkerProfilePage() {
  const [state, dispatch] = useActionState(updateWorkerProfile, undefined);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 border-t-4 border-emerald-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Setup Your Worker Profile</h1>
          <Link href="/dashboard/worker" className="text-sm text-slate-50">&larr; Back</Link>
        </div>

        {state?.error && <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">{state.error}</div>}
        {state?.success && <div className="bg-emerald-100 text-emerald-800 p-4 rounded-lg mb-6">{state.success}</div>}

        <form action={dispatch} className="space-y-5">
          <input type="text" name="fullName" placeholder="Full Name" required className="w-full border p-2.5 rounded-lg" />
          
          <div className="grid grid-cols-2 gap-4">
            <select name="city" className="border p-2.5 rounded-lg">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" name="phoneNumber" placeholder="03XXXXXXXXX" required className="border p-2.5 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {SKILLS.map(s => (
              <label key={s} className="flex items-center space-x-2 text-sm bg-slate-50 p-2 rounded">
                <input type="checkbox" name="skills" value={s} />
                <span>{s}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border-2 border-dashed">
            <div>
              <label className="block text-xs font-bold mb-1">CNIC FRONT</label>
              <input type="file" name="cnicFront" accept="image/*" required className="text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">CNIC BACK</label>
              <input type="file" name="cnicBack" accept="image/*" required className="text-xs" />
            </div>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}