// lib/validations/job.js
import { z } from "zod";

// We define a fixed list of cities to ensure data integrity
export const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Mianwali"
];

export const JobPostSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters (e.g., 'Need Electrician for Wiring')")
    .max(80, "Title is too long."),

  category: z.enum([
    "Construction", "Electrical", "Plumbing", "Cleaning",
    "Driving", "Cooking", "Gardening", "Moving", "Other"
  ], {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),

  city: z.enum(PAKISTAN_CITIES, {
    errorMap: () => ({ message: "Please select a valid city." }),
  }),

  budget: z.coerce.number()
    .min(500, "Minimum budget is 500 PKR.")
    .max(1000000, "For large projects > 10 Lakh, please contact support."),

  urgency: z.enum(["Standard", "Urgent"]),

  description: z.string()
    .min(20, "Please provide more details about the work.")
    .max(1000, "Description is too long."),
});