/**
 * Home Model
 * Normalizes the backend Home summary contract.
 * File: home.model.js
 */
import { z } from 'zod';

const nullableString = z.string().nullable().optional();
const nullableNumber = z.number().nullable().optional();

const facilitySchema = z.object({
  id: z.string().min(1),
  registryCode: nullableString,
  name: z.string().min(1),
  district: nullableString,
  region: nullableString,
  type: nullableString,
  ownership: nullableString,
  verificationStatus: nullableString,
  abgAvailability: nullableString,
  roles: z.array(z.string()).optional().default([]),
}).passthrough();

const countsSchema = z.object({
  patientActivity: z.object({
    activePatients: z.number().default(0),
    activeAdmissions: z.number().default(0),
  }).default({}),
  drafts: z.object({
    localDrafts: z.number().default(0),
    waitingToSync: z.number().default(0),
  }).default({}),
  sync: z.object({
    waitingToSync: z.number().default(0),
    conflicts: z.number().default(0),
    failedValidation: z.number().default(0),
    needsReview: z.number().default(0),
    failed: z.number().default(0),
    attentionTotal: z.number().default(0),
  }).default({}),
  review: z.object({
    visible: z.boolean().default(false),
    pendingTotal: nullableNumber,
    correctionRequestedTotal: nullableNumber,
    byEntity: z.record(z.string(), z.unknown()).nullable().optional(),
  }).default({}),
  dataset: z.object({
    visible: z.boolean().default(false),
    draft: nullableNumber,
    submitted: nullableNumber,
    needsCorrection: nullableNumber,
    reviewed: nullableNumber,
    approvedForDataset: nullableNumber,
  }).default({}),
}).passthrough();

const noticeSchema = z.object({
  code: z.string().min(1),
  severity: z.string().min(1).default('info'),
  message: z.string().min(1),
  count: z.number().optional(),
}).passthrough();

const navigationSchema = z.object({
  status: z.string().min(1),
  canOpenAdmissions: z.boolean().default(false),
  canCreateAdmission: z.boolean().default(false),
  canOpenReviewQueue: z.boolean().default(false),
  canManageFacility: z.boolean().default(false),
  canResolveSyncConflicts: z.boolean().default(false),
  notices: z.array(noticeSchema).default([]),
  reason: z.string().optional(),
}).passthrough();

const homeSummarySchema = z.object({
  user: z.object({
    id: z.string().min(1),
    activeRole: nullableString,
    availableRoles: z.array(z.string()).default([]),
  }).passthrough(),
  activeFacility: facilitySchema.nullable(),
  availableFacilities: z.array(facilitySchema).default([]),
  counts: countsSchema.nullable(),
  statusSummaries: z.array(z.object({
    code: z.string().min(1),
    status: z.string().min(1),
    label: z.string().min(1),
    count: z.number(),
  }).passthrough()).default([]),
  navigation: navigationSchema,
  privacy: z.string().min(1).optional(),
}).passthrough();

const normalizeHomeSummary = (value) => {
  const parsed = homeSummarySchema.safeParse(value);
  if (!parsed.success) {
    const error = new Error('Invalid Home summary response');
    error.code = 'HOME_SUMMARY_INVALID';
    error.cause = parsed.error;
    throw error;
  }
  return parsed.data;
};

export { homeSummarySchema, normalizeHomeSummary };
