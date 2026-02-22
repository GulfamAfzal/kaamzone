// lib/actions/worker-actions.js
"use server";

import { auth } from "../../auth.js"; 
import { db } from "../db.js";
import { WorkerProfileSchema } from "../validations/worker.js";
import { revalidatePath } from "next/cache";

export async function updateWorkerProfile(prevState, formData) {
  // 1. Authentication & Role Check (Security Gate)
  const session = await auth();
  if (!session || !session.user || session.user.role !== "WORKER") {
    return { error: "Unauthorized. Access Denied." };
  }

  // 2. Extract Data from the incoming form
  const rawData = {
    fullName: formData.get("fullName"),
    city: formData.get("city"),
    phoneNumber: formData.get("phoneNumber"),
    skills: formData.getAll("skills"), // Captures multiple selected checkboxes
    cnicUrl: formData.get("cnicUrl"), 
  };

  // 3. Pass data through your Zod Firewall
  const validatedFields = WorkerProfileSchema.safeParse(rawData);
  
  if (!validatedFields.success) {
    return {
      error: "Validation Failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { fullName, city, phoneNumber, skills, cnicUrl } = validatedFields.data;

  try {
    // 4. Update or Create Database Record (Upsert)
    await db.workerProfile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        fullName,
        city,
        phoneNumber,
        skills, // Prisma handles JSON arrays automatically!
        cnicEncrypted: cnicUrl, 
        isVerified: false, // If they update their profile, they must be re-verified by admin
      },
      create: {
        userId: session.user.id,
        fullName,
        city,
        phoneNumber,
        skills,
        cnicEncrypted: cnicUrl,
        isVerified: false, 
      },
    });

    // 5. Refresh the dashboard so the new data shows up instantly
    revalidatePath("/dashboard/worker");
    return { success: "Profile updated successfully! Pending Admin Verification." };

  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Database Error: Failed to update profile." };
  }
}