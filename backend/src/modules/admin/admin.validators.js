import { z } from 'zod';
import {
  DASHBOARD_WINDOW_DEFAULT_DAYS,
  DASHBOARD_WINDOW_MAX_DAYS,
} from '../dashboards/dashboards.constants.js';

const jsonObject = z.record(z.string(), z.unknown());

const patientPathway = z.enum([
  'NEONATE',
  'INFANT',
  'CHILD',
  'ADOLESCENT',
  'ADULT',
  'OBSTETRIC',
  'BURNS',
  'TRAUMA',
  'PERI_OPERATIVE',
  'MEDICAL',
  'SURGICAL',
  'UNKNOWN',
  'OTHER',
]);

const referenceVerificationStatus = z.enum([
  'DRAFT',
  'PENDING_REVIEW',
  'VERIFIED',
  'CORRECTION_REQUESTED',
  'REJECTED',
  'RETIRED',
]);

export const dashboardSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    days: z.coerce.number()
      .int()
      .positive()
      .max(DASHBOARD_WINDOW_MAX_DAYS)
      .default(DASHBOARD_WINDOW_DEFAULT_DAYS),
  }).optional(),
});

export const auditLogSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    action: z.string().trim().max(120).optional(),
    entityType: z.string().trim().max(120).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const referenceListSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    verificationStatus: referenceVerificationStatus.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const createReferenceSchema = z.object({
  body: z.object({
    facilityId: z.string().min(1).optional(),
    name: z.string().trim().min(2).max(160),
    version: z.string().trim().min(1).max(80),
    clinicalCondition: z.string().trim().min(2).max(160),
    scenario: z.string().trim().min(2).max(160).optional(),
    patientPathway,
    population: z.string().trim().min(2).max(120),
    scope: z.enum(['GLOBAL', 'FACILITY']).default('GLOBAL'),
    parameterName: z.string().trim().min(1).max(120),
    lowerBound: z.coerce.number().finite().optional(),
    upperBound: z.coerce.number().finite().optional(),
    unit: z.string().trim().min(1).max(80),
    sourceCitation: z.string().trim().min(3).max(2000),
    ruleJson: jsonObject.default({}),
    activeFrom: z.coerce.date().optional(),
    activeTo: z.coerce.date().optional(),
    reviewNotes: z.string().trim().max(2000).optional(),
  }).superRefine((value, ctx) => {
    if (value.lowerBound === undefined && value.upperBound === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lowerBound'],
        message: 'At least one range bound is required.',
      });
    }
    if (value.lowerBound !== undefined && value.upperBound !== undefined && value.lowerBound > value.upperBound) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lowerBound'],
        message: 'lowerBound cannot be greater than upperBound.',
      });
    }
    if (value.scope === 'FACILITY' && !value.facilityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['facilityId'],
        message: 'facilityId is required for facility-scoped references.',
      });
    }
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateReferenceSchema = z.object({
  body: z.object({
    facilityId: z.string().min(1).optional(),
    name: z.string().trim().min(2).max(160).optional(),
    version: z.string().trim().min(1).max(80).optional(),
    clinicalCondition: z.string().trim().min(2).max(160).optional(),
    scenario: z.string().trim().min(2).max(160).optional(),
    patientPathway: patientPathway.optional(),
    population: z.string().trim().min(2).max(120).optional(),
    scope: z.enum(['GLOBAL', 'FACILITY']).optional(),
    parameterName: z.string().trim().min(1).max(120).optional(),
    lowerBound: z.coerce.number().finite().optional(),
    upperBound: z.coerce.number().finite().optional(),
    unit: z.string().trim().min(1).max(80).optional(),
    sourceCitation: z.string().trim().min(3).max(2000).optional(),
    ruleJson: jsonObject.optional(),
    activeFrom: z.coerce.date().optional(),
    activeTo: z.coerce.date().optional(),
    reviewNotes: z.string().trim().max(2000).optional(),
  }).superRefine((value, ctx) => {
    if (Object.keys(value).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: 'At least one reference field is required.',
      });
    }
    if (value.lowerBound !== undefined && value.upperBound !== undefined && value.lowerBound > value.upperBound) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lowerBound'],
        message: 'lowerBound cannot be greater than upperBound.',
      });
    }
    if (value.scope === 'FACILITY' && !value.facilityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['facilityId'],
        message: 'facilityId is required for facility-scoped references.',
      });
    }
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const modelActionSchema = z.object({
  body: z.object({
    reason: z.string().trim().max(1000).optional(),
  }).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});
