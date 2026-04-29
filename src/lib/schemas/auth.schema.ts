import { z } from "zod";

/* ---------------- EMAIL ---------------- */
export const emailSchema = z.string().min(1, "Email is required").email("Invalid email");


/* ---------------- PASSWORD ---------------- */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Z]/.test(val), {
    message: "Must contain 1 uppercase letter",
  })
  .refine((val) => /[!@#$%^&*]/.test(val), {
    message: "Must contain 1 special character",
  });


/* ---------------- LOGIN ---------------- */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/* ---------------- SIGNUP ---------------- */
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: emailSchema,
    phoneNumber: z
      .string()
      .min(7, "Phone number is required")
      .max(15, "Phone number is too long")
      .regex(/^[0-9]+$/, "Phone number must contain digits only"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    acceptTerms: z
      .boolean()
      .refine((value) => value, "Please accept Terms & Conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});


/* ---------------- OTP ---------------- */
export const otpSchema = z.object({
  otp: z.string().length(5, "OTP must be 5 digits"),
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