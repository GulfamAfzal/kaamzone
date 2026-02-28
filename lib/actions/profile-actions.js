"use server";

import { auth } from '../../auth.js';
import { db } from '../db.js';
import { ClientProfileSchema } from '../validations/client.js'; 
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createClientProfile(prevState, formData) {
  console.log("--- 🚀 START: createClientProfile Action ---");

  // 1. Authentication Check
  const session = await auth();
  if (!session || !session.user) {
    console.log("❌ AUTH ERROR: No valid session found");
    return { error: "Unauthorized access." };
  }

  // 2. Extract and Debug FormData
  // We manually pull 'accountNumber' to ensure it's not null
  const accountNumber = formData.get("accountNumber");
  const paymentType = formData.get("paymentType");

  const rawData = {
    fullName: formData.get("fullName"),
    cnicNumber: formData.get("cnicNumber"),
    // If your schema uses phoneNumber, ensure we provide one
    phoneNumber: formData.get("phoneNumber") || accountNumber, 
    paymentType: paymentType, 
    accountNumber: accountNumber,
    province: formData.get("province"),
    district: formData.get("district"),
    tehsil: formData.get("tehsil"),
  };

  console.log("📡 DATA RECEIVED AT SERVER:", rawData);

  // 3. Mandatory Field Check (Prevent Null Constraint Violation)
  if (!rawData.accountNumber || rawData.accountNumber === "") {
    console.log("❌ CRITICAL ERROR: accountNumber is NULL or Empty");
    return { 
      error: "Account Number is mandatory for identity verification.", 
      inputs: rawData 
    };
  }

  // 4. One-Time Entry Check
  try {
    const existingProfile = await db.clientProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (existingProfile) {
      console.log("❌ PROFILE ERROR: User already has a profile");
      return { error: "Profile already exists.", inputs: rawData };
    }
  } catch (e) {
    console.error("🔥 DATABASE PRE-CHECK CRASH:", e.message);
    return { error: "Service temporarily unavailable.", inputs: rawData };
  }

  // 5. Zod Validation
  const validated = ClientProfileSchema.safeParse(rawData);
  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors;
    console.log("❌ VALIDATION FAILED:", errors);
    return { fieldErrors: errors, inputs: rawData };
  }

  // 6. Database Write
  try {
    console.log("💾 ATTEMPTING DB WRITE...");
    await db.clientProfile.create({
      data: {
        userId: session.user.id,
        fullName: validated.data.fullName,
        cnicNumber: validated.data.cnicNumber,
        phoneNumber: validated.data.phoneNumber,
        paymentType: validated.data.paymentType,
        accountNumber: validated.data.accountNumber,
        province: validated.data.province,
        district: validated.data.district,
        tehsil: validated.data.tehsil,
        isVerified: false,
      },
    });
    console.log("✅ DB WRITE SUCCESS");
    revalidatePath('/dashboard/client');
  } catch (error) {
    console.error("🔥 PRISMA CREATE ERROR:", error.message);
    return { 
      error: "Database error. Ensure CNIC is unique.", 
      inputs: rawData 
    };
  }

  // 7. Success Redirect (Must be outside try-catch)
  console.log("↪️ REDIRECTING...");
  redirect('/dashboard/client');
}