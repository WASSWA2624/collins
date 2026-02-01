/**
 * Ventilation Model Tests
 * File: ventilation.model.test.js
 */
import ventilationDatasetJson from '@config/data/ventilation_dataset.json';
import {
  REQUIRED_UNIT_KEYS,
  buildVentilationCaseIndex,
  getDefaultVentilationDataset,
  getDefaultVentilationCaseIndex,
  getVentilationCandidateCases,
  getVentilationCandidateCaseIndexes,
  getVentilationCaseById,
  getVentilationCaseCitations,
  getVentilationCaseReviewStatus,
  getVentilationDatasetIntendedUse,
  getVentilationDatasetMeta,
  getVentilationDatasetSources,
  getVentilationUnits,
  normalizeVentilationConditionKey,
  parseVentilationDataset,
  safeParseVentilationDataset,
} from '@features/ventilation';
 
describe('ventilation.model', () => {
  const makeValidMinimalDataset = (overrides = {}) => {
    return {
      datasetVersion: '1.0',
      datasetSchemaVersion: '1.0',
      lastUpdated: '2026-01-31',
      totalCases: 1,
      schema: {
        units: {
          spo2: '%',
          pao2: 'mmHg',
          paco2: 'mmHg',
          ph: 'unitless',
          respiratoryRate: 'breaths/min',
          heartRate: 'bpm',
          bloodPressure: 'mmHg',
          fio2: 'fraction',
          peep: 'cmH2O',
          tidalVolume: 'mL',
          ieRatio: '1:2',
        },
        observationModel: {
          observations: 'desc',
          timeSeries: 'desc',
          observationShape: {
            codeSystem: 'string',
            code: 'string',
            name: 'string',
            value: 'string',
            unit: 'string',
            timestamp: 'string',
            method: 'string',
            source: 'string',
            referenceRange: { low: 'string', high: 'string', text: 'string' },
          },
          timeSeriesShape: {
            name: 'string',
            unit: 'string',
            points: [{ timestamp: 'string', value: 'string' }],
          },
        },
      },
      intendedUse: {
        clinicalUse: false,
        warning: 'warn',
        validationRequirement: 'validate',
      },
      sources: [{ id: 'SRC_1', type: 'guideline', citation: 'c1', doi: 'd1' }],
      cases: [{ caseId: 'CASE_1' }],
      ...overrides,
    };
  };
 
  it('parses the shipped dataset JSON successfully', () => {
    const parsed = parseVentilationDataset(ventilationDatasetJson);
    expect(parsed.datasetVersion).toBeTruthy();
    expect(parsed.totalCases).toBe(parsed.cases.length);
  });
 
  it('normalizes missing per-case evidence/review blocks', () => {
    const parsed = parseVentilationDataset(makeValidMinimalDataset());
    expect(parsed.cases[0].evidence).toEqual({ sourceIds: [], notes: null });
    expect(parsed.cases[0].review).toEqual({
      status: 'unvalidated',
      reviewedByRole: null,
      reviewedAt: null,
    });
  });
 
  it('fails parsing for corrupted/partial datasets (metadata, intendedUse, units, totalCases)', () => {
    expect(() => parseVentilationDataset(null)).toThrow();
 
    expect(() =>
      parseVentilationDataset(
        makeValidMinimalDataset({
          lastUpdated: '31-01-2026',
        })
      )
    ).toThrow();
 
    expect(() =>
      parseVentilationDataset(
        makeValidMinimalDataset({
          intendedUse: { clinicalUse: true, warning: 'w', validationRequirement: 'v' },
        })
      )
    ).toThrow();
 
    expect(() =>
      parseVentilationDataset(
        makeValidMinimalDataset({
          schema: {
            ...makeValidMinimalDataset().schema,
            units: {
              ...makeValidMinimalDataset().schema.units,
              pao2: undefined,
            },
          },
        })
      )
    ).toThrow();
 
    expect(() =>
      parseVentilationDataset(
        makeValidMinimalDataset({
          totalCases: 2,
        })
      )
    ).toThrow('totalCases_mismatch');
  });
 
  it('supports safeParse for success and failure', () => {
    expect(safeParseVentilationDataset(makeValidMinimalDataset()).success).toBe(true);
    expect(safeParseVentilationDataset({}).success).toBe(false);
  });
 
  it('exposes required unit keys for stable UI labels', () => {
    const units = getVentilationUnits(parseVentilationDataset(makeValidMinimalDataset()));
    REQUIRED_UNIT_KEYS.forEach((key) => {
      expect(units[key]).toBeTruthy();
    });
  });
 
  it('never suppresses intendedUse and exposes it via helper', () => {
    const intended = getVentilationDatasetIntendedUse(parseVentilationDataset(makeValidMinimalDataset()));
    expect(intended.warning).toBe('warn');
    expect(intended.validationRequirement).toBe('validate');
  });
 
  it('maps case.evidence.sourceIds to citations and handles empty/missing gracefully', () => {
    const dataset = parseVentilationDataset(
      makeValidMinimalDataset({
        sources: [
          { id: 'SRC_A', type: 'guideline', citation: 'a' },
          { id: 'SRC_B', type: 'review', citation: 'b' },
        ],
      })
    );
 
    const caseWithSources = {
      caseId: 'CASE_X',
      evidence: { sourceIds: ['SRC_B', 'SRC_MISSING', 'SRC_A'] },
      review: { status: 'unvalidated' },
    };
 
    expect(getVentilationCaseCitations(caseWithSources, dataset).map((s) => s.id)).toEqual(['SRC_B', 'SRC_A']);
    expect(getVentilationCaseCitations({ caseId: 'CASE_EMPTY' }, dataset)).toEqual([]);
  });
 
  it('surfaces review status (defaulting to unvalidated)', () => {
    expect(getVentilationCaseReviewStatus(null)).toBe('unvalidated');
    expect(getVentilationCaseReviewStatus({ review: { status: 'validated' } })).toBe('validated');
  });
 
  it('caches default dataset parsing', () => {
    const a = getDefaultVentilationDataset();
    const b = getDefaultVentilationDataset();
    expect(a).toBe(b);
    expect(getVentilationDatasetMeta()).toEqual(getVentilationDatasetMeta(a));
    expect(getVentilationDatasetSources()).toEqual(a.sources);
  });

  it('normalizes condition keys (trim + lowercase) and returns null for empty/non-strings', () => {
    expect(normalizeVentilationConditionKey('  ARDS  ')).toBe('ards');
    expect(normalizeVentilationConditionKey('')).toBe(null);
    expect(normalizeVentilationConditionKey('   ')).toBe(null);
    expect(normalizeVentilationConditionKey(null)).toBe(null);
    expect(normalizeVentilationConditionKey(123)).toBe(null);
  });

  it('builds a deterministic case index and retrieves candidates by condition (with graceful fallback)', () => {
    const dataset = parseVentilationDataset(
      makeValidMinimalDataset({
        totalCases: 4,
        cases: [
          { caseId: 'CASE_B', patientProfile: { condition: 'ARDS' } },
          { caseId: 'CASE_A', patientProfile: { condition: ' ARDS ' } },
          { caseId: 'CASE_C', patientProfile: { condition: 'COPD' } },
          { caseId: 'CASE_D' }, // missing patientProfile.condition
        ],
      })
    );

    const indexA = buildVentilationCaseIndex(dataset);
    const indexB = buildVentilationCaseIndex(dataset);
    expect(indexA).toEqual(indexB);

    expect(getVentilationCandidateCaseIndexes({ index: indexA, condition: 'ARDS' })).toEqual([1, 0]);
    expect(getVentilationCandidateCases({ dataset, index: indexA, condition: 'ARDS' }).map((c) => c.caseId)).toEqual([
      'CASE_A',
      'CASE_B',
    ]);

    expect(getVentilationCandidateCases({ dataset, index: indexA, condition: 'COPD' }).map((c) => c.caseId)).toEqual([
      'CASE_C',
    ]);

    // missing or unknown condition should fall back to "all cases" in a stable order
    expect(getVentilationCandidateCases({ dataset, index: indexA, condition: undefined }).map((c) => c.caseId)).toEqual([
      'CASE_A',
      'CASE_B',
      'CASE_C',
      'CASE_D',
    ]);
    expect(
      getVentilationCandidateCases({ dataset, index: indexA, condition: 'NOT_IN_DATASET' }).map((c) => c.caseId)
    ).toEqual(['CASE_A', 'CASE_B', 'CASE_C', 'CASE_D']);
  });

  it('caches default case index building', () => {
    const a = getDefaultVentilationCaseIndex();
    const b = getDefaultVentilationCaseIndex();
    expect(a).toBe(b);
  });

  it('getVentilationCaseById returns case when found, null when missing or empty caseId', () => {
    const dataset = parseVentilationDataset(
      makeValidMinimalDataset({
        totalCases: 2,
        cases: [
          { caseId: 'CASE_001', patientProfile: { condition: 'ARDS' } },
          { caseId: 'CASE_002', patientProfile: { condition: 'COPD' } },
        ],
      })
    );
    expect(getVentilationCaseById('CASE_001', dataset)).toEqual(
      expect.objectContaining({ caseId: 'CASE_001' })
    );
    expect(getVentilationCaseById('CASE_002', dataset)).toEqual(
      expect.objectContaining({ caseId: 'CASE_002' })
    );
    expect(getVentilationCaseById('NON_EXISTENT', dataset)).toBeNull();
    expect(getVentilationCaseById(null, dataset)).toBeNull();
    expect(getVentilationCaseById('', dataset)).toBeNull();
    expect(getVentilationCaseById('   ', dataset)).toBeNull();
    expect(getVentilationCaseById(undefined, dataset)).toBeNull();
  });
});
