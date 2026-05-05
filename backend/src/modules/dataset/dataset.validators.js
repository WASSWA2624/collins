import { z } from 'zod';
import {
  UNSAFE_DATASET_SOURCE_TYPE_MESSAGE,
  UNSAFE_DATASET_SOURCE_TYPE_PATTERN,
} from './dataset.constants.js';

const jsonObject = z.record(z.string(), z.unknown());
const idParam = z.object({ id: z.string().min(1) });
const offlineMetadataSchema = {
  idempotencyKey: z.string().trim().min(8).max(160).optional(),
  clientRecordId: z.string().trim().max(120).optional(),
  clientCreatedAt: z.coerce.date().optional(),
  clientUpdatedAt: z.coerce.date().optional(),
  deviceId: z.string().trim().max(120).optional(),
};
const safeSourceType = z.string()
  .trim()
  .min(2)
  .max(120)
  .refine((value) => !UNSAFE_DATASET_SOURCE_TYPE_PATTERN.test(value), {
    message: UNSAFE_DATASET_SOURCE_TYPE_MESSAGE,
  });

export const parseNoteSchema = z.object({
  body: z.object({
    noteText: z.string().trim().min(1).max(10000),
    facilityId: z.string().min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createDatasetImportSchema = z.object({
  body: z.object({
    facilityId: z.string().min(1),
    sourceAdmissionId: z.string().min(1).optional(),
    sourceType: safeSourceType.default('structured_import'),
    structuredPreviewJson: jsonObject,
    governanceJson: jsonObject.optional(),
    ...offlineMetadataSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const pendingDatasetSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const reviewDatasetSchema = z.object({
  body: z.object({
    action: z.enum(['request_correction', 'approve_for_dataset', 'approve_for_training', 'exclude']),
    reviewerComment: z.string().trim().max(2000).optional(),
    correctedPayloadJson: jsonObject.optional(),
    ethicsApprovalId: z.string().trim().max(160).optional(),
    datasetVersion: z.string().trim().max(120).optional(),
    governanceJson: jsonObject.optional(),
    exclusionReason: z.string().trim().max(2000).optional(),
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const approvedDatasetsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    datasetVersion: z.string().trim().max(120).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const exportDatasetSchema = z.object({
  body: z.object({
    reason: z.string().trim().min(5).max(1000),
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const datasetCardSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional(),
});
