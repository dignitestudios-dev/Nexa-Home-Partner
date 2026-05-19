import { z } from "zod";

/* ---------------- EMAIL ---------------- */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email");

/* ---------------- PASSWORD ---------------- */
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
  .min(9, "Invalid phone number")
  .max(10, "Phone number must be exactly 10 digits")
  .regex(/^\d+$/, "Only numbers are allowed");

/* ---------------- FULL NAME ---------------- */
export const fullNameSchema = z
  .string()


/* ---------------- LOGIN ---------------- */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/* ---------------- SIGNUP ---------------- */
export const signupSchema = z
  .object({
    fullName: fullNameSchema,

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
  fullName: fullNameSchema,

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