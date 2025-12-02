import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email is invalid"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePhoto: z.url().optional().nullable(),
  bio: z.string().optional().nullable(),
  DOB: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Invalid DOB format"
  ),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export const loginSchema = z.object({
  email: z.email().optional(),
  username: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).refine(
  (data) => data.email || data.username,
  { message: "Email or Username is required", path: ["email"] }
);
