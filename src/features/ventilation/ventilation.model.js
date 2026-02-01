/**
 * Ventilation Dataset Model
 * Validates + normalizes the offline ventilation dataset contract.
 * File: ventilation.model.js
 */
import { z } from 'zod';
import ventilationDatasetJson from '@config/data/ventilation_dataset.json';
 
const REQUIRED_UNIT_KEYS = Object.freeze([
  'spo2',
  'pao2',
  'paco2',
  'ph',
  'respiratoryRate',
  'heartRate',
  'bloodPressure',
  'fio2',
  'peep',
  'tidalVolume',
  'ieRatio',
]);
 
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
 
const unitsSchema = z
  .object({
    spo2: z.string().min(1),
    pao2: z.string().min(1),
    paco2: z.string().min(1),
    ph: z.string().min(1),
    respiratoryRate: z.string().min(1),
    heartRate: z.string().min(1),
    bloodPressure: z.string().min(1),
    fio2: z.string().min(1),
    peep: z.string().min(1),
    tidalVolume: z.string().min(1),
    ieRatio: z.string().min(1),
  })
  .passthrough();
 
const observationModelSchema = z
  .object({
    observations: z.string().min(1),
    timeSeries: z.string().min(1),
    observationShape: z
      .object({
        codeSystem: z.string().min(1),
        code: z.string().min(1),
        name: z.string().min(1),
        value: z.string().min(1),
        unit: z.string().min(1),
        timestamp: z.string().min(1),
        method: z.string().min(1),
        source: z.string().min(1),
        referenceRange: z
          .object({
            low: z.string().min(1),
            high: z.string().min(1),
            text: z.string().min(1),
          })
          .passthrough(),
      })
      .passthrough(),
    timeSeriesShape: z
      .object({
        name: z.string().min(1),
        unit: z.string().min(1),
        points: z
          .array(
            z
              .object({
                timestamp: z.string().min(1),
                value: z.string().min(1),
              })
              .passthrough()
          )
          .min(1),
      })
      .passthrough(),
  })
  .passthrough();
 
const datasetSchemaSchema = z
  .object({
    notes: z.string().optional(),
    units: unitsSchema,
    observationModel: observationModelSchema,
  })
  .passthrough();
 
const intendedUseSchema = z
  .object({
    clinicalUse: z.literal(false),
    warning: z.string().min(1),
    validationRequirement: z.string().min(1),
  })
  .passthrough();
 
const sourceSchema = z
  .object({
    id: z.string().min(1),
    type: z.string().min(1),
    citation: z.string().min(1),
    doi: z.string().min(1).optional(),
  })
  .passthrough();
 
const evidenceSchema = z
  .object({
    sourceIds: z.array(z.string().min(1)).default([]),
    notes: z.string().min(1).nullable().optional().default(null),
  })
  .passthrough();
 
const reviewSchema = z
  .object({
    status: z.string().min(1),
    reviewedByRole: z.string().min(1).nullable().optional().default(null),
    reviewedAt: z.string().min(1).nullable().optional().default(null),
  })
  .passthrough();
 
const caseSchema = z
  .object({
    caseId: z.string().min(1),
    evidence: evidenceSchema.optional(),
    review: reviewSchema.optional(),
  })
  .passthrough()
  .transform((value) => {
    const evidence = evidenceSchema.parse(value.evidence ?? {});
    const review = reviewSchema.parse(
      value.review ?? {
        status: 'unvalidated',
        reviewedByRole: null,
        reviewedAt: null,
      }
    );
 
    return { ...value, evidence, review };
  });
 
const ventilationDatasetSchema = z
  .object({
    datasetVersion: z.string().min(1),
    datasetSchemaVersion: z.string().min(1),
    lastUpdated: isoDateSchema,
    totalCases: z.number().int().nonnegative(),
    schema: datasetSchemaSchema,
    intendedUse: intendedUseSchema,
    sources: z.array(sourceSchema).default([]),
    cases: z.array(caseSchema).default([]),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (value.totalCases !== value.cases.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'totalCases_mismatch',
        path: ['totalCases'],
      });
    }
  });
 
const parseVentilationDataset = (value) => ventilationDatasetSchema.parse(value ?? {});
const safeParseVentilationDataset = (value) => ventilationDatasetSchema.safeParse(value ?? {});
 
let cachedDefaultDataset = null;
const getDefaultVentilationDataset = () => {
  if (cachedDefaultDataset) return cachedDefaultDataset;
  cachedDefaultDataset = parseVentilationDataset(ventilationDatasetJson);
  return cachedDefaultDataset;
};
 
const normalizeVentilationConditionKey = (condition) => {
  if (typeof condition !== 'string') return null;
  const trimmed = condition.trim();
  if (!trimmed) return null;
  return trimmed.toLowerCase();
};

const buildVentilationCaseIndex = (datasetOrCases) => {
  const cases = Array.isArray(datasetOrCases?.cases) ? datasetOrCases.cases : datasetOrCases;
  if (!Array.isArray(cases)) {
    throw new Error('cases_required');
  }

  const all = cases.map((_, idx) => idx);
  const byCondition = {};

  cases.forEach((caseItem, idx) => {
    const key = normalizeVentilationConditionKey(caseItem?.patientProfile?.condition);
    if (!key) return;
    if (!byCondition[key]) byCondition[key] = [];
    byCondition[key].push(idx);
  });

  const compareByCaseId = (aIdx, bIdx) => {
    const a = cases[aIdx]?.caseId ?? '';
    const b = cases[bIdx]?.caseId ?? '';
    return String(a).localeCompare(String(b));
  };

  all.sort(compareByCaseId);
  Object.keys(byCondition).forEach((key) => {
    byCondition[key].sort(compareByCaseId);
  });

  return Object.freeze({
    all: Object.freeze([...all]),
    byCondition: Object.freeze({ ...byCondition }),
  });
};

const getVentilationCandidateCaseIndexes = ({ index, condition }) => {
  if (!index || !Array.isArray(index.all)) return [];

  const key = normalizeVentilationConditionKey(condition);
  const conditioned = key ? index.byCondition?.[key] : null;

  if (Array.isArray(conditioned) && conditioned.length > 0) return conditioned;
  return index.all;
};

const getVentilationCandidateCases = ({ dataset, index, condition }) => {
  const cases = Array.isArray(dataset?.cases) ? dataset.cases : [];
  const indexes = getVentilationCandidateCaseIndexes({ index, condition });
  return indexes.map((idx) => cases[idx]).filter(Boolean);
};

let cachedDefaultCaseIndex = null;
const getDefaultVentilationCaseIndex = () => {
  if (cachedDefaultCaseIndex) return cachedDefaultCaseIndex;
  cachedDefaultCaseIndex = buildVentilationCaseIndex(getDefaultVentilationDataset());
  return cachedDefaultCaseIndex;
};

const getVentilationDatasetMeta = (dataset = getDefaultVentilationDataset()) => {
  return {
    version: dataset.datasetVersion,
    lastUpdated: dataset.lastUpdated,
    totalCases: dataset.totalCases,
  };
};
 
const getVentilationDatasetIntendedUse = (dataset = getDefaultVentilationDataset()) => {
  return {
    warning: dataset.intendedUse.warning,
    validationRequirement: dataset.intendedUse.validationRequirement,
  };
};
 
const getVentilationDatasetSources = (dataset = getDefaultVentilationDataset()) => dataset.sources;
 
const getVentilationUnits = (dataset = getDefaultVentilationDataset()) => dataset.schema.units;
 
const getVentilationCaseCitations = (caseItem, dataset = getDefaultVentilationDataset()) => {
  const sourceIds = caseItem?.evidence?.sourceIds;
  if (!Array.isArray(sourceIds) || sourceIds.length === 0) return [];
 
  const sources = Array.isArray(dataset?.sources) ? dataset.sources : [];
  const byId = new Map(sources.map((s) => [s.id, s]));
  return sourceIds.map((id) => byId.get(id)).filter(Boolean);
};
 
const getVentilationCaseReviewStatus = (caseItem) => {
  return caseItem?.review?.status || 'unvalidated';
};
 
export {
  REQUIRED_UNIT_KEYS,
  parseVentilationDataset,
  safeParseVentilationDataset,
  getDefaultVentilationDataset,
  normalizeVentilationConditionKey,
  buildVentilationCaseIndex,
  getVentilationCandidateCaseIndexes,
  getVentilationCandidateCases,
  getDefaultVentilationCaseIndex,
  getVentilationDatasetMeta,
  getVentilationDatasetIntendedUse,
  getVentilationDatasetSources,
  getVentilationUnits,
  getVentilationCaseCitations,
  getVentilationCaseReviewStatus,
};
