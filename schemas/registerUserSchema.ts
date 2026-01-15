import { z } from "zod";

/* ===========================
   Reusable Field Rules
=========================== */

const nameRule = z
  .string()
  .nonempty("Full name is required")
  .min(2, "Full name must be at least 2 characters");

const emailRule = z
  .string()
  .nonempty("Email is required")
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Please enter a valid email address",
  });

const passwordRule = z
  .string()
  .nonempty("Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/* ===========================
   Frontend Form Schema
=========================== */

export const registerFormSchema = z
  .object({
    name: nameRule,
    email: emailRule,
    password: passwordRule,
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

/* ===========================
   Backend Schema
=========================== */

export const registerBackendSchema = z.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
  role: z.string().optional(),
});

export type RegisterBackendData = z.infer<typeof registerBackendSchema>;
