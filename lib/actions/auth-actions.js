// lib/actions/auth-actions.js
'use server';

import { signIn } from '../../auth.js';
import { AuthError } from 'next-auth';
import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// 1. Zod Schema for Registration (Strict Input Validation)
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['WORKER', 'JOB_PROVIDER']),
});

// 2. Login Action
export async function authenticate(prevState, formData) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// 3. Registration Action
export async function registerUser(formData) {
  // Validate Fields using Zod
  const validatedFields = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields. Failed to Register.' };
  }

  const { email, password, role } = validatedFields.data;

  // Check if User already exists in MySQL
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: 'Email already in use.' };
  }

  // Hash Password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User in DB
  await db.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role,
    },
  });

  return { success: 'User created! Please log in.' };
}