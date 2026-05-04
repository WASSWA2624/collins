/**
 * Session Export Util Tests
 * File: sessionExport.test.js
 */
import { buildSessionSummaryText } from '@utils/sessionExport';

describe('sessionExport', () => {
  it('builds text with disclaimer and intended use', () => {
    const text = buildSessionSummaryText({
      summary: null,
      inputs: null,
      intendedUse: { warning: 'Not for clinical use.', validationRequirement: 'Validate locally.' },
      anonymize: false,
    });
    expect(text).toContain('--- Session summary ---');
    expect(text).toContain('Disclaimer: Not for clinical use.');
    expect(text).toContain('Validation: Validate locally.');
    expect(text).toContain('prototype for reference and training');
  });

  it('includes sessionId when not anonymized', () => {
    const text = buildSessionSummaryText({
      summary: null,
      inputs: { condition: 'ARDS' },
      intendedUse: {},
      sessionId: 'sess-123',
      anonymize: false,
    });
    expect(text).toContain('Session: sess-123');
  });

  it('omits sessionId when anonymized', () => {
    const text = buildSessionSummaryText({
      summary: null,
      inputs: { condition: 'ARDS', sessionId: 's1' },
      intendedUse: {},
      sessionId: 'sess-123',
      anonymize: true,
    });
    expect(text).not.toMatch(/Session:\s*sess-123/);
    expect(text).not.toMatch(/Session:\s*s1/);
  });

  it('includes inputs when provided', () => {
    const text = buildSessionSummaryText({
      summary: null,
      inputs: {
        condition: 'ARDS',
        spo2: 88,
        respiratoryRate: 20,
        heartRate: 100,
      },
      intendedUse: {},
      anonymize: false,
    });
    expect(text).toContain('Condition: ARDS');
    expect(text).toContain('SpO2: 88');
    expect(text).toContain('Respiratory rate: 20');
    expect(text).toContain('Heart rate: 100');
  });

  it('omits age/gender when anonymized', () => {
    const text = buildSessionSummaryText({
      summary: null,
      inputs: { condition: 'x', age: 65, gender: 'M' },
      intendedUse: {},
      anonymize: true,
    });
    expect(text).not.toContain('Age:');
    expect(text).not.toContain('Gender:');
  });

  it('includes recommended settings from summary', () => {
    const text = buildSessionSummaryText({
      summary: {
        initialVentilatorSettings: {
          settings: { mode: 'VCV', tidalVolume: 420, peep: 8 },
        },
        source: { confidenceTier: 'medium' },
      },
      inputs: { condition: 'ARDS' },
      intendedUse: {},
      anonymize: false,
    });
    expect(text).toContain('--- Recommended settings ---');
    expect(text).toContain('mode: VCV');
    expect(text).toContain('tidalVolume: 420');
    expect(text).toContain('Confidence: medium');
  });
});
