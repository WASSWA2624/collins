/**
 * useDatasetCaptureScreen
 * Shared clinical dataset capture workflow.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  canCaptureDatasetCandidate,
  clearDatasetCaptureDraft,
  createDatasetCaptureDraftIdentity,
  createEmptyDatasetCapturePreview,
  DEFAULT_DATASET_CAPTURE_FIELD_VALUES,
  flattenDatasetPreview,
  getDatasetCaptureCompleteness,
  getDatasetCaptureSections,
  hasAnyDatasetCaptureValue,
  loadDatasetCaptureDraft,
  resolveDatasetCaptureFacilityId,
  saveDatasetCaptureDraft,
  submitDatasetCaptureCandidateUseCase,
  validateDatasetCaptureFieldValues,
} from '@features/dataset-capture';
import { useAuth, useNetwork } from '@hooks';
import { DATASET_CAPTURE_TEST_IDS } from './types';

const createInitialFieldValues = () => flattenDatasetPreview(createEmptyDatasetCapturePreview());

const getFieldEntered = (fieldValues, path) => {
  const value = fieldValues[path];
  const defaultValue = DEFAULT_DATASET_CAPTURE_FIELD_VALUES[path];
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== '' &&
    (defaultValue === undefined || String(value) !== String(defaultValue))
  );
};

const hasStepValidationIssues = (step) =>
  Boolean(step?.missingFieldDetails?.length || step?.invalidFieldDetails?.length);

const buildAttemptedStepMap = (steps = []) =>
  steps.reduce((acc, step) => {
    if (step?.id) acc[step.id] = true;
    return acc;
  }, {});

const buildSectionProgress = (sections, fieldValues, activeStepIndex) =>
  sections.map((section, index) => {
    const requiredFields = section.fields.filter((field) => field.required);
    const validation = validateDatasetCaptureFieldValues(fieldValues, { sectionId: section.id });
    const missingFieldDetails = validation.errorDetails.filter((field) => field.category === 'required');
    const invalidFieldDetails = validation.errorDetails.filter((field) => field.category !== 'required');
    const missingFields = missingFieldDetails.map((field) => field.path);
    const enteredTotal = section.fields.filter((field) => getFieldEntered(fieldValues, field.path)).length;
    const requiredIncomplete = new Set(
      validation.errorDetails
        .filter((field) => requiredFields.some((requiredField) => requiredField.path === field.path))
        .map((field) => field.path)
    );
    const requiredComplete = requiredFields.length - requiredIncomplete.size;
    const complete = requiredFields.length > 0
      ? validation.errorDetails.length === 0
      : enteredTotal > 0 && invalidFieldDetails.length === 0;
    const status = invalidFieldDetails.length > 0
      ? 'invalid'
      : missingFieldDetails.length > 0
        ? 'missing'
        : complete
          ? 'complete'
          : enteredTotal > 0
            ? 'inProgress'
            : 'notStarted';

    return {
      id: section.id,
      title: section.title,
      stepNumber: index + 1,
      totalFields: section.fields.length,
      enteredTotal,
      requiredTotal: requiredFields.length,
      requiredComplete,
      missingFields,
      missingFieldDetails,
      invalidFields: invalidFieldDetails.map((field) => field.path),
      invalidFieldDetails,
      complete,
      active: index === activeStepIndex,
      issueCount: missingFieldDetails.length + invalidFieldDetails.length,
      status,
    };
  });

export default function useDatasetCaptureScreen() {
  const { activeFacilityId, roles, user } = useAuth();
  const { isOffline } = useNetwork();
  const [fieldValues, setFieldValues] = useState(createInitialFieldValues);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [lastCompletedStepIndex, setLastCompletedStepIndex] = useState(0);
  const [draftIdentity, setDraftIdentity] = useState(createDatasetCaptureDraftIdentity);
  const [draftStatus, setDraftStatus] = useState('loading');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [lastSubmittedCaseId, setLastSubmittedCaseId] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [attemptedStepIds, setAttemptedStepIds] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [navigationIssue, setNavigationIssue] = useState(null);
  const draftLoadedRef = useRef(false);
  const skipNextDraftSaveRef = useRef(false);
  const submittingRef = useRef(false);

  const sections = useMemo(() => getDatasetCaptureSections(), []);
  const activeSection = sections[activeStepIndex] || sections[0] || null;
  const facilityId = useMemo(
    () => activeFacilityId || resolveDatasetCaptureFacilityId(user),
    [activeFacilityId, user]
  );
  const userId = user?.id || user?.userId || user?.sub || null;
  const draftScope = useMemo(() => ({ userId, facilityId }), [facilityId, userId]);
  const captureAllowed = useMemo(() => canCaptureDatasetCandidate(roles), [roles]);
  const completeness = useMemo(() => getDatasetCaptureCompleteness(fieldValues), [fieldValues]);
  const activeStepValidation = useMemo(
    () => validateDatasetCaptureFieldValues(fieldValues, { sectionId: activeSection?.id }),
    [activeSection?.id, fieldValues]
  );
  const hasEnteredValues = useMemo(() => hasAnyDatasetCaptureValue(fieldValues), [fieldValues]);
  const sectionProgress = useMemo(
    () => buildSectionProgress(sections, fieldValues, activeStepIndex),
    [activeStepIndex, fieldValues, sections]
  );
  const activeStep = sectionProgress[activeStepIndex] || null;
  const visibleFieldErrors = useMemo(() => {
    const visible = {};
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        const message = completeness.fieldErrors[field.path];
        if (!message) return;
        if (submitAttempted || attemptedStepIds[section.id] || touchedFields[field.path]) {
          visible[field.path] = message;
        }
      });
    });
    return visible;
  }, [attemptedStepIds, completeness.fieldErrors, sections, submitAttempted, touchedFields]);
  const progressPercent = sections.length > 0
    ? Math.round(((activeStepIndex + 1) / sections.length) * 100)
    : 0;

  useEffect(() => {
    let mounted = true;
    draftLoadedRef.current = false;
    setDraftStatus('loading');

    loadDatasetCaptureDraft(draftScope).then((result) => {
      if (!mounted) return;
      skipNextDraftSaveRef.current = true;
      if (result?.draft) {
        setFieldValues({ ...createInitialFieldValues(), ...result.draft.fieldValues });
        setActiveStepIndex(Math.min(result.draft.activeStepIndex || 0, Math.max(sections.length - 1, 0)));
        setLastCompletedStepIndex(Math.min(result.draft.lastCompletedStepIndex || 0, Math.max(sections.length - 1, 0)));
        setDraftIdentity({
          clientRecordId: result.draft.clientRecordId,
          idempotencyKey: result.draft.idempotencyKey,
        });
      } else {
        setFieldValues(createInitialFieldValues());
        setActiveStepIndex(0);
        setLastCompletedStepIndex(0);
        setDraftIdentity(createDatasetCaptureDraftIdentity());
      }
      setDraftStatus(result?.ok === false ? 'error' : result?.draft ? 'loaded' : 'ready');
      draftLoadedRef.current = true;
    });

    return () => {
      mounted = false;
    };
  }, [draftScope, sections.length]);

  useEffect(() => {
    if (!draftLoadedRef.current) return;
    if (skipNextDraftSaveRef.current) {
      skipNextDraftSaveRef.current = false;
      return;
    }
    let cancelled = false;
    setDraftStatus('saving');

    const timeoutId = setTimeout(() => {
      if (!hasEnteredValues && activeStepIndex === 0) {
        clearDatasetCaptureDraft(draftScope).then((result) => {
          if (cancelled) return;
          setDraftStatus(result?.ok ? 'ready' : 'error');
        });
        return;
      }
      saveDatasetCaptureDraft({
        ...draftIdentity,
        fieldValues,
        activeStepIndex,
        lastCompletedStepIndex,
      }, draftScope).then((result) => {
        if (cancelled) return;
        setDraftStatus(result?.ok ? 'saved' : 'error');
      });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeStepIndex, draftIdentity, draftScope, fieldValues, hasEnteredValues, lastCompletedStepIndex]);

  const handleFieldChange = useCallback((path, value) => {
    if (submitStatus === 'queued') {
      setDraftIdentity(createDatasetCaptureDraftIdentity());
    }
    setSubmitMessage('');
    setNavigationIssue(null);
    setSubmitStatus('idle');
    setLastSubmittedCaseId(null);
    setTouchedFields((current) => ({ ...current, [path]: true }));
    setFieldValues((current) => ({ ...current, [path]: value }));
  }, [submitStatus]);

  const handleGoToStep = useCallback((index) => {
    const next = Number(index);
    if (!Number.isInteger(next)) return;
    if (next < 0 || next >= sections.length) return;

    if (next > activeStepIndex) {
      const priorStepsWithIssues = sectionProgress
        .slice(0, next)
        .filter(hasStepValidationIssues);

      if (priorStepsWithIssues.length > 0) {
        const firstIssueStep = priorStepsWithIssues[0];
        setAttemptedStepIds((current) => ({
          ...current,
          ...buildAttemptedStepMap(priorStepsWithIssues),
        }));
        setNavigationIssue({
          stepNumber: firstIssueStep.stepNumber,
          title: firstIssueStep.title,
          issueCount: firstIssueStep.issueCount,
        });
        setSubmitMessage('stepMissing');
      } else {
        setNavigationIssue(null);
        setSubmitMessage('');
      }
    } else {
      setNavigationIssue(null);
      setSubmitMessage('');
    }

    setActiveStepIndex(next);
  }, [activeStepIndex, sectionProgress, sections.length]);

  const handleNextStep = useCallback(() => {
    if (!activeStepValidation.valid) {
      setSubmitStatus('idle');
      setSubmitMessage('stepInvalid');
      setAttemptedStepIds((current) => ({ ...current, [activeSection?.id]: true }));
      setNavigationIssue({
        stepNumber: activeStepIndex + 1,
        title: activeSection?.title || '',
        issueCount: activeStepValidation.errorDetails.length,
      });
      return;
    }
    setLastCompletedStepIndex((current) => Math.max(current, activeStepIndex));
    setActiveStepIndex((current) => Math.min(current + 1, Math.max(sections.length - 1, 0)));
    setSubmitMessage('');
    setNavigationIssue(null);
  }, [activeSection?.id, activeSection?.title, activeStepIndex, activeStepValidation.errorDetails.length, activeStepValidation.valid, sections.length]);

  const handlePreviousStep = useCallback(() => {
    setActiveStepIndex((current) => Math.max(current - 1, 0));
  }, []);

  const handleReset = useCallback(async () => {
    await clearDatasetCaptureDraft(draftScope);
    setFieldValues(createInitialFieldValues());
    setActiveStepIndex(0);
    setLastCompletedStepIndex(0);
    setDraftIdentity(createDatasetCaptureDraftIdentity());
    setDraftStatus('ready');
    setSubmitStatus('idle');
    setSubmitMessage('');
    setLastSubmittedCaseId(null);
    setTouchedFields({});
    setAttemptedStepIds({});
    setSubmitAttempted(false);
    setNavigationIssue(null);
  }, [draftScope]);

  const handleSubmitForReview = useCallback(async () => {
    if (submittingRef.current || submitStatus === 'queued') return;
    if (!captureAllowed || !facilityId || !hasEnteredValues) {
      setSubmitStatus('idle');
      setSubmitMessage('reviewInvalid');
      return;
    }
    setSubmitAttempted(true);
    if (!completeness.isValid) {
      const firstIssueStep = sectionProgress.find(hasStepValidationIssues);
      setAttemptedStepIds(buildAttemptedStepMap(sectionProgress));
      setSubmitStatus('idle');
      setSubmitMessage('reviewInvalid');
      if (firstIssueStep) {
        setActiveStepIndex(firstIssueStep.stepNumber - 1);
        setNavigationIssue({
          stepNumber: firstIssueStep.stepNumber,
          title: firstIssueStep.title,
          issueCount: firstIssueStep.issueCount,
        });
      }
      return;
    }
    submittingRef.current = true;
    setSubmitStatus('loading');
    setSubmitMessage('submitting');
    setNavigationIssue(null);
    setLastSubmittedCaseId(null);

    const submittedAt = new Date().toISOString();
    try {
      const result = await submitDatasetCaptureCandidateUseCase({
        facilityId,
        fieldValues,
        clientRecordId: draftIdentity.clientRecordId,
        idempotencyKey: draftIdentity.idempotencyKey,
        submittedAt,
      });
      setSubmitStatus(result?.queued ? 'queued' : 'submitted');
      setSubmitMessage(result?.queued ? 'queued' : 'submitted');
      setLastSubmittedCaseId(result?.datasetCase?.id || null);
      if (!result?.queued) {
        await clearDatasetCaptureDraft(draftScope);
        setFieldValues(createInitialFieldValues());
        setActiveStepIndex(0);
        setLastCompletedStepIndex(0);
        setDraftIdentity(createDatasetCaptureDraftIdentity());
        setDraftStatus('ready');
        setTouchedFields({});
        setAttemptedStepIds({});
        setSubmitAttempted(false);
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('error');
    } finally {
      submittingRef.current = false;
    }
  }, [
    captureAllowed,
    completeness.isValid,
    draftIdentity.clientRecordId,
    draftIdentity.idempotencyKey,
    draftScope,
    facilityId,
    fieldValues,
    hasEnteredValues,
    sectionProgress,
    submitStatus,
  ]);

  const submitDisabled =
    !captureAllowed ||
    !facilityId ||
    !hasEnteredValues ||
    submitStatus === 'loading' ||
    submitStatus === 'queued';

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
        draftStatus,
        facilityId,
        fieldErrors: visibleFieldErrors,
        fieldValues,
        hasEnteredValues,
        isOffline,
        lastSubmittedCaseId,
        missingFields: completeness.missingFields,
        missingFieldDetails: completeness.missingFieldDetails,
        navigationIssue,
        submitAttempted,
        validationErrorDetails: completeness.validationErrorDetails,
        validationFieldErrors: completeness.fieldErrors,
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
      draftStatus,
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
      navigationIssue,
      progressPercent,
      sectionProgress,
      sections,
      submitDisabled,
      submitAttempted,
      submitMessage,
      submitStatus,
      visibleFieldErrors,
    ]
  );
}
