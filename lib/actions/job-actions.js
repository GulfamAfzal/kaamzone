"use server";

import { auth } from '../../auth.js'; 
import { db } from '../db.js';
import { JobPostSchema } from '../validations/job.js';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(prevState, formData) {
  console.log("--- 🚀 JOB POST ATTEMPT START ---");
  
  // 1. Session & Role Validation
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    console.log("❌ AUTH ERROR: No valid session found");
    return { error: "You must be logged in to post a job." };
  }

  // 2. Identity Check: Ensure Client has a profile before posting
  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!clientProfile) {
    console.log("❌ PROFILE ERROR: Client must complete setup first");
    return { error: "Please complete your profile setup before posting jobs." };
  }

  // 3. Extract Raw Data
  const rawData = {
    title: formData.get("title"),
    category: formData.get("category"),
    province: formData.get("province"),
    district: formData.get("district"),
    tehsil: formData.get("tehsil"),
    workHours: formData.get("workHours"),
    startTime: formData.get("startTime"),
    totalDays: formData.get("totalDays"),
    salaryPerDay: formData.get("salaryPerDay"),
    budget: formData.get("budget"),
    urgency: formData.get("urgency"),
    description: formData.get("description"),
  };

  // 4. Zod Validation
  const validatedFields = JobPostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errorLog = validatedFields.error.flatten().fieldErrors;
    console.log("❌ ZOD VALIDATION FAILED:", errorLog);
    return { error: "Please fix the errors in the form.", fieldErrors: errorLog };
  }

  const data = validatedFields.data;

  try {
    // 5. Database Write: Mapping to new structured location columns
    console.log("📡 Writing to MySQL with structured location...");
    await db.job.create({
      data: {
        clientId: session.user.id,
        title: data.title,
        category: data.category,
        
        // Updated: Using separate columns as per your new schema
        province: data.province,
        district: data.district,
        tehsil: data.tehsil,
        
        budget: data.budget,
        urgency: data.urgency,
        
        // Storing shift details within the description for clarity
        description: `Shift: ${data.workHours}hrs/day starting at ${data.startTime} for ${data.totalDays} days. Daily Salary: PKR ${data.salaryPerDay}. Details: ${data.description}`,
        
        status: "OPEN", 
      },
    });
    
    console.log("✨ SUCCESS: Job created successfully");
    revalidatePath("/dashboard/client");
  } catch (error) {
    console.error("🔥 DATABASE CRASH:", error);
    return { error: "Failed to save job. Internal database error." };
  }

  // 6. Navigation
  redirect("/dashboard/client");
}