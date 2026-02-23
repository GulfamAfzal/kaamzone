// lib/actions/worker-actions.js
"use server";

import { auth } from "../../auth.js"; 
import { db } from "../db.js";
import { WorkerProfileSchema } from "../validations/worker.js";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function updateWorkerProfile(prevState, formData) {
  const session = await auth();
  
  // 1. Check if user is actually logged in
  if (!session || !session.user?.id) {
    return { error: "Authentication Error: Please log out and log back in." };
  }

  const frontFile = formData.get("cnicFront");
  const backFile = formData.get("cnicBack");
  
  if (!frontFile || frontFile.size === 0 || !backFile || backFile.size === 0) {
    return { error: "Both sides of the CNIC are required." };
  }

  try {
    // 2. Build the absolute path clearly
    const rootDir = "C:\\Users\\Sundas\\Desktop\\Kamzone\\kaamzone\\secure_uploads";
    const workerDir = join(rootDir, session.user.id);

    // 3. Create the directory with absolute permissions
    await mkdir(workerDir, { recursive: true });

    // 4. Save the files
    const frontBuffer = Buffer.from(await frontFile.arrayBuffer());
    const frontPath = join(workerDir, "front.jpg");
    await writeFile(frontPath, frontBuffer);

    const backBuffer = Buffer.from(await backFile.arrayBuffer());
    const backPath = join(workerDir, "back.jpg");
    await writeFile(backPath, backBuffer);

    const securePaths = JSON.stringify({ front: frontPath, back: backPath });

    // 5. Validation and Database Sync
    const rawData = {
      fullName: formData.get("fullName"),
      city: formData.get("city"),
      phoneNumber: formData.get("phoneNumber"),
      skills: formData.getAll("skills"), 
      cnicUrl: securePaths, 
    };

    const validatedFields = WorkerProfileSchema.safeParse(rawData);
    if (!validatedFields.success) return { error: "Validation Failed" };

    await db.workerProfile.upsert({
      where: { userId: session.user.id },
      update: {
        fullName: validatedFields.data.fullName,
        city: validatedFields.data.city,
        phoneNumber: validatedFields.data.phoneNumber,
        skills: validatedFields.data.skills,
        cnicEncrypted: securePaths,
        isVerified: false, 
      },
      create: {
        userId: session.user.id,
        fullName: validatedFields.data.fullName,
        city: validatedFields.data.city,
        phoneNumber: validatedFields.data.phoneNumber,
        skills: validatedFields.data.skills,
        cnicEncrypted: securePaths,
        isVerified: false, 
      },
    });

    revalidatePath("/dashboard/worker");
    return { success: "Success! Profile submitted for verification." };

  } catch (error) {
    // Print the EXACT Windows error to your VS Code terminal
    console.error("CRITICAL SYSTEM ERROR:", error.code, error.message);
    return { error: `System Error: ${error.code || 'Upload Failed'}. Check terminal.` };
  }
}