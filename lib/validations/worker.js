import { z } from "zod";

export const WorkerProfileSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  phoneNumber: z.string().regex(/^03\d{9}$/, "Invalid format. Use 03XXXXXXXXX"),
  
  // Mandatory 13-digit CNIC Number
  cnicNumber: z.string().regex(/^\d{13}$/, "CNIC must be exactly 13 digits without dashes."),
  
  // Geography
  province: z.string().min(1, "Required"),
  district: z.string().min(1, "Required"),
  tehsil: z.string().min(1, "Required"),
  
  // Expertise
  skills: z.array(z.string()).min(1, "Select at least one skill."),
  
  // Banking Validation
  paymentType: z.enum(["JazzCash", "EasyPaisa", "UPaisa", "Bank"]),
  accountNumber: z.string().superRefine((val, ctx) => {
    // Check if it's a mobile wallet (11 digits)
    if (["JazzCash", "EasyPaisa", "UPaisa"].includes(ctx?.parent?.paymentType)) {
       if (!/^03\d{9}$/.test(val)) {
         ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Wallet must be 11 digits starting with 03" });
       }
    } 
    // Check if it's a bank account (usually IBAN is longer)
    if (ctx?.parent?.paymentType === "Bank" && val.length < 10) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid Bank Account or IBAN" });
    }
  }),
  
  bio: z.string().min(20, "Bio should be descriptive.").max(500),
});