import { z } from 'zod';

const reviewableEntityType = z.enum(['admission', 'abg-test', 'ventilator-setting', 'dataset-case', 'reference-rule']);

export const reviewQueueSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    entityType: reviewableEntityType.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const reviewActionSchema = z.object({
  body: z.object({
    comment: z.string().trim().max(2000).optional(),
    correctionJson: z.record(z.string(), z.unknown()).optional(),
    overrideReason: z.string().trim().max(2000).optional(),
    reason: z.string().trim().max(2000).optional(),
    reviewNotes: z.string().trim().max(2000).optional(),
    returnedToClinician: z.coerce.boolean().optional(),
    triagePriority: z.enum(['urgent', 'routine_review', 'standard', 'deferred']).optional(),
    validationStatus: z.string().trim().max(80).optional(),
  }),
  params: z.object({
    entityType: reviewableEntityType,
    entityId: z.string().min(1),
  }),
  query: z.object({}).optional(),
});
