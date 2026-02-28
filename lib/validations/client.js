import { z } from "zod";

export const ClientProfileSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  cnicNumber: z.string().length(13, "CNIC must be exactly 13 digits."),
  phoneNumber: z.string().min(11, "Valid phone number required."),
  // --- ADD THESE TWO LINES ---
  paymentType: z.string().min(1, "Payment type is required."),
  accountNumber: z.string().min(6, "Valid account number required."),
  // ---------------------------
  province: z.string().min(1, "Province is required."),
  district: z.string().min(1, "District is required."),
  tehsil: z.string().min(1, "Tehsil is required."),
});