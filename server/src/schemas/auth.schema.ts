import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const ChangePasswordSchema = z.object({
  old_password: z.string().min(8),
  new_password: z.string().min(8),
});

export const verifyTokenSchema = z.object({
  token: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>; 
export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type VerifyTokenInput = z.infer<typeof verifyTokenSchema>;