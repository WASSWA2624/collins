/**
 * Ventilation Rules Tests
 * File: ventilation.rules.test.js
 */
import {
  assertVentilationSimilarityInput,
  assertVentilationTopN,
  assertVentilationUnitsContract,
  assembleVentilationRecommendationFromMatches,
  detectVentilationComplexCase,
  getVentilationNextActionsChecklist,
  mergeVentilationRecommendationWithAi,
  VENTILATION_COMPLEX_CASE_REASON_CODES,
  VENTILATION_ADDITIONAL_TEST_PROMPT_CODES,
  computeNormalizedDistance,
  computeVentilationCaseSimilarity,
  computeVentilationSimilarityConfidenceTier,
  getDefaultVentilationDataset,
  getMissingSimilarityFields,
  getVentilationUnits,
  parseVentilationDataset,
  rankVentilationSimilarCases,
  VENTILATION_SIMILARITY_CONFIG,
  VENTILATION_SIMILARITY_FIELDS,
} from '@features/ventilation';
 
describe('ventilation.rules', () => {
  it('accepts units object that matches the contract', () => {
    const dataset = getDefaultVentilationDataset();
    const units = getVentilationUnits(dataset);
    expect(assertVentilationUnitsContract(units)).toBe(units);
  });
 
  it('rejects missing/invalid units', () => {
    expect(() => assertVentilationUnitsContract(null)).toThrow('units_required');
    expect(() => assertVentilationUnitsContract({ spo2: '%' })).toThrow('units_missing:');
  });

  describe('similarity scoring (Step 10.3)', () => {
    const makeInput = (overrides = {}) => {
      return {
        condition: 'ARDS',
        spo2: 88,
        respiratoryRate: 28,
        heartRate: 110,
        ...overrides,
      };
    };

    const makeCase = (caseId, clinicalParameters = {}, condition = 'ARDS') => {
      return {
        caseId,
        patientProfile: { condition },
        clinicalParameters: {
          spo2: 90,
          respiratoryRate: 30,
          heartRate: 100,
          pao2: 65,
          paco2: 45,
          ph: 7.35,
          ...clinicalParameters,
        },
      };
    };

    it('validates required clinician inputs (condition + spo2 + respiratoryRate + heartRate)', () => {
      expect(() => assertVentilationSimilarityInput(null)).toThrow('similarity_input_required');
      expect(() => assertVentilationSimilarityInput({})).toThrow('similarity_input_condition_required');
      expect(() => assertVentilationSimilarityInput({ condition: 'ARDS' })).toThrow('similarity_input_spo2_required');

      expect(() =>
        assertVentilationSimilarityInput({ condition: 'ARDS', spo2: 90 })
      ).toThrow('similarity_input_respiratoryRate_required');

      expect(() =>
        assertVentilationSimilarityInput({ condition: 'ARDS', spo2: 90, respiratoryRate: 20 })
      ).toThrow('similarity_input_heartRate_required');

      expect(assertVentilationSimilarityInput(makeInput())).toEqual(makeInput());
    });

    it('collects missing fields (ABG optional; includes ABG fields when omitted)', () => {
      expect(getMissingSimilarityFields(null)).toEqual([
        VENTILATION_SIMILARITY_FIELDS.condition,
        VENTILATION_SIMILARITY_FIELDS.spo2,
        VENTILATION_SIMILARITY_FIELDS.respiratoryRate,
        VENTILATION_SIMILARITY_FIELDS.heartRate,
        VENTILATION_SIMILARITY_FIELDS.pao2,
        VENTILATION_SIMILARITY_FIELDS.paco2,
        VENTILATION_SIMILARITY_FIELDS.ph,
      ]);

      expect(getMissingSimilarityFields(makeInput())).toEqual([
        VENTILATION_SIMILARITY_FIELDS.pao2,
        VENTILATION_SIMILARITY_FIELDS.paco2,
        VENTILATION_SIMILARITY_FIELDS.ph,
      ]);

      expect(
        getMissingSimilarityFields(
          makeInput({
            pao2: 60,
            paco2: 50,
            ph: 7.3,
          })
        )
      ).toEqual([]);
    });

    it('validates topN', () => {
      expect(assertVentilationTopN(undefined)).toBe(VENTILATION_SIMILARITY_CONFIG.topNDefault);
      expect(assertVentilationTopN(null)).toBe(VENTILATION_SIMILARITY_CONFIG.topNDefault);
      expect(assertVentilationTopN(1)).toBe(1);
      expect(() => assertVentilationTopN(0)).toThrow('similarity_topN_invalid');
      expect(() => assertVentilationTopN(-1)).toThrow('similarity_topN_invalid');
      expect(() => assertVentilationTopN(1.2)).toThrow('similarity_topN_invalid');
    });

    it('computes normalized distances deterministically and clamps to [0, 1]', () => {
      expect(
        computeNormalizedDistance({
          field: 'spo2',
          inputValue: 90,
          caseValue: 90,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toBe(0);

      expect(
        computeNormalizedDistance({
          field: 'spo2',
          inputValue: 50,
          caseValue: 100,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toBe(1);

      // beyond range width should clamp to 1
      expect(
        computeNormalizedDistance({
          field: 'heartRate',
          inputValue: 30,
          caseValue: 999,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toBe(1);

      // missing numeric values return null (excluded from scoring)
      expect(
        computeNormalizedDistance({
          field: 'spo2',
          inputValue: null,
          caseValue: 90,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toBe(null);
    });

    it('derives confidence tier from score + completeness using domain thresholds', () => {
      expect(
        computeVentilationSimilarityConfidenceTier({
          score: 0.9,
          completeness: 0.9,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toBe('high');

      expect(
        computeVentilationSimilarityConfidenceTier({
          score: 0.75,
          completeness: 0.6,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toBe('medium');

      expect(
        computeVentilationSimilarityConfidenceTier({
          score: 0.99,
          completeness: 0.1,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toBe('low');
    });

    it('scores cases with ABG omitted (missing-value handling) and includes missing-data list', () => {
      const input = makeInput(); // no ABG
      const caseItem = makeCase('CASE_1', { spo2: 88, respiratoryRate: 28, heartRate: 110 });
      const scored = computeVentilationCaseSimilarity({ input, caseItem, config: VENTILATION_SIMILARITY_CONFIG });

      expect(scored.caseId).toBe('CASE_1');
      expect(scored.score).toBe(1);
      expect(scored.missingData.missingFromInput).toEqual([
        VENTILATION_SIMILARITY_FIELDS.pao2,
        VENTILATION_SIMILARITY_FIELDS.paco2,
        VENTILATION_SIMILARITY_FIELDS.ph,
      ]);

      // completeness should be < 1 since ABG weights exist but were not used
      expect(scored.completeness).toBeLessThan(1);
      expect(scored.confidenceTier).toBe('medium');
      expect(scored.explanation.comparisons.length).toBeGreaterThan(0);
      expect(scored.explanation.comparisons.every((c) => Object.isFrozen(c))).toBe(true);
    });

    it('scores cases with all ABG provided and can reach high confidence', () => {
      const input = makeInput({ pao2: 65, paco2: 45, ph: 7.35 });
      const caseItem = makeCase('CASE_2', { spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 65, paco2: 45, ph: 7.35 });

      const scored = computeVentilationCaseSimilarity({ input, caseItem, config: VENTILATION_SIMILARITY_CONFIG });
      expect(scored.score).toBe(1);
      expect(scored.completeness).toBe(1);
      expect(scored.missingData.missingFromInput).toEqual([]);
      expect(scored.confidenceTier).toBe('high');
    });

    it('ranks top-N matches deterministically and uses stable tie-breaking', () => {
      const input = makeInput({ pao2: 60, paco2: 50, ph: 7.3 });
      const caseA = makeCase('CASE_A', { spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 60, paco2: 50, ph: 7.3 });
      const caseB = makeCase('CASE_B', { spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 60, paco2: 50, ph: 7.3 });
      const caseC = makeCase('CASE_C', { spo2: 60, respiratoryRate: 10, heartRate: 80, pao2: 40, paco2: 80, ph: 7.1 });

      const ranked = rankVentilationSimilarCases({
        input,
        candidateCases: [caseB, caseC, caseA], // shuffled input order
        topN: 2,
        config: VENTILATION_SIMILARITY_CONFIG,
      });

      expect(ranked).toHaveLength(2);

      // A and B tie on score/completeness; caseId tie-break produces stable order
      expect(ranked.map((r) => r.caseId)).toEqual(['CASE_A', 'CASE_B']);
      expect(ranked[0].score).toBe(1);
    });

    it('returns [] when ranking with no candidates', () => {
      expect(
        rankVentilationSimilarCases({
          input: makeInput(),
          candidateCases: [],
          topN: 3,
          config: VENTILATION_SIMILARITY_CONFIG,
        })
      ).toEqual([]);
    });
  });

  describe('recommendation assembly (Step 10.4)', () => {
    const makeDataset = (cases) => {
      return parseVentilationDataset({
        datasetVersion: '1.0',
        datasetSchemaVersion: '1.0',
        lastUpdated: '2026-01-31',
        totalCases: cases.length,
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
        intendedUse: {
          clinicalUse: false,
          warning: 'dataset_warning',
          validationRequirement: 'dataset_validation_requirement',
        },
        sources: [
          { id: 'SRC_A', type: 'guideline', citation: 'citation_a' },
          { id: 'SRC_B', type: 'review', citation: 'citation_b', doi: 'doi_b' },
        ],
        cases,
      });
    };

    const makeCase = ({ caseId, condition, overrides = {} }) => {
      return {
        caseId,
        patientProfile: { condition },
        clinicalParameters: {
          spo2: 88,
          respiratoryRate: 28,
          heartRate: 110,
          pao2: 65,
          paco2: 45,
          ph: 7.35,
        },
        ventilatorSettings: {
          mode: 'VC',
          tidalVolume: 420,
          respiratoryRate: 18,
          fio2: 0.6,
          peep: 8,
          ieRatio: '1:2',
        },
        recommendations: {
          initialSettings: {
            mode: 'PC',
            tidalVolume: 400,
            respiratoryRate: 16,
            fio2: 0.5,
            peep: 10,
            ieRatio: '1:3',
          },
          monitoringPoints: ['monitor_a', 'monitor_shared'],
          riskFactors: ['risk_a', 'risk_shared'],
        },
        outcomes: { complications: ['comp_a', 'comp_shared'] },
        evidence: { sourceIds: ['SRC_B', 'SRC_A'], notes: 'evidence_notes' },
        review: { status: 'validated', reviewedByRole: 'specialist', reviewedAt: '2026-01-31' },
        ...overrides,
      };
    };

    it('assembles UI-ready output with safety framing, units, citations, and source metadata', () => {
      const dataset = makeDataset([
        makeCase({ caseId: 'CASE_1', condition: 'ARDS' }),
        makeCase({ caseId: 'CASE_2', condition: 'ARDS' }),
      ]);

      const input = { condition: 'ARDS', spo2: 88, respiratoryRate: 28, heartRate: 110 }; // ABG omitted
      const rankedMatches = [
        { caseId: 'CASE_1', score: 0.7, completeness: 0.6, confidenceTier: 'medium' },
        { caseId: 'CASE_2', score: 0.69, completeness: 0.6, confidenceTier: 'medium' },
      ];

      const assembled = assembleVentilationRecommendationFromMatches({ dataset, rankedMatches, input });

      expect(assembled.safety.intendedUseWarning).toBe('dataset_warning');
      expect(assembled.safety.validationRequirement).toBe('dataset_validation_requirement');
      expect(assembled.units.spo2).toBe('%');

      expect(assembled.source).toEqual({
        caseIds: ['CASE_1', 'CASE_2'],
        primaryCaseId: 'CASE_1',
        confidenceTier: 'medium',
      });

      expect(assembled.caseEvidence[0]).toMatchObject({
        caseId: 'CASE_1',
        reviewStatus: 'validated',
        evidenceNotes: 'evidence_notes',
      });

      expect(assembled.caseEvidence[0].citations.map((c) => c.id)).toEqual(['SRC_B', 'SRC_A']);
      expect(assembled.caseEvidence[0].citations[0]).not.toBe(dataset.sources[1]); // ensure no raw dataset source object leaks by ref
      expect(assembled).not.toHaveProperty('cases');
    });

    it('prefers recommendations.initialSettings but falls back to ventilatorSettings when missing', () => {
      const caseWithInitial = makeCase({ caseId: 'CASE_A', condition: 'pneumonia' });
      const caseWithFallback = makeCase({
        caseId: 'CASE_B',
        condition: 'pneumonia',
        overrides: { recommendations: { monitoringPoints: [], riskFactors: [] } },
      });
      delete caseWithFallback.recommendations.initialSettings;

      const dataset = makeDataset([caseWithFallback, caseWithInitial]);

      const assembledA = assembleVentilationRecommendationFromMatches({
        dataset,
        rankedMatches: [{ caseId: 'CASE_A', score: 1, completeness: 1, confidenceTier: 'high' }],
        input: { condition: 'pneumonia', spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 65, paco2: 45, ph: 7.35 },
      });
      expect(assembledA.initialVentilatorSettings.source).toBe('recommendations.initialSettings');
      expect(assembledA.initialVentilatorSettings.settings.mode).toBe('PC');

      const assembledB = assembleVentilationRecommendationFromMatches({
        dataset,
        rankedMatches: [{ caseId: 'CASE_B', score: 1, completeness: 1, confidenceTier: 'high' }],
        input: { condition: 'pneumonia', spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 65, paco2: 45, ph: 7.35 },
      });
      expect(assembledB.initialVentilatorSettings.source).toBe('ventilatorSettings');
      expect(assembledB.initialVentilatorSettings.settings.mode).toBe('VC');
    });

    it('aggregates monitoring points, risk factors, and complications across matched cases with stable uniqueness', () => {
      const dataset = makeDataset([
        makeCase({
          caseId: 'CASE_1',
          condition: 'sepsis',
          overrides: {
            recommendations: { monitoringPoints: ['m1', 'shared'], riskFactors: ['r1', 'shared'] },
            outcomes: { complications: ['c1', 'shared'] },
          },
        }),
        makeCase({
          caseId: 'CASE_2',
          condition: 'sepsis',
          overrides: {
            recommendations: { monitoringPoints: ['shared', 'm2'], riskFactors: ['shared', 'r2'] },
            outcomes: { complications: ['shared', 'c2'] },
          },
        }),
      ]);

      const assembled = assembleVentilationRecommendationFromMatches({
        dataset,
        rankedMatches: [
          { caseId: 'CASE_1', score: 0.7, completeness: 0.6, confidenceTier: 'medium' },
          { caseId: 'CASE_2', score: 0.69, completeness: 0.6, confidenceTier: 'medium' },
        ],
        input: { condition: 'sepsis', spo2: 88, respiratoryRate: 28, heartRate: 110 },
      });

      expect(assembled.monitoringPoints).toEqual(['m1', 'shared', 'm2']);
      expect(assembled.riskFactors).toEqual(['r1', 'shared', 'r2']);
      expect(assembled.complicationHistory).toEqual(['c1', 'shared', 'c2']);
    });

    it('generates ABG-focused additional test prompts when ABG is missing or confidence is low', () => {
      const dataset = makeDataset([makeCase({ caseId: 'CASE_1', condition: 'COPD' })]);

      const assembledMissingAbg = assembleVentilationRecommendationFromMatches({
        dataset,
        rankedMatches: [{ caseId: 'CASE_1', score: 0.75, completeness: 0.6, confidenceTier: 'medium' }],
        input: { condition: 'COPD', spo2: 88, respiratoryRate: 28, heartRate: 110 }, // ABG omitted
      });

      expect(assembledMissingAbg.additionalTestPrompts.map((p) => p.code)).toEqual([
        VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PANEL,
        VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PAO2,
        VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PACO2,
        VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PH,
      ]);

      const assembledLow = assembleVentilationRecommendationFromMatches({
        dataset,
        rankedMatches: [{ caseId: 'CASE_1', score: 0.1, completeness: 0.1, confidenceTier: 'low' }],
        input: { condition: 'COPD', spo2: 88, respiratoryRate: 28, heartRate: 110, pao2: 65, paco2: 45, ph: 7.35 },
      });

      expect(assembledLow.additionalTestPrompts.map((p) => p.code)).toContain(VENTILATION_ADDITIONAL_TEST_PROMPT_CODES.ABG_PANEL);
    });

    it('provides a next-actions checklist for each supported condition bucket', () => {
      const supportedConditions = ['ARDS', 'asthma', 'COPD', 'heart failure', 'pneumonia', 'sepsis', 'trauma'];

      supportedConditions.forEach((condition) => {
        const actionsHigh = getVentilationNextActionsChecklist({ condition, confidenceTier: 'high' });
        const actionsMedium = getVentilationNextActionsChecklist({ condition, confidenceTier: 'medium' });
        const actionsLow = getVentilationNextActionsChecklist({ condition, confidenceTier: 'low' });

        expect(actionsHigh.length).toBeGreaterThan(0);
        expect(actionsMedium.length).toBeGreaterThan(0);
        expect(actionsLow.length).toBeGreaterThan(0);

        expect(actionsHigh[0]).toMatchObject({ confidenceTier: 'high' });
        expect(actionsLow[0]).toMatchObject({ confidenceTier: 'low' });
      });
    });
  });

  describe('optional online AI augmentation (Step 10.8)', () => {
    const makeDataset = (cases) => {
      return parseVentilationDataset({
        datasetVersion: '1.0',
        datasetSchemaVersion: '1.0',
        lastUpdated: '2026-01-31',
        totalCases: cases.length,
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
        cases,
      });
    };

    it('detectVentilationComplexCase is pure/deterministic for identical inputs', () => {
      const dataset = makeDataset([
        {
          caseId: 'CASE_1',
          patientProfile: { condition: 'ARDS' },
          clinicalParameters: { spo2: 90, respiratoryRate: 20, heartRate: 80, pao2: 70, paco2: 40, ph: 7.35 },
        },
      ]);

      const input = { condition: 'ARDS', spo2: 88, respiratoryRate: 28, heartRate: 110 }; // ABG omitted => complex
      const datasetOutput = Object.freeze({ source: Object.freeze({ confidenceTier: 'medium' }) });

      const a = detectVentilationComplexCase({ input, datasetOutput, dataset });
      const b = detectVentilationComplexCase({ input, datasetOutput, dataset });

      expect(a).toEqual(b);
      expect(a.isComplexCase).toBe(true);
      expect(a.reasons).toContain(VENTILATION_COMPLEX_CASE_REASON_CODES.MISSING_KEY_INPUTS);
    });

    it('detects out-of-distribution numeric inputs against dataset ranges', () => {
      const dataset = makeDataset([
        {
          caseId: 'CASE_1',
          patientProfile: { condition: 'ARDS' },
          clinicalParameters: { spo2: 92, respiratoryRate: 22, heartRate: 90, pao2: 80, paco2: 40, ph: 7.4 },
        },
      ]);

      const input = { condition: 'ARDS', spo2: 10, respiratoryRate: 22, heartRate: 90, pao2: 80, paco2: 40, ph: 7.4 };
      const datasetOutput = Object.freeze({ source: Object.freeze({ confidenceTier: 'high' }) });

      const res = detectVentilationComplexCase({ input, datasetOutput, dataset });
      expect(res.isComplexCase).toBe(true);
      expect(res.reasons).toContain(VENTILATION_COMPLEX_CASE_REASON_CODES.OUT_OF_DISTRIBUTION);
      expect(res.details.outOfDistributionFields).toEqual(['spo2']);
    });

    it('mergeVentilationRecommendationWithAi keeps dataset output primary and strips raw AI output', () => {
      const datasetOutput = Object.freeze({
        source: Object.freeze({ confidenceTier: 'high' }),
        monitoringPoints: Object.freeze(['dataset_point']),
      });

      const aiOutput = {
        hints: ['VENTILATION_AI_HINT_1', 'not safe', 'VENTILATION_AI_HINT_1'],
        rawText: 'do not leak this',
      };

      const merged = mergeVentilationRecommendationWithAi(datasetOutput, aiOutput);

      expect(merged.monitoringPoints).toEqual(['dataset_point']); // unchanged
      expect(merged.aiAugmentation.provider).toBe('aiSdk');
      expect(merged.aiAugmentation.hints).toEqual(['VENTILATION_AI_HINT_1']);
      expect(merged).not.toHaveProperty('rawText');
      expect(merged.aiAugmentation).not.toHaveProperty('rawText');
    });
  });
});
