// lib/actions/auth-actions.js
'use server';

import { signIn } from '../../auth.js';
import { AuthError } from 'next-auth';
import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['WORKER', 'JOB_PROVIDER'], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});

export async function authenticate(prevState, formData) {
  const email = formData.get('email');
  
  try {
    // 1. Perform authentication without automatic server-side redirect
    await signIn('credentials', Object.fromEntries(formData), { redirect: false });
    
    // 2. Query the database to find the user's specific role
    const user = await db.user.findUnique({
      where: { email },
      select: { role: true }
    });

    if (!user) return 'User account not found.';

    // 3. Return a success object with the role to trigger the client-side redirect
    return { success: true, role: user.role };
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.';
        default:
          return 'An authentication error occurred.';
      }
    }
    // Critical: Do not catch Next.js redirect errors if you use server-side redirects
    throw error;
  }
}

// Keep registerUser as it is, ensuring it correctly hashes passwords
export async function registerUser(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');

  const validatedFields = RegisterSchema.safeParse({ email, password, role });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0];
    return { error: firstError || "Invalid input data." };
  }

  const { email: validatedEmail, password: validatedPassword, role: validatedRole } = validatedFields.data;

  try {
    const existingUser = await db.user.findUnique({ where: { email: validatedEmail } });
    if (existingUser) return { error: 'Email already in use.' };

    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    await db.user.create({
      data: {
        email: validatedEmail,
        passwordHash: hashedPassword,
        role: validatedRole,
      },
    });

    return { success: 'Account created! Redirecting to login...' };
  } catch (dbError) {
    return { error: 'Database connection failed.' };
  }
}