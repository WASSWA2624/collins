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

const validFieldValues = {
  'caseContext.primaryDiagnosis': 'COPD',
  'caseContext.reasonForVentilation': 'Hypercapnic respiratory failure',
  'patient.patientPathway': 'ADULT',
  'patient.ageYears': '54',
  'patient.sexForSizeCalculations': 'FEMALE',
  'clinicalSnapshot.spo2': '93',
  'clinicalSnapshot.fio2': '0.4',
  'clinicalSnapshot.respiratoryRate': '24',
  'abgTest.ph': '7.31',
  'abgTest.paco2': '50',
  'ventilatorSetting.mode': 'VC',
  'ventilatorSetting.tidalVolumeMl': '450',
  'ventilatorSetting.respiratoryRateSet': '20',
  'ventilatorSetting.peep': '8',
  'targetRanges.spo2Lower': '88',
  'targetRanges.spo2Upper': '92',
  'outcome.outcomeType': 'EXTUBATED',
  'outcome.referenceUseCategory': 'POSITIVE_REFERENCE',
  'provenance.sourceType': 'CLINICIAN_CHART_ABSTRACTION',
  'provenance.sourceName': 'ICU chart review',
  'provenance.clinicianValidationStatus': 'VALIDATED_BY_CLINICIAN',
  'quality.reviewerConfidence': 'HIGH',
};

describe('datasetCapture.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queues only structured review payloads while offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    const result = await submitDatasetCaptureCandidateUseCase({
      facilityId: 'facility-1',
      fieldValues: validFieldValues,
      clientRecordId: 'capture-1',
      idempotencyKey: 'capture-idem-1',
      submittedAt: '2026-05-05T00:00:00.000Z',
      noteText: 'MRN H123 should not be queued',
    });

    const request = queueRequestIfOffline.mock.calls[0][0];
    const serialized = JSON.stringify(request.body);

    expect(result.queued).toBe(true);
    expect(request.method).toBe('POST');
    expect(request.body.sourceType).toBe('clinical_case_capture');
    expect(request.body.structuredPreviewJson.patient.ageYears).toBe(54);
    expect(request.body.structuredPreviewJson.outcome.referenceUseCategory).toBe('POSITIVE_REFERENCE');
    expect(request.body.structuredPreviewJson.captureMetadata.outcomeReview.outcomeSentiment).toBe('positive');
    expect(request.body.structuredPreviewJson.caseContext.capturedAt).toBe('2026-05-05T00:00:00.000Z');
    expect(request.body.structuredPreviewJson.clinicalSnapshot.measuredAt).toBe('2026-05-05T00:00:00.000Z');
    expect(request.body.structuredPreviewJson.abgTest.collectedAt).toBe('2026-05-05T00:00:00.000Z');
    expect(request.body.structuredPreviewJson.ventilatorSetting.measuredAt).toBe('2026-05-05T00:00:00.000Z');
    expect(request.body.governanceJson.rawNoteStored).toBe(false);
    expect(request.body.governanceJson.pendingHumanReview).toBe(true);
    expect(request.body.governanceJson.outcomeReview.recommendationUse).toBe('eligible_positive_reference_after_review');
    expect(request.body.governanceJson.sourceProvenance.sourceType).toBe('CLINICIAN_CHART_ABSTRACTION');
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
      fieldValues: validFieldValues,
      clientRecordId: 'capture-1',
      idempotencyKey: 'capture-idem-1',
      submittedAt: '2026-05-05T00:00:00.000Z',
    });

    expect(result.queued).toBe(false);
    expect(result.datasetCase.id).toBe('dataset-1');
    expect(createDatasetImportApi.mock.calls[0][0].structuredPreviewJson.caseContext.capturedAt)
      .toBe('2026-05-05T00:00:00.000Z');
    expect(createDatasetImportApi.mock.calls[0][0].structuredPreviewJson.clinicalSnapshot.measuredAt)
      .toBe('2026-05-05T00:00:00.000Z');
    expect(createDatasetImportApi.mock.calls[0][0].structuredPreviewJson.abgTest.collectedAt)
      .toBe('2026-05-05T00:00:00.000Z');
    expect(createDatasetImportApi.mock.calls[0][0].structuredPreviewJson.ventilatorSetting.measuredAt)
      .toBe('2026-05-05T00:00:00.000Z');
    expect(createDatasetImportApi.mock.calls[0][0].structuredPreviewJson.captureMetadata.outcomeReview.outcomeSentiment)
      .toBe('positive');
    expect(createDatasetImportApi).toHaveBeenCalledTimes(1);
  });
});
