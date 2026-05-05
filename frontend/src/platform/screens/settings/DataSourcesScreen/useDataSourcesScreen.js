/**
 * useDataSourcesScreen
 * Shared logic: dataset meta, sources, and capture candidate state.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  getDefaultVentilationDataset,
  getVentilationDatasetMeta,
  getVentilationDatasetSources,
} from '@features/ventilation/ventilation.model';
import {
  DATASET_CAPTURE_FIELD_DEFINITIONS,
  canApproveTrainingDataset,
  canCaptureDatasetCandidate,
  getMissingDatasetFields,
  hydrateDatasetPreview,
  parseDatasetCaptureNote,
  resolveDatasetCaptureFacilityId,
  submitDatasetCaptureCandidateUseCase,
} from '@features/dataset-capture';
import { useAuth, useNetwork } from '@hooks';
import { DATA_SOURCES_TEST_IDS } from './types';

export default function useDataSourcesScreen() {
  const { user, roles } = useAuth();
  const { isOffline } = useNetwork();
  const dataset = getDefaultVentilationDataset();
  const meta = useMemo(() => getVentilationDatasetMeta(dataset), [dataset]);
  const sources = useMemo(() => getVentilationDatasetSources(dataset) ?? [], [dataset]);
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const facilityId = useMemo(() => resolveDatasetCaptureFacilityId(user), [user]);
  const captureAllowed = useMemo(() => canCaptureDatasetCandidate(roles), [roles]);
  const trainingApprovalAllowed = useMemo(() => canApproveTrainingDataset(roles), [roles]);
  const [noteText, setNoteText] = useState('');
  const [fieldValues, setFieldValues] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [uncertaintyFields, setUncertaintyFields] = useState([]);
  const [identifierWarnings, setIdentifierWarnings] = useState([]);
  const [previewCreated, setPreviewCreated] = useState(false);
  const [parseStatus, setParseStatus] = useState('idle');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const structuredPreviewJson = useMemo(
    () => (previewCreated ? hydrateDatasetPreview(fieldValues) : null),
    [fieldValues, previewCreated]
  );

  const handleParseNote = useCallback(() => {
    setSubmitMessage('');
    if (!noteText.trim()) {
      setParseStatus('empty');
      setPreviewCreated(false);
      return;
    }

    const draft = parseDatasetCaptureNote(noteText);
    setFieldValues(draft.fieldValues);
    setMissingFields(draft.missingFields);
    setUncertaintyFields(draft.uncertaintyFields);
    setIdentifierWarnings(draft.identifierWarnings);
    setPreviewCreated(true);
    setParseStatus('parsed');
  }, [noteText]);

  const handleFieldChange = useCallback((path, value) => {
    setSubmitMessage('');
    setFieldValues((current) => {
      const next = { ...current, [path]: value };
      setMissingFields(getMissingDatasetFields(hydrateDatasetPreview(next)));
      return next;
    });
  }, []);

  const handleSubmitForReview = useCallback(async () => {
    if (!captureAllowed || !facilityId || !previewCreated) return;
    setSubmitStatus('loading');
    setSubmitMessage('');

    const submittedAt = new Date().toISOString();
    try {
      const result = await submitDatasetCaptureCandidateUseCase({
        facilityId,
        fieldValues,
        submittedAt,
      });
      setSubmitStatus(result?.queued ? 'queued' : 'submitted');
      setSubmitMessage(result?.queued ? 'queued' : 'submitted');
      setNoteText('');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error?.code || 'error');
    }
  }, [captureAllowed, facilityId, fieldValues, previewCreated]);

  const submitDisabled = !captureAllowed || !facilityId || !previewCreated || submitStatus === 'loading';

  return useMemo(
    () => ({
      testIds: DATA_SOURCES_TEST_IDS,
      meta,
      sources,
      hasSources,
      capture: {
        fields: DATASET_CAPTURE_FIELD_DEFINITIONS,
        noteText,
        fieldValues,
        structuredPreviewJson,
        missingFields,
        uncertaintyFields,
        identifierWarnings,
        hasIdentifierWarnings: identifierWarnings.length > 0,
        previewCreated,
        parseStatus,
        submitStatus,
        submitMessage,
        submitDisabled,
        captureAllowed,
        trainingApprovalAllowed,
        facilityId,
        isOffline,
        onNoteTextChange: setNoteText,
        onParseNote: handleParseNote,
        onFieldChange: handleFieldChange,
        onSubmitForReview: handleSubmitForReview,
      },
    }),
    [
      captureAllowed,
      facilityId,
      fieldValues,
      handleFieldChange,
      handleParseNote,
      handleSubmitForReview,
      hasSources,
      identifierWarnings,
      isOffline,
      meta,
      missingFields,
      noteText,
      parseStatus,
      previewCreated,
      sources,
      structuredPreviewJson,
      submitDisabled,
      submitMessage,
      submitStatus,
      trainingApprovalAllowed,
      uncertaintyFields,
    ]
  );
}
