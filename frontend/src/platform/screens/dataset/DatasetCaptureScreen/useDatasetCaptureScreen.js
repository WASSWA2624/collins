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

const getFieldEntered = (fieldValues, path) => {
  const value = fieldValues[path];
  return value !== null && value !== undefined && String(value).trim() !== '';
};

const buildSectionProgress = (sections, fieldValues, activeStepIndex) =>
  sections.map((section, index) => {
    const requiredFields = section.fields.filter((field) => field.required);
    const missingFields = requiredFields
      .filter((field) => !getFieldEntered(fieldValues, field.path))
      .map((field) => field.path);
    const enteredTotal = section.fields.filter((field) => getFieldEntered(fieldValues, field.path)).length;
    const requiredComplete = requiredFields.length - missingFields.length;
    const complete = requiredFields.length > 0
      ? missingFields.length === 0
      : enteredTotal > 0;

    return {
      id: section.id,
      title: section.title,
      stepNumber: index + 1,
      totalFields: section.fields.length,
      enteredTotal,
      requiredTotal: requiredFields.length,
      requiredComplete,
      missingFields,
      complete,
      active: index === activeStepIndex,
    };
  });

export default function useDatasetCaptureScreen() {
  const { activeFacilityId, roles, user } = useAuth();
  const { isOffline } = useNetwork();
  const [fieldValues, setFieldValues] = useState(createInitialFieldValues);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [lastSubmittedCaseId, setLastSubmittedCaseId] = useState(null);

  const sections = useMemo(() => getDatasetCaptureSections(), []);
  const activeSection = sections[activeStepIndex] || sections[0] || null;
  const facilityId = useMemo(
    () => activeFacilityId || resolveDatasetCaptureFacilityId(user),
    [activeFacilityId, user]
  );
  const captureAllowed = useMemo(() => canCaptureDatasetCandidate(roles), [roles]);
  const completeness = useMemo(() => getDatasetCaptureCompleteness(fieldValues), [fieldValues]);
  const hasEnteredValues = useMemo(() => hasAnyDatasetCaptureValue(fieldValues), [fieldValues]);
  const sectionProgress = useMemo(
    () => buildSectionProgress(sections, fieldValues, activeStepIndex),
    [activeStepIndex, fieldValues, sections]
  );
  const activeStep = sectionProgress[activeStepIndex] || null;
  const progressPercent = sections.length > 0
    ? Math.round(((activeStepIndex + 1) / sections.length) * 100)
    : 0;

  const handleFieldChange = useCallback((path, value) => {
    setSubmitMessage('');
    setLastSubmittedCaseId(null);
    setFieldValues((current) => ({ ...current, [path]: value }));
  }, []);

  const handleGoToStep = useCallback((index) => {
    setActiveStepIndex((current) => {
      const next = Number(index);
      if (!Number.isInteger(next)) return current;
      if (next < 0 || next >= sections.length) return current;
      return next;
    });
  }, [sections.length]);

  const handleNextStep = useCallback(() => {
    setActiveStepIndex((current) => Math.min(current + 1, Math.max(sections.length - 1, 0)));
  }, [sections.length]);

  const handlePreviousStep = useCallback(() => {
    setActiveStepIndex((current) => Math.max(current - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setFieldValues(createInitialFieldValues());
    setActiveStepIndex(0);
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
      setActiveStepIndex(0);
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
      activeSection,
      activeStepIndex,
      canGoNext: activeStepIndex < sections.length - 1,
      canGoPrevious: activeStepIndex > 0,
      progressPercent,
      sectionProgress,
      stepCount: sections.length,
      capture: {
        activeStep,
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
        onGoToStep: handleGoToStep,
        onNextStep: handleNextStep,
        onPreviousStep: handlePreviousStep,
        onReset: handleReset,
        onSubmitForReview: handleSubmitForReview,
      },
    }),
    [
      activeSection,
      activeStep,
      activeStepIndex,
      captureAllowed,
      completeness,
      facilityId,
      fieldValues,
      handleFieldChange,
      handleGoToStep,
      handleNextStep,
      handlePreviousStep,
      handleReset,
      handleSubmitForReview,
      hasEnteredValues,
      isOffline,
      lastSubmittedCaseId,
      progressPercent,
      sectionProgress,
      sections,
      submitDisabled,
      submitMessage,
      submitStatus,
    ]
  );
}
