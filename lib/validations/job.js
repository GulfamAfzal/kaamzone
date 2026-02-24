import { z } from "zod";

export const JobPostSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters.")
    .max(80, "Title is too long."),
  category: z.enum([
    "Construction", "Electrical", "Plumbing", "Cleaning",
    "Driving", "Cooking", "Gardening", "Moving", "Other"
  ]),
  province: z.string().min(1, "Province is required."),
  district: z.string().min(1, "District is required."),
  tehsil: z.string().min(1, "Tehsil is required."),
  
  // New Fields for Shift and Salary
  workHours: z.coerce.number().min(1, "Minimum 1 hour.").max(24, "Max 24 hours."),
  startTime: z.string().min(1, "Start time is required."),
  totalDays: z.coerce.number().min(1, "Minimum 1 day."),
  salaryPerDay: z.coerce.number().min(500, "Minimum daily salary is 500 PKR."),

  budget: z.coerce.number().min(500, "Minimum budget is 500 PKR."),
  urgency: z.enum(["Standard", "Urgent"]),
  description: z.string()
    .min(20, "Please provide more details.")
    .max(1000, "Description is too long."),
});