// lib/validations/worker.js
import { z } from "zod";

// 1. National City List (Fixed Enums for Integrity)
export const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Mianwali"
];

// 2. Allowed Skills List
export const ALLOWED_SKILLS = [
  "Electrician", "Plumber", "Mason", "Carpenter", "Painter",
  "AC Technician", "Welder", "Domestic Helper", "Driver", "Gardener"
];

// 3. The Worker Profile Schema
export const WorkerProfileSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters").max(50),

  city: z.enum(PAKISTAN_CITIES, {
    errorMap: () => ({ message: "Please select a valid city from the list." }),
  }),

  // Phone: Must be a valid Pakistani mobile number (03XXXXXXXXX)
  phoneNumber: z.string().regex(/^03\d{9}$/, "Invalid Phone Number format (e.g., 03001234567)"),

  // Skills: Must be an array of valid skills, at least 1 selected
  skills: z.array(z.enum(ALLOWED_SKILLS))
    .min(1, "You must select at least one skill.")
    .max(5, "You can select up to 5 skills."),

  // CNIC: For the MVP, this will hold the path to the uploaded image
  cnicUrl: z.string().min(1, "CNIC image is required for verification."),
});