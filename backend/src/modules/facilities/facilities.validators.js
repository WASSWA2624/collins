import { z } from 'zod';
import { REQUESTABLE_MEMBERSHIP_ROLE_VALUES } from '../../constants/roles.js';

const idParam = z.object({ id: z.string().min(1) });
const jsonObject = z.record(z.string(), z.unknown());
const requestableMembershipRole = z.enum(REQUESTABLE_MEMBERSHIP_ROLE_VALUES);
const facilityVerificationStatus = z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED']);

const facilityDetailsSchema = {
  registryCode: z.string().trim().max(80).nullable().optional(),
  name: z.string().trim().min(2).max(200),
  district: z.string().trim().max(120).nullable().optional(),
  region: z.string().trim().max(120).nullable().optional(),
  type: z.string().trim().max(120).nullable().optional(),
  ownership: z.string().trim().max(120).nullable().optional(),
};

const adminFacilityDetailsSchema = {
  ...facilityDetailsSchema,
  verificationStatus: facilityVerificationStatus.optional(),
};

export const facilitySearchSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    q: z.string().trim().max(120).optional(),
    district: z.string().trim().max(120).optional(),
    region: z.string().trim().max(120).optional(),
    verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(500).default(20),
  }),
});

export const createFacilitySchema = z.object({
  body: z.object({
    ...facilityDetailsSchema,
    abgAvailability: z.string().trim().max(120).optional(),
    oxygenProfileJson: jsonObject.optional(),
    ventilatorProfileJson: jsonObject.optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createAdminFacilitySchema = z.object({
  body: z.object({
    ...adminFacilityDetailsSchema,
    abgAvailability: z.string().trim().max(120).nullable().optional(),
    oxygenProfileJson: jsonObject.nullable().optional(),
    ventilatorProfileJson: jsonObject.nullable().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateFacilitySchema = z.object({
  body: z.object({
    ...adminFacilityDetailsSchema,
    name: adminFacilityDetailsSchema.name.optional(),
    abgAvailability: z.string().trim().max(120).nullable().optional(),
    oxygenProfileJson: jsonObject.nullable().optional(),
    ventilatorProfileJson: jsonObject.nullable().optional(),
  }).superRefine((value, ctx) => {
    if (Object.keys(value).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: 'At least one facility field is required.',
      });
    }
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const facilityIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional(),
});

export const updateEquipmentProfileSchema = z.object({
  body: z.object({
    oxygenProfileJson: jsonObject.optional(),
    ventilatorProfileJson: jsonObject.optional(),
    abgAvailability: z.string().trim().max(120).optional(),
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const membershipRequestSchema = z.object({
  body: z.object({
    role: requestableMembershipRole,
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const updateMembershipSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'SUSPENDED']),
    role: requestableMembershipRole.optional(),
  }),
  params: z.object({ id: z.string().min(1), membershipId: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const verifyFacilitySchema = z.object({
  body: z.object({
    verificationStatus: z.enum(['VERIFIED', 'REJECTED', 'SUSPENDED']),
    reason: z.string().trim().max(1000).optional(),
  }),
  params: idParam,
  query: z.object({}).optional(),
});
