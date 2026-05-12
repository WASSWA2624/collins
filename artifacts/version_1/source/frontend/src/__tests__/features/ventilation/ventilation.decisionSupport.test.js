import {
  buildRuleBasedDecisionSupportPreview,
  calculateReferenceWeight,
} from '@features/ventilation';

describe('ventilation.decisionSupport', () => {
  it('does not apply adult PBW to adolescent or unknown pathways', () => {
    const adolescent = calculateReferenceWeight({
      patientPathway: 'ADOLESCENT',
      actualWeightKg: 42,
      heightOrLengthCm: 160,
      sexForSizeCalculations: 'MALE',
    });
    const unknown = calculateReferenceWeight({
      patientPathway: 'UNKNOWN',
      heightOrLengthCm: 170,
      sexForSizeCalculations: 'MALE',
    });

    expect(adolescent.method).toBe('adolescent_actual_weight_preview');
    expect(adolescent.value).toBe(42);
    expect(unknown.value).toBeNull();
  });

  it('builds advisory calculations with explicit pending backend status', () => {
    const preview = buildRuleBasedDecisionSupportPreview({
      input: {
        age: 42,
        gender: 'male',
        height: 170,
        spo2: 92,
        pao2: 70,
        paco2: 48,
        ph: 7.3,
      },
      settings: {
        tidalVolume: 700,
        respiratoryRate: 20,
        fio2: 0.7,
        peep: 10,
      },
    });

    expect(preview.referenceWeight.value).toBe(66);
    expect(preview.vtPerKg.value).toBe(10.6);
    expect(preview.pfRatio.value).toBe(100);
    expect(preview.sfRatio.value).toBe(131);
    expect(preview.status.referenceStatus).toBe('frontend_preview_unconfirmed');
    expect(preview.flags.some((flag) => flag.code === 'HIGH_VT_PER_KG')).toBe(true);
    expect(JSON.stringify(preview)).not.toMatch(/diagnosed|set\s+(peep|fio2|tidal volume)\s+to/i);
  });
});
