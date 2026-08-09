import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Self-registration is Patient-only. Clinic accounts are created by
// Admin/Super Admin; see the app's "contact us" flow for onboarding.
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;
