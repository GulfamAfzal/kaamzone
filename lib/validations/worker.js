// lib/validations/worker.js
import { z } from "zod";

export const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Mianwali"
];

export const ALLOWED_SKILLS = [
  "Electrician", "Plumber", "Mason", "Carpenter", "Painter",
  "AC Technician", "Welder", "Domestic Helper", "Driver", "Gardener"
];

export const WorkerProfileSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters").max(50),

  city: z.enum(PAKISTAN_CITIES, {
    errorMap: () => ({ message: "Please select a valid city." }),
  }),

  // Phone: Must be 11 digits starting with 03
  phoneNumber: z.string().regex(/^03\d{9}$/, "Invalid Phone Number format"),

  // Skills: Must be an array, 1 to 5 skills
  skills: z.array(z.enum(ALLOWED_SKILLS))
    .min(1, "Select at least one skill.")
    .max(5, "Max 5 skills allowed."),

  // This must be a string to hold the JSON paths we created in the backend
  cnicUrl: z.string().min(1, "CNIC paths are required."),
});