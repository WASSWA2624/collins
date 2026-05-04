import { z } from 'zod';

export const reviewQueueSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    entityType: z.enum(['admission', 'abg-test', 'ventilator-setting', 'dataset-case']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const reviewActionSchema = z.object({
  body: z.object({
    comment: z.string().trim().max(2000).optional(),
    correctionJson: z.record(z.string(), z.unknown()).optional(),
    reason: z.string().trim().max(2000).optional(),
  }),
  params: z.object({
    entityType: z.enum(['admission', 'abg-test', 'ventilator-setting', 'dataset-case']),
    entityId: z.string().min(1),
  }),
  query: z.object({}).optional(),
});
