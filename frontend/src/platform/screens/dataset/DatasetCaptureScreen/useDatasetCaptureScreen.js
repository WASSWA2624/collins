/**
 * useDatasetCaptureScreen
 * Shared clinical dataset capture workflow.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  canCaptureDatasetCandidate,
  createEmptyDatasetCapturePreview,
  flattenDatasetPreview,
  getDatasetCaptureCompleteness,
  getDatasetCaptureSections,
  hasAnyDatasetCaptureValue,
  resolveDatasetCaptureFacilityId,
  submitDatasetCaptureCandidateUseCase,
} from '@features/dataset-capture';
import { useAuth, useNetwork } from '@hooks';
import { DATASET_CAPTURE_TEST_IDS } from './types';

const createInitialFieldValues = () => flattenDatasetPreview(createEmptyDatasetCapturePreview());

export default function useDatasetCaptureScreen() {
  const { activeFacilityId, roles, user } = useAuth();
  const { isOffline } = useNetwork();
  const [fieldValues, setFieldValues] = useState(createInitialFieldValues);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [lastSubmittedCaseId, setLastSubmittedCaseId] = useState(null);

  const sections = useMemo(() => getDatasetCaptureSections(), []);
  const facilityId = useMemo(
    () => activeFacilityId || resolveDatasetCaptureFacilityId(user),
    [activeFacilityId, user]
  );
  const captureAllowed = useMemo(() => canCaptureDatasetCandidate(roles), [roles]);
  const completeness = useMemo(() => getDatasetCaptureCompleteness(fieldValues), [fieldValues]);
  const hasEnteredValues = useMemo(() => hasAnyDatasetCaptureValue(fieldValues), [fieldValues]);

  const handleFieldChange = useCallback((path, value) => {
    setSubmitMessage('');
    setLastSubmittedCaseId(null);
    setFieldValues((current) => ({ ...current, [path]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFieldValues(createInitialFieldValues());
    setSubmitStatus('idle');
    setSubmitMessage('');
    setLastSubmittedCaseId(null);
  }, []);

  const handleSubmitForReview = useCallback(async () => {
    if (!captureAllowed || !facilityId || !hasEnteredValues || completeness.missingFields.length > 0) return;
    setSubmitStatus('loading');
    setSubmitMessage('');
    setLastSubmittedCaseId(null);

    const submittedAt = new Date().toISOString();
    try {
      const result = await submitDatasetCaptureCandidateUseCase({
        facilityId,
        fieldValues,
        submittedAt,
      });
      setSubmitStatus(result?.queued ? 'queued' : 'submitted');
      setSubmitMessage(result?.queued ? 'queued' : 'submitted');
      setLastSubmittedCaseId(result?.datasetCase?.id || null);
      setFieldValues(createInitialFieldValues());
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('error');
    }
  }, [captureAllowed, completeness.missingFields.length, facilityId, fieldValues, hasEnteredValues]);

  const submitDisabled =
    !captureAllowed ||
    !facilityId ||
    !hasEnteredValues ||
    completeness.missingFields.length > 0 ||
    submitStatus === 'loading';

  return useMemo(
    () => ({
      testIds: DATASET_CAPTURE_TEST_IDS,
      sections,
      capture: {
        captureAllowed,
        completeness,
        facilityId,
        fieldValues,
        hasEnteredValues,
        isOffline,
        lastSubmittedCaseId,
        missingFields: completeness.missingFields,
        submitDisabled,
        submitMessage,
        submitStatus,
        onFieldChange: handleFieldChange,
        onReset: handleReset,
        onSubmitForReview: handleSubmitForReview,
      },
    }),
    [
      captureAllowed,
      completeness,
      facilityId,
      fieldValues,
      handleFieldChange,
      handleReset,
      handleSubmitForReview,
      hasEnteredValues,
      isOffline,
      lastSubmittedCaseId,
      sections,
      submitDisabled,
      submitMessage,
      submitStatus,
    ]
  );
}
