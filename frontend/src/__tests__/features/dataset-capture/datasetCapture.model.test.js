/**
 * Dataset Capture Model Tests
 * File: datasetCapture.model.test.js
 */
const {
  buildDatasetCaptureSubmission,
  canApproveTrainingDataset,
  canCaptureDatasetCandidate,
  parseDatasetCaptureNote,
} = require('@features/dataset-capture');

describe('datasetCapture.model', () => {
  it('parses pasted ICU notes into structured editable preview fields', () => {
    const draft = parseDatasetCaptureNote(
      'Patient name Jane, hospital number H123. COPD age 54 male. SpO2 92 FiO2 40% RR 28 pH 7.31 PaO2 70 PaCO2 50 HCO3 24 lactate 2.1 mode VC VT 450 set RR 20 PEEP 8 plateau 24 peak 30 target SpO2 88-92.'
    );

    expect(draft.structuredPreviewJson.captureMetadata.schemaVersion).toBe('clinical_case_v1');
    expect(draft.structuredPreviewJson.caseContext.primaryDiagnosis).toBe('COPD');
    expect(draft.structuredPreviewJson.patient.ageYears).toBe(54);
    expect(draft.structuredPreviewJson.patient.sexForSizeCalculations).toBe('MALE');
    expect(draft.structuredPreviewJson.clinicalSnapshot.fio2).toBe(0.4);
    expect(draft.structuredPreviewJson.abgTest.paco2).toBe(50);
    expect(draft.structuredPreviewJson.ventilatorSetting.peep).toBe(8);
    expect(draft.structuredPreviewJson.targetRanges.spo2Lower).toBe(88);
    expect(draft.identifierWarnings).toContain('identifier_like_field_detected');
    expect(draft.noteStorage).toBe('raw_note_not_saved');
  });

  it('builds submission payloads without raw notes or patient identifiers', () => {
    const draft = parseDatasetCaptureNote('MRN H123 age 54 female SpO2 93 FiO2 0.5 RR 24');
    const submission = buildDatasetCaptureSubmission({
      facilityId: 'facility-1',
      fieldValues: draft.fieldValues,
      clientRecordId: 'capture-1',
      idempotencyKey: 'capture-idem-1',
      submittedAt: '2026-05-05T00:00:00.000Z',
    });
    const serialized = JSON.stringify(submission);

    expect(submission.sourceType).toBe('clinical_case_capture');
    expect(submission.governanceJson.captureType).toBe('structured_clinician_entry');
    expect(submission.governanceJson.rawNoteStored).toBe(false);
    expect(submission.governanceJson.externalModelServicesUsed).toBe(false);
    expect(submission.structuredPreviewJson.captureMetadata.schemaVersion).toBe('clinical_case_v1');
    expect(submission.structuredPreviewJson.patient.ageYears).toBe(54);
    expect(submission.noteText).toBeUndefined();
    expect(serialized).not.toMatch(/MRN|H123|patientName/i);
  });

  it('separates capture roles from training approval roles', () => {
    expect(canCaptureDatasetCandidate(['clinician'])).toBe(true);
    expect(canApproveTrainingDataset(['clinician'])).toBe(false);
    expect(canApproveTrainingDataset(['research_governance_officer'])).toBe(true);
  });
});
