/**
 * Auth Rules
 * Validation for auth payloads
 * File: auth.rules.js
 */
import { z } from 'zod';

const phoneSchema = z.string().min(10).regex(/^[0-9]+$/);

const credentialsSchema = z
  .object({
    email: z.string().email().optional(),
    phone: phoneSchema.optional(),
    password: z.string().min(1),
    tenant_id: z.string().uuid().optional(),
    facility_id: z.string().uuid().optional(),
  })
  .refine((value) => Boolean(value.email || value.phone), {
    message: 'identifier_required',
    path: ['email'],
  })
  .passthrough();

const authPayloadSchema = z.object({}).passthrough();

const parseCredentials = (value) => credentialsSchema.parse(value ?? {});
const parseAuthPayload = (value) => authPayloadSchema.parse(value ?? {});

export { parseCredentials, parseAuthPayload };
