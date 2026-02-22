// app/(auth)/login/page.js
'use client';

// 1. Import useActionState from 'react' instead of 'react-dom'
import { useActionState } from 'react';
// 2. useFormStatus stays in 'react-dom'
import { useFormStatus } from 'react-dom';
import { authenticate } from '../../../lib/actions/auth-actions.js';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition duration-200 disabled:opacity-50"
    >
      {pending ? 'Logging in...' : 'Log In'}
    </button>
  );
}

export default function LoginPage() {
  // 3. Change useFormState to useActionState
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Welcome Back</h2>
        
        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form action={dispatch} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <Link href="/register" className="text-emerald-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}