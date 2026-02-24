"use server";

import { auth } from '../../auth.js'; 
import { db } from '../db.js';
import { JobPostSchema } from '../validations/job.js';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(prevState, formData) {
  console.log("--- 🚀 JOB POST ATTEMPT START ---");
  
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    console.log("❌ AUTH ERROR: No valid session found");
    return { error: "You must be logged in to post a job." };
  }

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

  const validatedFields = JobPostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errorLog = validatedFields.error.flatten().fieldErrors;
    console.log("❌ ZOD VALIDATION FAILED:", errorLog);
    return { error: "Please fix the errors in the form.", fieldErrors: errorLog };
  }

  const data = validatedFields.data;

  try {
    const fullLocation = `${data.tehsil}, ${data.district}, ${data.province}`;

    await db.job.create({
      data: {
        clientId: session.user.id,
        title: data.title,
        category: data.category,
        city: fullLocation, 
        budget: data.budget,
        urgency: data.urgency,
        description: `Shift: ${data.workHours}hrs/day at ${data.startTime} for ${data.totalDays} days. Salary: ${data.salaryPerDay}/day. ${data.description}`,
        status: "OPEN", 
      },
    });
    
    revalidatePath("/dashboard/client");
  } catch (error) {
    console.error("🔥 DATABASE CRASH:", error);
    return { error: "Failed to save job. Database error." };
  }

  redirect("/dashboard/client");
}