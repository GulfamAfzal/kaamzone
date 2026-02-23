import { z } from "zod";

export const JobPostSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters.")
    .max(80, "Title is too long."),
  category: z.enum([
    "Construction", "Electrical", "Plumbing", "Cleaning",
    "Driving", "Cooking", "Gardening", "Moving", "Other"
  ]),
  // Changed to string to support the dynamic hierarchy
  province: z.string().min(1, "Province is required."),
  district: z.string().min(1, "District is required."),
  tehsil: z.string().min(1, "Tehsil is required."),
  
  budget: z.coerce.number()
    .min(500, "Minimum budget is 500 PKR."),
  urgency: z.enum(["Standard", "Urgent"]),
  description: z.string()
    .min(20, "Please provide more details.")
    .max(1000, "Description is too long."),
});