import { z } from 'zod';

const idParam = z.object({ id: z.string().min(1) });

export const facilitySearchSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    q: z.string().trim().max(120).optional(),
    district: z.string().trim().max(120).optional(),
    region: z.string().trim().max(120).optional(),
    verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const createFacilitySchema = z.object({
  body: z.object({
    registryCode: z.string().trim().max(80).optional(),
    name: z.string().trim().min(2).max(200),
    district: z.string().trim().max(120).optional(),
    region: z.string().trim().max(120).optional(),
    type: z.string().trim().max(120).optional(),
    ownership: z.string().trim().max(120).optional(),
    abgAvailability: z.string().trim().max(120).optional(),
    oxygenProfileJson: z.record(z.string(), z.unknown()).optional(),
    ventilatorProfileJson: z.record(z.string(), z.unknown()).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const facilityIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional(),
});

export const updateEquipmentProfileSchema = z.object({
  body: z.object({
    oxygenProfileJson: z.record(z.string(), z.unknown()).optional(),
    ventilatorProfileJson: z.record(z.string(), z.unknown()).optional(),
    abgAvailability: z.string().trim().max(120).optional(),
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const membershipRequestSchema = z.object({
  body: z.object({
    role: z.enum([
      'FACILITY_ADMIN',
      'CLINICIAN',
      'ICU_NURSE',
      'SPECIALIST_REVIEWER',
      'RESEARCH_GOVERNANCE_OFFICER',
      'READ_ONLY_REVIEWER',
    ]),
  }),
  params: idParam,
  query: z.object({}).optional(),
});
