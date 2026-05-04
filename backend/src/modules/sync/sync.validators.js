import { z } from 'zod';

const syncItem = z.object({
  operation: z.enum([
    'create_admission',
    'create_clinical_snapshot',
    'create_abg_test',
    'create_ventilator_setting',
    'create_airway_device',
    'create_humidification',
    'create_daily_review',
    'create_outcome',
  ]),
  facilityId: z.string().min(1).optional(),
  admissionId: z.string().min(1).optional(),
  payload: z.record(z.string(), z.unknown()),
  idempotencyKey: z.string().trim().min(8).max(160),
  clientRecordId: z.string().trim().max(120).optional(),
  clientCreatedAt: z.coerce.date().optional(),
  clientUpdatedAt: z.coerce.date().optional(),
  deviceId: z.string().trim().max(120).optional(),
});

export const syncQueueSchema = z.object({
  body: z.object({
    items: z.array(syncItem).min(1).max(50),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
