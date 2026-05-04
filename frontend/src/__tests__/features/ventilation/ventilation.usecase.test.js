/**
 * Ventilation Use Case Tests
 * File: ventilation.usecase.test.js
 */
jest.mock('@services', () => ({
  aiSdk: {
    requestCaseAnalysis: jest.fn(),
  },
}));

import {
  getVentilationDatasetIntendedUseCase,
  getVentilationDatasetMetaUseCase,
  getVentilationRecommendationUseCase,
  loadVentilationDatasetUseCase,
} from '@features/ventilation';
import { aiSdk } from '@services';
 
describe('ventilation.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads the default dataset and exposes meta + intendedUse', async () => {
    const dataset = await loadVentilationDatasetUseCase();
    expect(dataset.totalCases).toBe(dataset.cases.length);
 
    const meta = await getVentilationDatasetMetaUseCase();
    expect(meta.totalCases).toBe(dataset.totalCases);
 
    const intended = await getVentilationDatasetIntendedUseCase();
    expect(intended.warning).toBeTruthy();
    expect(intended.validationRequirement).toBeTruthy();
  });
 
  it('normalizes errors via handleError when parsing fails', async () => {
    await expect(loadVentilationDatasetUseCase({})).rejects.toMatchObject({
      code: 'UNKNOWN_ERROR',
      safeMessage: expect.any(String),
    });
  });

  it('computes an assembled recommendation (Step 10.4) from a provided dataset', async () => {
    const rawDataset = {
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
          timeSeriesShape: { name: 'string', unit: 'string', points: [{ timestamp: 'string', value: 'string' }] },
        },
      },
      intendedUse: { clinicalUse: false, warning: 'warn', validationRequirement: 'validate' },
      sources: [{ id: 'SRC_1', type: 'guideline', citation: 'c1' }],
      cases: [
        {
          caseId: 'CASE_1',
          patientProfile: { condition: 'ARDS' },
          clinicalParameters: { spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 65, paco2: 45, ph: 7.35 },
          ventilatorSettings: { mode: 'VC', tidalVolume: 420, respiratoryRate: 18, fio2: 0.6, peep: 8, ieRatio: '1:2' },
          recommendations: { monitoringPoints: ['m1'], riskFactors: ['r1'], initialSettings: { mode: 'PC' } },
          outcomes: { complications: ['c1'] },
          evidence: { sourceIds: ['SRC_1'], notes: 'n1' },
          review: { status: 'validated', reviewedByRole: 'specialist', reviewedAt: '2026-01-31' },
        },
      ],
    };

    const res = await getVentilationRecommendationUseCase({
      rawDataset,
      input: { condition: 'ARDS', spo2: 88, respiratoryRate: 28, heartRate: 110 },
      topN: 1,
    });

    expect(res.source.primaryCaseId).toBe('CASE_1');
    expect(res.safety.intendedUseWarning).toBe('warn');
    expect(res.units.spo2).toBe('%');
    expect(res).not.toHaveProperty('cases');
  });

  it('does not call AI SDK for core path when offline/disabled (Step 10.8 offline-first)', async () => {
    const rawDataset = {
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
          timeSeriesShape: { name: 'string', unit: 'string', points: [{ timestamp: 'string', value: 'string' }] },
        },
      },
      intendedUse: { clinicalUse: false, warning: 'warn', validationRequirement: 'validate' },
      sources: [],
      cases: [
        {
          caseId: 'CASE_1',
          patientProfile: { condition: 'ARDS' },
          clinicalParameters: { spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 65, paco2: 45, ph: 7.35 },
          ventilatorSettings: { mode: 'VC', tidalVolume: 420, respiratoryRate: 18, fio2: 0.6, peep: 8, ieRatio: '1:2' },
          recommendations: { monitoringPoints: ['m1'], riskFactors: ['r1'], initialSettings: { mode: 'PC' } },
          outcomes: { complications: ['c1'] },
        },
      ],
    };

    // ABG omitted -> complex case, but offline/disabled should prevent any AI call.
    const res = await getVentilationRecommendationUseCase({
      rawDataset,
      input: { condition: 'ARDS', spo2: 88, respiratoryRate: 28, heartRate: 110 },
      topN: 1,
      ai: { isOnline: false, flags: { OFFLINE_MODE: true, AI_AUGMENTATION_ENABLED: true } },
    });

    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
    expect(res.source.primaryCaseId).toBe('CASE_1');
    expect(res.aiAugmentation).toMatchObject({ provider: 'aiSdk', status: 'skipped' });
  });

  it('calls AI SDK and merges deterministically when enabled + online for complex cases', async () => {
    aiSdk.requestCaseAnalysis.mockResolvedValue({
      hints: ['VENTILATION_AI_HINT_2', 'not safe'],
      rawText: 'should not leak',
    });

    const rawDataset = {
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
          timeSeriesShape: { name: 'string', unit: 'string', points: [{ timestamp: 'string', value: 'string' }] },
        },
      },
      intendedUse: { clinicalUse: false, warning: 'warn', validationRequirement: 'validate' },
      sources: [],
      cases: [
        {
          caseId: 'CASE_1',
          patientProfile: { condition: 'ARDS' },
          clinicalParameters: { spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 65, paco2: 45, ph: 7.35 },
          ventilatorSettings: { mode: 'VC', tidalVolume: 420, respiratoryRate: 18, fio2: 0.6, peep: 8, ieRatio: '1:2' },
          recommendations: { monitoringPoints: ['m1'], riskFactors: ['r1'], initialSettings: { mode: 'PC' } },
          outcomes: { complications: ['c1'] },
        },
      ],
    };

    const res = await getVentilationRecommendationUseCase({
      rawDataset,
      input: { condition: 'ARDS', spo2: 88, respiratoryRate: 28, heartRate: 110 }, // ABG omitted -> complex
      topN: 1,
      ai: { isOnline: true, flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true } },
    });

    expect(aiSdk.requestCaseAnalysis).toHaveBeenCalledTimes(1);
    expect(res.aiAugmentation).toMatchObject({ provider: 'aiSdk', status: 'applied' });
    expect(res.aiAugmentation.hints).toEqual(['VENTILATION_AI_HINT_2']);
    expect(res.aiAugmentation).not.toHaveProperty('rawText');
  });
});
