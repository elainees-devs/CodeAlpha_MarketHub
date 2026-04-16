import { z } from "zod";

/**
 * =========================
 * DB Schema (Internal)
 * =========================
 */
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  deleted_at: z.coerce.date().nullable().optional(),
});

/**
 * =========================
 * Create User (Signup)
 * =========================
 */
export const CreateUserSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * =========================
 * Update User
 * =========================
 */
export const UpdateUserSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/**
 * =========================
 * Delete User (Soft Delete)
 * =========================
 */
export const DeleteUserSchema = z.object({
  id: z.number(),
});

/**
 * =========================
 * Safe Response (Public)
 * =========================
 */
export const UserResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.coerce.date(),
});
