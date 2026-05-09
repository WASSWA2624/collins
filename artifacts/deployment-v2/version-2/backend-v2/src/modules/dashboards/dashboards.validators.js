import { z } from 'zod';
import { DASHBOARD_WINDOW_DEFAULT_DAYS, DASHBOARD_WINDOW_MAX_DAYS } from './dashboards.constants.js';

const dashboardQuerySchema = z.object({
  facilityId: z.string().min(1).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  days: z.coerce.number()
    .int()
    .positive()
    .max(DASHBOARD_WINDOW_MAX_DAYS)
    .default(DASHBOARD_WINDOW_DEFAULT_DAYS),
});

export const dashboardSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: dashboardQuerySchema,
});
