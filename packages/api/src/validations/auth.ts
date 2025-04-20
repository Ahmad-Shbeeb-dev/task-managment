import { z } from "zod";

import type { UserRole } from "@acme/db";

export const authValidation = z.object({
  email: z.string().toLowerCase().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(4, "Password must be at least 4 charecters."),
  name: z.string().min(1, "Name can't be empty"),
  role: z.custom<UserRole>((data) => !!data, "Required").default("USER"),
  createdBy: z.string().optional(),
});

export const updateUserValidation = z.object({
  email: authValidation.shape.email.optional(),
});

export const registerUserValidation = authValidation
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const loginUserValidation = authValidation.pick({
  email: true,
  password: true,
});

export const checkEmailValidation = z.object({
  email: authValidation.shape.email,
});

export const resetPasswordCodeValidation = z.object({
  code: z
    .string()
    .min(10, "Verification code must be 10 characters long")
    .max(10, "Verification code must be 10 characters long"),
});

export const resetPasswordValidation = resetPasswordCodeValidation
  .extend({
    password: authValidation.shape.password,
    confirmPassword: authValidation.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
