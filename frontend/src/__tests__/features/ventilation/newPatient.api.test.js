/**
 * New Patient API Tests
 * File: newPatient.api.test.js
 */
import { addToQueue } from '@offline/queue';
import { queueRequestIfOffline } from '@offline/request';
import { apiClient } from '@services/api';
import {
  createNewPatientClientRecordId,
  getNewPatientVentilatorRecommendationApi,
  saveNewPatientReviewStepApi,
  saveOxygenAbgVentilatorStepApi,
  savePatientReasonStepApi,
} from '@features/ventilation/newPatient.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

jest.mock('@offline/queue', () => ({
  addToQueue: jest.fn(),
}));

describe('new patient three-step API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queueRequestIfOffline.mockResolvedValue(false);
    addToQueue.mockResolvedValue(true);
  });

  it('generates URL-safe client record identifiers', () => {
    expect(createNewPatientClientRecordId()).toMatch(/^new-patient-[a-z0-9]+-[a-z0-9]+$/);
  });

  it('posts patient and reason step to the three-step endpoint', async () => {
    apiClient.mockResolvedValue({
      data: {
        data: {
          step: 'patient_reason',
          admission: { id: 'admission-1' },
          syncStatus: 'synced',
        },
      },
    });

    const result = await savePatientReasonStepApi({
      facilityId: 'facility-1',
      clientRecordId: 'client-admission-1',
    });

    expect(apiClient).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      url: expect.stringContaining('/new-patients/three-step/patient-reason'),
    }));
    expect(result.admission.id).toBe('admission-1');
  });

  it('queues dependent steps by admission identifier while offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    const result = await saveOxygenAbgVentilatorStepApi('client-admission-1', {
      clientRecordId: 'client-admission-1',
      facilityId: 'facility-1',
    });

    expect(apiClient).not.toHaveBeenCalled();
    expect(queueRequestIfOffline).toHaveBeenCalledWith(expect.objectContaining({
      facilityId: 'facility-1',
      method: 'POST',
      url: expect.stringContaining('/new-patients/client-admission-1/three-step/oxygen-abg-ventilator'),
    }));
    expect(result.syncStatus).toBe('queued');
  });

  it('queues idempotent review saves after retryable network failure', async () => {
    queueRequestIfOffline.mockResolvedValue(false);
    apiClient.mockRejectedValue({ code: 'NETWORK_ERROR' });

    const result = await saveNewPatientReviewStepApi('client-admission-1', {
      clientRecordId: 'client-admission-1',
      facilityId: 'facility-1',
      clinicianConfirmed: true,
    });

    expect(addToQueue).toHaveBeenCalledWith(expect.objectContaining({
      facilityId: 'facility-1',
      method: 'POST',
      url: expect.stringContaining('/new-patients/client-admission-1/three-step/save-review'),
    }));
    expect(result.syncStatus).toBe('queued');
  });

  it('requests backend dataset ventilator recommendations without queuing', async () => {
    apiClient.mockResolvedValue({
      data: {
        data: {
          recommendation: {
            source: { type: 'backend_dataset', confidenceTier: 'medium' },
            initialVentilatorSettings: {
              settings: { mode: 'VC', tidalVolume: 420, respiratoryRate: 18, peep: 8 },
            },
          },
        },
      },
    });

    const result = await getNewPatientVentilatorRecommendationApi({
      facilityId: 'facility-1',
      input: {
        condition: 'ARDS',
        spo2: 88,
        respiratoryRate: 28,
        heartRate: 110,
      },
    });

    expect(apiClient).toHaveBeenCalledWith(expect.objectContaining({
      facilityId: 'facility-1',
      method: 'POST',
      url: expect.stringContaining('/new-patients/ventilator-recommendation'),
    }));
    expect(result.recommendation.source.type).toBe('backend_dataset');
  });
});
