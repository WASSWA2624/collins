/**
 * Dataset Capture Use Case Tests
 * File: datasetCapture.usecase.test.js
 */
jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

jest.mock('@features/dataset-capture/datasetCapture.api', () => ({
  createDatasetImportApi: jest.fn(),
  parseDatasetNoteApi: jest.fn(),
}));

const { queueRequestIfOffline } = require('@offline/request');
const { createDatasetImportApi } = require('@features/dataset-capture/datasetCapture.api');
const {
  submitDatasetCaptureCandidateUseCase,
} = require('@features/dataset-capture');

describe('datasetCapture.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queues only structured review payloads while offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    const result = await submitDatasetCaptureCandidateUseCase({
      facilityId: 'facility-1',
      fieldValues: {
        'patient.ageYears': '54',
        'patient.sexForSizeCalculations': 'FEMALE',
        'clinicalSnapshot.spo2': '93',
      },
      clientRecordId: 'capture-1',
      idempotencyKey: 'capture-idem-1',
      submittedAt: '2026-05-05T00:00:00.000Z',
      noteText: 'MRN H123 should not be queued',
    });

    const request = queueRequestIfOffline.mock.calls[0][0];
    const serialized = JSON.stringify(request.body);

    expect(result.queued).toBe(true);
    expect(request.method).toBe('POST');
    expect(request.body.structuredPreviewJson.patient.ageYears).toBe(54);
    expect(request.body.governanceJson.rawNoteStored).toBe(false);
    expect(request.body.noteText).toBeUndefined();
    expect(serialized).not.toMatch(/MRN|H123|patientName/i);
    expect(createDatasetImportApi).not.toHaveBeenCalled();
  });

  it('submits structured candidates online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);
    createDatasetImportApi.mockResolvedValue({
      data: {
        data: {
          datasetCase: {
            id: 'dataset-1',
            reviewStatus: 'SUBMITTED',
          },
        },
      },
    });

    const result = await submitDatasetCaptureCandidateUseCase({
      facilityId: 'facility-1',
      fieldValues: { 'patient.ageYears': '54' },
      clientRecordId: 'capture-1',
      idempotencyKey: 'capture-idem-1',
      submittedAt: '2026-05-05T00:00:00.000Z',
    });

    expect(result.queued).toBe(false);
    expect(result.datasetCase.id).toBe('dataset-1');
    expect(createDatasetImportApi).toHaveBeenCalledTimes(1);
  });
});
