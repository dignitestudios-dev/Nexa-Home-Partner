import { z } from "zod";

/* ---------------- EMAIL ---------------- */
// schemas.ts
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .min(6, "Please enter a valid email address")
  .max(254, "Please enter a valid email address")
  .email("Please enter a valid email address")
  .refine((email) => !/\s/.test(email), {
    message: "Please enter a valid email address",
  })
  .refine(
    (email) => {
      const domain = email.split("@")[1];
      return !!domain && domain.includes(".");
    },
    {
      message: "Enter a valid domain",
    }
  )
  .transform((email) => email.toLowerCase());
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Z]/.test(val), {
    message: "Must contain at least 1 uppercase letter",
  })
  .refine((val) => /[!@#$%^&*]/.test(val), {
    message: "Must contain at least 1 special character",
  });

/* ---------------- PHONE NUMBER ---------------- */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^\d{10}$/, "Phone number must be 10 digits");
/* ---------------- FULL NAME ---------------- */
export const nameSchema = z
  .string()
  .trim()
  .min(1, "Full name is required")
  .max(30, "Full name cannot exceed 30 characters")
  .regex(
    /^[\p{L}\s'-]+$/u,
    "Full name can only contain letters, spaces, hyphens (-), and apostrophes (')"
  );
/* ---------------- AUTH FLOW (Login Page) ---------------- */
export const authFlowSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema.optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword && data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type AuthFlowData = z.infer<typeof authFlowSchema>;

/* ---------------- LOGIN ---------------- */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/* ---------------- SIGNUP ---------------- */
export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().optional(),
    acceptTerms: z
      .boolean()
      .refine((value) => value, "Please accept Terms & Conditions"),
  })
  .refine(
    (data) => {
      if (data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/* ---------------- OTP ---------------- */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(5, "OTP must be exactly 5 digits")
    .regex(/^\d+$/, "Only numbers are allowed"),
});

/* ---------------- RESET PASSWORD ---------------- */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ---------------- COMPLETE PROFILE ---------------- */
export const completeProfileSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneSchema,
  profilePicture: z.any().refine(
    (file) =>
      file instanceof File ||
      (typeof window !== "undefined" &&
        file instanceof FileList &&
        file.length > 0),
    {
      message: "Profile picture is required",
    }
  ),
});