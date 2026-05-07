/**
 * Settings Use Case Tests
 */
import {
  getFacilitySettingsApi,
  getMySettingsApi,
  patchFacilitySettingsApi,
  patchMySettingsApi,
} from '@features/settings/settings.api';
import {
  loadFacilitySettingsUseCase,
  loadMySettingsUseCase,
  updateFacilitySettingsUseCase,
  updateMySettingsUseCase,
} from '@features/settings';

jest.mock('@features/settings/settings.api', () => ({
  getMySettingsApi: jest.fn(),
  patchMySettingsApi: jest.fn(),
  getFacilitySettingsApi: jest.fn(),
  patchFacilitySettingsApi: jest.fn(),
}));

describe('settings.usecase', () => {
  beforeEach(() => {
    getMySettingsApi.mockResolvedValue({
      data: {
        data: {
          settings: {
            account: { id: 'user-1', name: 'Ada Clinician' },
            activeFacilityId: 'facility-1',
            displayPreferences: { themePreference: 'dark' },
            memberships: [],
          },
        },
      },
    });
    patchMySettingsApi.mockResolvedValue({
      data: { data: { settings: { privacyControls: { shareUsageDiagnostics: true } } } },
    });
    getFacilitySettingsApi.mockResolvedValue({
      data: { data: { settings: { facility: { id: 'facility-1', name: 'ICU' } } } },
    });
    patchFacilitySettingsApi.mockResolvedValue({
      data: { data: { settings: { modelVisibility: { liveClinicalPredictionEnabled: true } } } },
    });
  });

  it('loads and normalizes user settings', async () => {
    const settings = await loadMySettingsUseCase();

    expect(settings.account.name).toBe('Ada Clinician');
    expect(settings.displayPreferences.themePreference).toBe('dark');
    expect(settings.offlineSyncPreferences.conflictResolutionMode).toBe('manual_review');
    expect(settings.privacyControls.requireUnlockForIdentifiers).toBe(true);
  });

  it('updates user settings', async () => {
    const settings = await updateMySettingsUseCase({
      privacyControls: { shareUsageDiagnostics: true },
    });

    expect(patchMySettingsApi).toHaveBeenCalledWith({
      privacyControls: { shareUsageDiagnostics: true },
    });
    expect(settings.privacyControls.shareUsageDiagnostics).toBe(true);
  });

  it('loads facility settings with safe model visibility defaults', async () => {
    const settings = await loadFacilitySettingsUseCase('facility-1');

    expect(settings.facility.name).toBe('ICU');
    expect(settings.modelVisibility.liveClinicalPredictionEnabled).toBe(false);
    expect(settings.workflowSettings.lockReviewedClinicalRecords).toBe(true);
  });

  it('does not expose enabled model visibility even if a response is unsafe', async () => {
    const settings = await updateFacilitySettingsUseCase('facility-1', {
      modelVisibility: { liveClinicalPredictionEnabled: false },
    });

    expect(settings.modelVisibility.liveClinicalPredictionEnabled).toBe(false);
    expect(settings.modelVisibility.clinicianVisibleModelVersionIds).toEqual([]);
  });
});
