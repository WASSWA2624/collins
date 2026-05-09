import { z } from 'zod';

export const homeSummarySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
  }).optional(),
});
