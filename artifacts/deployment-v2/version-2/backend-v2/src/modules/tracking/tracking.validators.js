import { z } from 'zod';

const admissionStatuses = ['ACTIVE', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'CANCELLED', 'ALL'];
const reviewStatuses = ['PENDING', 'APPROVED', 'CORRECTION_REQUESTED', 'EXCLUDED'];
const patientPathways = [
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
];

const idParam = z.object({ id: z.string().min(1) });

export const trackingListSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    status: z.enum(admissionStatuses).default('ACTIVE'),
    reviewStatus: z.enum(reviewStatuses).optional(),
    patientPathway: z.enum(patientPathways).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const trackingIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional(),
});
