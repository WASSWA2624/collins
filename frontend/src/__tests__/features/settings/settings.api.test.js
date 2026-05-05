/**
 * Settings API Tests
 */
import { apiClient } from '@services/api';
import { endpoints } from '@config/endpoints';
import {
  getFacilitySettingsApi,
  getMySettingsApi,
  patchFacilitySettingsApi,
  patchMySettingsApi,
} from '@features/settings';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
}));

describe('settings.api', () => {
  beforeEach(() => {
    apiClient.mockClear();
  });

  it('calls user and facility settings endpoints', async () => {
    await getMySettingsApi();
    await patchMySettingsApi({ privacyControls: { shareUsageDiagnostics: false } });
    await getFacilitySettingsApi('facility-1');
    await patchFacilitySettingsApi('facility-1', {
      workflowSettings: { requireReasonForClinicalOverride: true },
    });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SETTINGS.ME,
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SETTINGS.ME,
      method: 'PATCH',
      body: { privacyControls: { shareUsageDiagnostics: false } },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SETTINGS.FACILITY('facility-1'),
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SETTINGS.FACILITY('facility-1'),
      method: 'PATCH',
      body: { workflowSettings: { requireReasonForClinicalOverride: true } },
    });
  });
});
