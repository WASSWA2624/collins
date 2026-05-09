const {
  normalizeFacilitiesResponse,
  normalizeFacility,
} = require('@features/facilities');

describe('facility API model', () => {
  it('normalizes database-backed facility records', () => {
    expect(normalizeFacility({
      id: 'facility-1',
      registryCode: 'ug-hospital-002',
      name: 'Mulago National Referral Hospital',
      district: 'Kampala',
      region: 'Central',
      type: 'National referral hospital',
      ownership: 'Government',
      verificationStatus: 'VERIFIED',
      _count: { memberships: 2, admissions: 1 },
    })).toEqual({
      id: 'facility-1',
      registryCode: 'ug-hospital-002',
      name: 'Mulago National Referral Hospital',
      district: 'Kampala',
      region: 'Central',
      type: 'National referral hospital',
      ownership: 'Government',
      verificationStatus: 'VERIFIED',
      abgAvailability: null,
      oxygenProfileJson: null,
      ventilatorProfileJson: null,
      counts: {
        activeUserSettings: 0,
        admissions: 1,
        datasetCases: 0,
        idempotencyRecords: 0,
        memberships: 2,
        onboardingSelections: 0,
        patients: 0,
        referenceRules: 0,
        reviewActions: 0,
        syncEvents: 0,
      },
      createdAt: null,
      updatedAt: null,
    });
  });

  it('normalizes paginated facility search responses', () => {
    const response = normalizeFacilitiesResponse({
      data: [
        { id: 'facility-1', name: 'International Hospital Kampala' },
        { facilityId: 'facility-2', name: 'Lacor Hospital' },
      ],
      meta: { total: 142, page: 1, limit: 25, hasNextPage: true },
    });

    expect(response.facilities.map((facility) => facility.name)).toEqual([
      'International Hospital Kampala',
      'Lacor Hospital',
    ]);
    expect(response.meta.total).toBe(142);
    expect(response.meta.hasNextPage).toBe(true);
  });
});
