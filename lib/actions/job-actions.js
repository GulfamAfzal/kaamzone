// lib/actions/job-actions.js
"use server";

import { auth } from '../../auth.js'; 
import { db } from '../db.js';
import { JobPostSchema } from '../validations/job.js';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(prevState, formData) {
  // 1. Security Check: Ensure the user is authenticated
  const session = await auth();
  if (!session || !session.user) {
    return { error: "You must be logged in to post a job." };
  }

  // 2. Data Firewall: Validate all fields using the Zod schema
  const validatedFields = JobPostSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    province: formData.get("province"),
    district: formData.get("district"),
    tehsil: formData.get("tehsil"),
    budget: formData.get("budget"),
    urgency: formData.get("urgency"),
    description: formData.get("description"),
  });

  // If validation fails, return the specific error messages to the UI
  if (!validatedFields.success) {
    return {
      error: "Please fix the errors in the form.",
      fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const data = validatedFields.data;

  try {
    // 3. Location Mapping: Combine hierarchy into the 'city' string
    // This allows your 3-tier UI to work with your current single-column database schema.
    const fullLocation = `${data.tehsil}, ${data.district}, ${data.province}`;

    // 4. Database Write: Save the job to MySQL via Prisma
    await db.job.create({
      data: {
        clientId: session.user.id, // Pulled securely from server-side session
        title: data.title,
        category: data.category,
        city: fullLocation, 
        budget: data.budget,
        urgency: data.urgency,
        description: data.description,
        status: "OPEN", // Default status for new postings
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to save job. Please check your database connection." };
  }

  // 5. Success Flow: Clear the cache and send the user back to their dashboard
  revalidatePath("/dashboard/client");
  redirect("/dashboard/client");
}