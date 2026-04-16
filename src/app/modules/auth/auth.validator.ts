import { z } from "zod";

const signup = z.object({
  body: z.strictObject({
    name: z.string().trim(),
    email: z.string().email().toLowerCase(),
    phone: z.string().length(10),
    password: z.string().min(8).max(64),
  }),
});

const login = z.object({
  body: z.strictObject({
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(64),
  }),
});

const generateOtp = z.object({
  body: z.strictObject({
    phone: z.string().length(10),
  }),
});

const loginWithOtp = z.object({
  body: z.strictObject({
    phone: z.string().length(10),
    otp: z.string().length(4),
  }),
});

export const authValidator = {
  signup,
  login,
  generateOtp,
  loginWithOtp,
};
