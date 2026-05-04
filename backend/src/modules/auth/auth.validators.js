import { z } from 'zod';

const email = z.string().email().trim().toLowerCase();
const password = z.string().min(8).max(128);

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email,
    phone: z.string().trim().max(40).optional(),
    password,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1).max(128),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const emptySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
