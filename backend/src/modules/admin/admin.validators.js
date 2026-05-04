import { z } from 'zod';

const jsonObject = z.record(z.string(), z.unknown());

export const dashboardSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({ facilityId: z.string().min(1).optional() }).optional(),
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

export const createReferenceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(160),
    version: z.string().trim().min(1).max(80),
    sourceCitation: z.string().trim().max(2000).optional(),
    ruleJson: jsonObject,
    activeFrom: z.coerce.date().optional(),
    activeTo: z.coerce.date().optional(),
    governanceStatus: z.string().trim().max(80).default('approved'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const modelActionSchema = z.object({
  body: z.object({
    reason: z.string().trim().max(1000).optional(),
  }).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});
