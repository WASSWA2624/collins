/**
 * Home Model Tests
 * File: home.model.test.js
 */
const { normalizeHomeSummary } = require('@features/home/home.model');

describe('home model', () => {
  it('normalizes a facility-scoped Home summary', () => {
    const summary = normalizeHomeSummary({
      user: {
        id: 'user-1',
        activeRole: 'CLINICIAN',
        availableRoles: ['CLINICIAN'],
      },
      activeFacility: {
        id: 'facility-1',
        name: 'City ICU',
      },
      availableFacilities: [],
      counts: {
        patientActivity: { activePatients: 2, activeAdmissions: 2 },
        drafts: { localDrafts: 1, waitingToSync: 0 },
        sync: { attentionTotal: 0 },
        review: { visible: false, pendingTotal: null },
        dataset: { visible: false },
      },
      statusSummaries: [],
      navigation: {
        status: 'ready',
        canOpenAdmissions: true,
        canCreateAdmission: true,
        notices: [],
      },
      privacy: 'Aggregate only.',
    });

    expect(summary.activeFacility.name).toBe('City ICU');
    expect(summary.navigation.canOpenAdmissions).toBe(true);
    expect(summary.counts.patientActivity.activeAdmissions).toBe(2);
  });

  it('rejects malformed summaries', () => {
    expect(() => normalizeHomeSummary({ activeFacility: null })).toThrow('Invalid Home summary response');
  });
});
