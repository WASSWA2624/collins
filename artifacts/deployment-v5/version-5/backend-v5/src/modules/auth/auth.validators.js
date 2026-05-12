import { z } from 'zod';

const email = z.string().trim().toLowerCase().email();
const password = z.string().min(8).max(128);
const activeFacilityFields = {
  activeFacilityId: z.string().min(1).optional(),
  facilityId: z.string().min(1).optional(),
};

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email,
    phone: z.string().trim().max(40).optional(),
    password,
  }).strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1).max(128),
    ...activeFacilityFields,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20).max(500),
    ...activeFacilityFields,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20).max(500).optional(),
  }).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const emptySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
