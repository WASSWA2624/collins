/**
 * Ventilation Rules
 * Pure domain checks (no side effects).
 * File: ventilation.rules.js
 */
import {
  REQUIRED_UNIT_KEYS,
  getVentilationCaseCitations,
  getVentilationCaseReviewStatus,
  getVentilationDatasetIntendedUse,
  getVentilationUnits,
  normalizeVentilationConditionKey,
} from './ventilation.model';
 
const assertVentilationUnitsContract = (units) => {
  if (!units || typeof units !== 'object') {
    throw new Error('units_required');
  }
 
  const missing = REQUIRED_UNIT_KEYS.filter((key) => units[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`units_missing:${missing.join(',')}`);
  }
 
  return units;
};
 
const VENTILATION_SIMILARITY_FIELDS = Object.freeze({
  condition: 'condition',
  spo2: 'spo2',
  respiratoryRate: 'respiratoryRate',
  heartRate: 'heartRate',
  pao2: 'pao2',
  paco2: 'paco2',
  ph: 'ph',
});

const VENTILATION_SIMILARITY_REQUIRED_FIELDS = Object.freeze([
  VENTILATION_SIMILARITY_FIELDS.condition,
  VENTILATION_SIMILARITY_FIELDS.spo2,
  VENTILATION_SIMILARITY_FIELDS.respiratoryRate,
  VENTILATION_SIMILARITY_FIELDS.heartRate,
]);

const VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS = Object.freeze([
  VENTILATION_SIMILARITY_FIELDS.pao2,
  VENTILATION_SIMILARITY_FIELDS.paco2,
  VENTILATION_SIMILARITY_FIELDS.ph,
]);

const VENTILATION_VENTILATOR_SETTING_KEYS = Object.freeze([
  'mode',
  'tidalVolume',
  'respiratoryRate',
  'fio2',
  'peep',
  'ieRatio',
]);

/**
 * Domain-owned similarity configuration.
 * - SpO2-first, ABG-optional.
 * - Ranges are clinical plausibility bounds used only for normalization.
 */
const VENTILATION_SIMILARITY_CONFIG = Object.freeze({
  ranges: Object.freeze({
    spo2: Object.freeze({ min: 50, max: 100 }),
    respiratoryRate: Object.freeze({ min: 0, max: 60 }),
    heartRate: Object.freeze({ min: 30, max: 220 }),
    pao2: Object.freeze({ min: 0, max: 200 }),
    paco2: Object.freeze({ min: 10, max: 120 }),
    ph: Object.freeze({ min: 6.8, max: 7.8 }),
  }),
  weights: Object.freeze({
    spo2: 0.45,
    respiratoryRate: 0.2,
    heartRate: 0.2,
    pao2: 0.08,
    paco2: 0.04,
    ph: 0.03,
  }),
  scorePrecision: 1e6,
  topNDefault: 5,
  confidence: Object.freeze({
    high: Object.freeze({ minScore: 0.85, minCompleteness: 0.9 }),
    medium: Object.freeze({ minScore: 0.7, minCompleteness: 0.6 }),
  }),
});

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const roundToPrecision = (value, precision) => {
  if (!isFiniteNumber(value)) return value;
  const p = isFiniteNumber(precision) && precision > 0 ? precision : 1;
  return Math.round(value * p) / p;
};

const asStringArray = (value) => (Array.isArray(value) ? value.filter((v) => typeof v === 'string' && v.trim()) : []);

const mergeUniqueStringsStable = (...lists) => {
  const out = [];
  const seen = new Set();
  lists.forEach((list) => {
    asStringArray(list).forEach((item) => {
      if (seen.has(item)) return;
      seen.add(item);
      out.push(item);
    });
  });
  return Object.freeze([...out]);
};

const pickInitialVentilatorSettingsFromCase = (caseItem) => {
  const fromRecommendations = caseItem?.recommendations?.initialSettings;
  const fromVentilatorSettings = caseItem?.ventilatorSettings;

  const candidate =
    fromRecommendations && typeof fromRecommendations === 'object'
      ? { value: fromRecommendations, source: 'recommendations.initialSettings' }
      : fromVentilatorSettings && typeof fromVentilatorSettings === 'object'
        ? { value: fromVentilatorSettings, source: 'ventilatorSettings' }
        : null;

  if (!candidate) return Object.freeze({ source: null, settings: null });

  const settings = {};
  VENTILATION_VENTILATOR_SETTING_KEYS.forEach((key) => {
    const v = candidate.value?.[key];
    if (v === undefined) return;
    settings[key] = v;
  });

  return Object.freeze({
    source: candidate.source,
    settings: Object.keys(settings).length > 0 ? Object.freeze({ ...settings }) : null,
  });
};

const VENTILATION_ADDITIONAL_TEST_PROMPT_CODES = Object.freeze({
  ABG_PANEL: 'VENTILATION_REQUEST_ABG_PANEL',
  ABG_PAO2: 'VENTILATION_REQUEST_ABG_PAO2',
  ABG_PACO2: 'VENTILATION_REQUEST_ABG_PACO2',
  ABG_PH: 'VENTILATION_REQUEST_ABG_PH',
});

const buildVentilationAdditionalTestPrompts = ({ confidenceTier, missingAbgFields }) => {
  const missing = Array.isArray(missingAbgFields) ? missingAbgFields : [];
  const hasMissingAbg = missing.length > 0;
  const tier = confidenceTier === 'high' || confidenceTier === 'medium' || confidenceTier === 'low' ? confidenceTier : 'low';

  const prompts = [];

  // ABG prompts are primary when confidence is low OR ABG fields are missing.
  if (tier === 'low' || hasMissingAbg) {
    prompts.push(
      Object.freeze({
        code: VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PANEL,
        priority: 'primary',
      })
    );
  }

  const pushIfMissing = (field, code) => {
    if (!missing.includes(field)) return;
    prompts.push(
      Object.freeze({
        code,
        priority: 'primary',
        missingField: field,
      })
    );
  };

  pushIfMissing(VENTILATION_SIMILARITY_FIELDS.pao2, VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PAO2);
  pushIfMissing(VENTILATION_SIMILARITY_FIELDS.paco2, VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PACO2);
  pushIfMissing(VENTILATION_SIMILARITY_FIELDS.ph, VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PH);

  return Object.freeze([...prompts]);
};

const VENTILATION_NEXT_ACTIONS_BY_CONDITION_AND_TIER = Object.freeze({
  ards: Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_ARDS_LUNG_PROTECTIVE', 'VENTILATION_ACTION_MONITOR_PLATEAU_PRESSURE']),
    medium: Object.freeze(['VENTILATION_ACTION_ARDS_LUNG_PROTECTIVE', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_ARDS_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
  asthma: Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_ASTHMA_AVOID_AIR_TRAPPING', 'VENTILATION_ACTION_MONITOR_AUTO_PEEP']),
    medium: Object.freeze(['VENTILATION_ACTION_ASTHMA_AVOID_AIR_TRAPPING', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_ASTHMA_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
  copd: Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_COPD_AVOID_DYNAMIC_HYPERINFLATION', 'VENTILATION_ACTION_MONITOR_CO2_PH']),
    medium: Object.freeze(['VENTILATION_ACTION_COPD_AVOID_DYNAMIC_HYPERINFLATION', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_COPD_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
  'heart failure': Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_HF_OPTIMIZE_OXYGENATION', 'VENTILATION_ACTION_MONITOR_FLUID_STATUS']),
    medium: Object.freeze(['VENTILATION_ACTION_HF_OPTIMIZE_OXYGENATION', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_HF_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
  pneumonia: Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_PNEUMONIA_OPTIMIZE_OXYGENATION', 'VENTILATION_ACTION_MONITOR_SECRETION_LOAD']),
    medium: Object.freeze(['VENTILATION_ACTION_PNEUMONIA_OPTIMIZE_OXYGENATION', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_PNEUMONIA_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
  sepsis: Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_SEPSIS_SUPPORT_OXYGENATION', 'VENTILATION_ACTION_MONITOR_HEMODYNAMICS']),
    medium: Object.freeze(['VENTILATION_ACTION_SEPSIS_SUPPORT_OXYGENATION', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_SEPSIS_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
  trauma: Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_TRAUMA_PROTECT_AIRWAY', 'VENTILATION_ACTION_MONITOR_CHEST_INJURY']),
    medium: Object.freeze(['VENTILATION_ACTION_TRAUMA_PROTECT_AIRWAY', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_TRAUMA_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
  generic: Object.freeze({
    high: Object.freeze(['VENTILATION_ACTION_VERIFY_TUBE_POSITION', 'VENTILATION_ACTION_MONITOR_RESPONSE']),
    medium: Object.freeze(['VENTILATION_ACTION_VERIFY_TUBE_POSITION', 'VENTILATION_ACTION_REQUEST_ABG_IF_AVAILABLE']),
    low: Object.freeze(['VENTILATION_ACTION_ESCALATE_REVIEW', 'VENTILATION_ACTION_REQUEST_ABG_URGENT']),
  }),
});

const getVentilationNextActionsChecklist = ({ condition, confidenceTier }) => {
  const key = normalizeVentilationConditionKey(condition) ?? 'generic';
  const tier = confidenceTier === 'high' || confidenceTier === 'medium' || confidenceTier === 'low' ? confidenceTier : 'low';
  const bucket = VENTILATION_NEXT_ACTIONS_BY_CONDITION_AND_TIER[key] ?? VENTILATION_NEXT_ACTIONS_BY_CONDITION_AND_TIER.generic;
  const actions = bucket?.[tier] ?? VENTILATION_NEXT_ACTIONS_BY_CONDITION_AND_TIER.generic.low;

  return Object.freeze(
    (Array.isArray(actions) ? actions : []).map((code, idx) =>
      Object.freeze({
        code,
        order: idx + 1,
        conditionKey: key,
        confidenceTier: tier,
      })
    )
  );
};

const assembleVentilationRecommendationFromMatches = ({ dataset, rankedMatches, input }) => {
  const matches = Array.isArray(rankedMatches) ? rankedMatches : [];
  const top = matches[0] ?? null;

  const units = getVentilationUnits(dataset);
  assertVentilationUnitsContract(units);

  const intendedUse = getVentilationDatasetIntendedUse(dataset);
  const confidenceTier = top?.confidenceTier ?? 'low';
  const caseIdOrder = Object.freeze(
    matches
      .map((m) => m?.caseId)
      .filter((id) => typeof id === 'string' && id.trim())
  );

  const cases = Array.isArray(dataset?.cases) ? dataset.cases : [];
  const byId = new Map(cases.map((c) => [c?.caseId, c]));
  const matchedCases = caseIdOrder.map((id) => byId.get(id)).filter(Boolean);
  const primaryCase = matchedCases[0] ?? null;

  const initial = pickInitialVentilatorSettingsFromCase(primaryCase);

  const monitoringPoints = mergeUniqueStringsStable(...matchedCases.map((c) => c?.recommendations?.monitoringPoints));
  const riskFactors = mergeUniqueStringsStable(...matchedCases.map((c) => c?.recommendations?.riskFactors));
  const complicationHistory = mergeUniqueStringsStable(...matchedCases.map((c) => c?.outcomes?.complications));

  const missingAbg = getMissingSimilarityFields(input).filter((f) => VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS.includes(f));
  const additionalTestPrompts = buildVentilationAdditionalTestPrompts({ confidenceTier, missingAbgFields: missingAbg });

  const conditionForChecklist = input?.condition ?? primaryCase?.patientProfile?.condition ?? null;
  const nextActions = getVentilationNextActionsChecklist({ condition: conditionForChecklist, confidenceTier });

  const caseEvidence = Object.freeze(
    matchedCases.map((caseItem) => {
      const citations = getVentilationCaseCitations(caseItem, dataset).map((s) =>
        Object.freeze({
          id: s.id,
          type: s.type,
          citation: s.citation,
          doi: s.doi ?? undefined,
        })
      );

      return Object.freeze({
        caseId: caseItem.caseId,
        reviewStatus: getVentilationCaseReviewStatus(caseItem),
        evidenceNotes: caseItem?.evidence?.notes ?? null,
        citations: Object.freeze([...citations]),
      });
    })
  );

  const matched = Object.freeze(
    matches.map((m) =>
      Object.freeze({
        caseId: m?.caseId ?? null,
        score: m?.score ?? null,
        completeness: m?.completeness ?? null,
        confidenceTier: m?.confidenceTier ?? null,
      })
    )
  );

  return Object.freeze({
    source: Object.freeze({
      caseIds: caseIdOrder,
      primaryCaseId: primaryCase?.caseId ?? null,
      confidenceTier,
    }),
    safety: Object.freeze({
      intendedUseWarning: intendedUse.warning,
      validationRequirement: intendedUse.validationRequirement,
    }),
    units: Object.freeze({ ...units }),
    caseEvidence,
    initialVentilatorSettings: Object.freeze({
      source: initial.source,
      settings: initial.settings,
    }),
    monitoringPoints,
    riskFactors,
    complicationHistory,
    additionalTestPrompts,
    nextActions,
    matched,
  });
};

const getMissingSimilarityFields = (input) => {
  const missing = [];

  if (!input || typeof input !== 'object') {
    return [...VENTILATION_SIMILARITY_REQUIRED_FIELDS, ...VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS];
  }

  const condition = input?.condition;
  if (typeof condition !== 'string' || !condition.trim()) missing.push(VENTILATION_SIMILARITY_FIELDS.condition);

  const maybePushIfMissingNumber = (field) => {
    if (!isFiniteNumber(input?.[field])) missing.push(field);
  };

  maybePushIfMissingNumber(VENTILATION_SIMILARITY_FIELDS.spo2);
  maybePushIfMissingNumber(VENTILATION_SIMILARITY_FIELDS.respiratoryRate);
  maybePushIfMissingNumber(VENTILATION_SIMILARITY_FIELDS.heartRate);
  maybePushIfMissingNumber(VENTILATION_SIMILARITY_FIELDS.pao2);
  maybePushIfMissingNumber(VENTILATION_SIMILARITY_FIELDS.paco2);
  maybePushIfMissingNumber(VENTILATION_SIMILARITY_FIELDS.ph);

  return missing;
};

const assertVentilationSimilarityInput = (input) => {
  if (!input || typeof input !== 'object') throw new Error('similarity_input_required');

  const condition = input?.condition;
  if (typeof condition !== 'string' || !condition.trim()) throw new Error('similarity_input_condition_required');

  const requireFiniteNumber = (field) => {
    if (!isFiniteNumber(input?.[field])) throw new Error(`similarity_input_${field}_required`);
  };

  requireFiniteNumber(VENTILATION_SIMILARITY_FIELDS.spo2);
  requireFiniteNumber(VENTILATION_SIMILARITY_FIELDS.respiratoryRate);
  requireFiniteNumber(VENTILATION_SIMILARITY_FIELDS.heartRate);

  return input;
};

const assertVentilationTopN = (topN, fallback = VENTILATION_SIMILARITY_CONFIG.topNDefault) => {
  if (topN === undefined || topN === null) return fallback;
  if (!Number.isInteger(topN) || topN <= 0) throw new Error('similarity_topN_invalid');
  return topN;
};

const getClinicalNumericValue = (caseItem, field) => {
  const value = caseItem?.clinicalParameters?.[field];
  return isFiniteNumber(value) ? value : null;
};

const computeNormalizedDistance = ({ field, inputValue, caseValue, config = VENTILATION_SIMILARITY_CONFIG }) => {
  const range = config?.ranges?.[field];
  if (!range || !isFiniteNumber(range.min) || !isFiniteNumber(range.max) || range.max <= range.min) {
    throw new Error(`similarity_range_invalid:${field}`);
  }

  if (!isFiniteNumber(inputValue) || !isFiniteNumber(caseValue)) return null;

  const width = range.max - range.min;
  const raw = Math.abs(inputValue - caseValue) / width;
  return clamp01(raw);
};

const computeVentilationSimilarityConfidenceTier = ({
  score,
  completeness,
  config = VENTILATION_SIMILARITY_CONFIG,
}) => {
  const high = config?.confidence?.high;
  const medium = config?.confidence?.medium;

  if (
    high &&
    isFiniteNumber(high.minScore) &&
    isFiniteNumber(high.minCompleteness) &&
    score >= high.minScore &&
    completeness >= high.minCompleteness
  ) {
    return 'high';
  }

  if (
    medium &&
    isFiniteNumber(medium.minScore) &&
    isFiniteNumber(medium.minCompleteness) &&
    score >= medium.minScore &&
    completeness >= medium.minCompleteness
  ) {
    return 'medium';
  }

  return 'low';
};

const computeVentilationCaseSimilarity = ({ input, caseItem, config = VENTILATION_SIMILARITY_CONFIG }) => {
  assertVentilationSimilarityInput(input);

  const weights = config?.weights ?? {};
  const fields = [
    VENTILATION_SIMILARITY_FIELDS.spo2,
    VENTILATION_SIMILARITY_FIELDS.respiratoryRate,
    VENTILATION_SIMILARITY_FIELDS.heartRate,
    VENTILATION_SIMILARITY_FIELDS.pao2,
    VENTILATION_SIMILARITY_FIELDS.paco2,
    VENTILATION_SIMILARITY_FIELDS.ph,
  ];

  const comparisons = [];
  const missingFromInput = getMissingSimilarityFields(input).filter((f) => VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS.includes(f));

  const totalWeight = fields.reduce((sum, field) => sum + (isFiniteNumber(weights[field]) ? weights[field] : 0), 0);

  let usedWeight = 0;
  let weightedSimilaritySum = 0;

  fields.forEach((field) => {
    const weight = isFiniteNumber(weights[field]) ? weights[field] : 0;
    const inputValue = input?.[field];
    const caseValue = getClinicalNumericValue(caseItem, field);

    const distance = computeNormalizedDistance({
      field,
      inputValue: isFiniteNumber(inputValue) ? inputValue : null,
      caseValue,
      config,
    });

    const similarity = distance === null ? null : 1 - distance;
    const used = distance !== null && weight > 0;
    const contribution = used ? similarity * weight : null;

    if (used) {
      usedWeight += weight;
      weightedSimilaritySum += contribution;
    }

    comparisons.push(
      Object.freeze({
        field,
        inputValue: isFiniteNumber(inputValue) ? inputValue : null,
        caseValue,
        weight,
        distance,
        similarity,
        contribution,
        used,
      })
    );
  });

  const completeness = totalWeight > 0 ? clamp01(usedWeight / totalWeight) : 0;
  const scoreRaw = usedWeight > 0 ? weightedSimilaritySum / usedWeight : 0;
  const score = roundToPrecision(scoreRaw, config.scorePrecision);

  return Object.freeze({
    caseId: caseItem?.caseId ?? null,
    score,
    completeness: roundToPrecision(completeness, config.scorePrecision),
    confidenceTier: computeVentilationSimilarityConfidenceTier({ score, completeness, config }),
    missingData: Object.freeze({
      missingFromInput: Object.freeze([...missingFromInput]),
    }),
    explanation: Object.freeze({
      weights: Object.freeze({ ...weights }),
      comparisons: Object.freeze([...comparisons]),
    }),
  });
};

const rankVentilationSimilarCases = ({
  input,
  candidateCases,
  topN,
  config = VENTILATION_SIMILARITY_CONFIG,
}) => {
  assertVentilationSimilarityInput(input);
  const n = assertVentilationTopN(topN);

  const cases = Array.isArray(candidateCases) ? candidateCases : [];
  if (cases.length === 0) return [];

  const scored = cases.map((caseItem) => computeVentilationCaseSimilarity({ input, caseItem, config }));

  const compare = (a, b) => {
    // Desc score, then desc completeness, then lexicographic caseId for deterministic stability
    if (b.score !== a.score) return b.score - a.score;
    if (b.completeness !== a.completeness) return b.completeness - a.completeness;
    return String(a.caseId ?? '').localeCompare(String(b.caseId ?? ''));
  };

  scored.sort(compare);
  return scored.slice(0, n);
};

/**
 * Step 10.8: Optional online AI augmentation hook point.
 * Complex case detection is pure + deterministic.
 */
const VENTILATION_COMPLEX_CASE_REASON_CODES = Object.freeze({
  LOW_CONFIDENCE: 'VENTILATION_COMPLEX_CASE_LOW_CONFIDENCE',
  MISSING_KEY_INPUTS: 'VENTILATION_COMPLEX_CASE_MISSING_KEY_INPUTS',
  OUT_OF_DISTRIBUTION: 'VENTILATION_COMPLEX_CASE_OUT_OF_DISTRIBUTION',
});

const VENTILATION_AI_AUGMENTATION_PROVIDER = 'aiSdk';

const computeDatasetRanges = ({ dataset, fields }) => {
  const cases = Array.isArray(dataset?.cases) ? dataset.cases : [];
  const list = Array.isArray(fields) ? fields : [];

  const out = {};
  list.forEach((field) => {
    let min = null;
    let max = null;

    cases.forEach((caseItem) => {
      const value = caseItem?.clinicalParameters?.[field];
      if (!isFiniteNumber(value)) return;
      min = min === null ? value : Math.min(min, value);
      max = max === null ? value : Math.max(max, value);
    });

    if (min === null || max === null) return;
    out[field] = Object.freeze({ min, max });
  });

  return Object.freeze({ ...out });
};

const detectOutOfDistributionFields = ({ input, dataset, config = VENTILATION_SIMILARITY_CONFIG }) => {
  const fields = [
    VENTILATION_SIMILARITY_FIELDS.spo2,
    VENTILATION_SIMILARITY_FIELDS.respiratoryRate,
    VENTILATION_SIMILARITY_FIELDS.heartRate,
    VENTILATION_SIMILARITY_FIELDS.pao2,
    VENTILATION_SIMILARITY_FIELDS.paco2,
    VENTILATION_SIMILARITY_FIELDS.ph,
  ];

  const datasetRanges = computeDatasetRanges({ dataset, fields });
  const configRanges = config?.ranges ?? {};

  const out = [];
  fields.forEach((field) => {
    const value = input?.[field];
    if (!isFiniteNumber(value)) return;

    const datasetRange = datasetRanges?.[field];
    const configRange = configRanges?.[field];

    const min = isFiniteNumber(datasetRange?.min) ? datasetRange.min : isFiniteNumber(configRange?.min) ? configRange.min : null;
    const max = isFiniteNumber(datasetRange?.max) ? datasetRange.max : isFiniteNumber(configRange?.max) ? configRange.max : null;

    if (min === null || max === null) return;
    if (value < min || value > max) out.push(field);
  });

  out.sort((a, b) => String(a).localeCompare(String(b)));
  return Object.freeze([...out]);
};

/**
 * Pure complex-case detector.
 *
 * @returns {{ isComplexCase: boolean, reasons: string[], details: object }}
 */
const detectVentilationComplexCase = ({ input, datasetOutput, dataset, config = VENTILATION_SIMILARITY_CONFIG } = {}) => {
  const confidenceTier = datasetOutput?.source?.confidenceTier ?? 'low';
  const missingAbg = getMissingSimilarityFields(input).filter((f) => VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS.includes(f));
  const outOfDistributionFields = detectOutOfDistributionFields({ input, dataset, config });

  const reasons = [];
  if (confidenceTier === 'low') reasons.push(VENTILATION_COMPLEX_CASE_REASON_CODES.LOW_CONFIDENCE);
  if (missingAbg.length > 0) reasons.push(VENTILATION_COMPLEX_CASE_REASON_CODES.MISSING_KEY_INPUTS);
  if (outOfDistributionFields.length > 0) reasons.push(VENTILATION_COMPLEX_CASE_REASON_CODES.OUT_OF_DISTRIBUTION);

  const unique = Array.from(new Set(reasons));
  unique.sort((a, b) => String(a).localeCompare(String(b)));

  return Object.freeze({
    isComplexCase: unique.length > 0,
    reasons: Object.freeze([...unique]),
    details: Object.freeze({
      confidenceTier,
      missingKeyInputs: Object.freeze([...missingAbg]),
      outOfDistributionFields,
    }),
  });
};

const isSafeAiCode = (value) => typeof value === 'string' && /^VENTILATION_[A-Z0-9_]+$/.test(value) && value.length <= 120;

const coerceSafeAiHints = (aiOutput) => {
  const raw = aiOutput?.hints ?? aiOutput?.codes ?? aiOutput?.suggestions;
  const list = Array.isArray(raw) ? raw : [];
  const safe = list.filter(isSafeAiCode);
  const unique = Array.from(new Set(safe));
  unique.sort((a, b) => String(a).localeCompare(String(b)));
  return Object.freeze([...unique]);
};

/**
 * Deterministic merge: dataset output remains primary.
 * AI output is sanitized and attached under `aiAugmentation` only.
 */
const mergeVentilationRecommendationWithAi = (datasetOutput, aiOutput) => {
  const base = datasetOutput && typeof datasetOutput === 'object' ? datasetOutput : {};
  const hints = coerceSafeAiHints(aiOutput);

  return Object.freeze({
    ...base,
    aiAugmentation: Object.freeze({
      provider: VENTILATION_AI_AUGMENTATION_PROVIDER,
      hints,
    }),
  });
};

export {
  assertVentilationUnitsContract,
  VENTILATION_VENTILATOR_SETTING_KEYS,
  VENTILATION_SIMILARITY_FIELDS,
  VENTILATION_SIMILARITY_REQUIRED_FIELDS,
  VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS,
  VENTILATION_SIMILARITY_CONFIG,
  getMissingSimilarityFields,
  assertVentilationSimilarityInput,
  assertVentilationTopN,
  computeNormalizedDistance,
  computeVentilationSimilarityConfidenceTier,
  computeVentilationCaseSimilarity,
  rankVentilationSimilarCases,
  VENTILATION_ADDITIONAL_TEST_PROMPT_CODES,
  buildVentilationAdditionalTestPrompts,
  VENTILATION_NEXT_ACTIONS_BY_CONDITION_AND_TIER,
  getVentilationNextActionsChecklist,
  assembleVentilationRecommendationFromMatches,
  VENTILATION_COMPLEX_CASE_REASON_CODES,
  detectVentilationComplexCase,
  mergeVentilationRecommendationWithAi,
};
