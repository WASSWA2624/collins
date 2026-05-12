/**
 * Shared Current Readings screen logic.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useNetwork } from '@hooks';
import {
  ABG_FIELD_DEFINITIONS,
  VITAL_SIGN_FIELD_DEFINITIONS,
  VENTILATOR_FIELD_DEFINITIONS,
  VENTILATOR_MODE_OPTIONS,
  getCurrentReadingsProgressAssessment,
  getCurrentReadingsAdvisoryFlags,
  getCurrentReadingsHistory,
  getCurrentReadingsMissingData,
  getLatestCurrentReadingsValues,
  listActiveAdmissionsUseCase,
  loadAdmissionCurrentReadingsContextUseCase,
  sanitizeCurrentReadingsFieldInput,
  submitCurrentReadingsUseCase,
  validateCurrentReadingsDraft,
} from '@features/currentReadings';
import { CURRENT_READINGS_TEST_IDS } from './types';

const INITIAL_VITALS_FORM = Object.freeze({
  spo2: '',
  heartRate: '',
  respiratoryRate: '',
  systolicBp: '',
  diastolicBp: '',
  meanArterialPressure: '',
  temperatureC: '',
});

const INITIAL_ABG_FORM = Object.freeze({
  ph: '',
  pao2: '',
  paco2: '',
  hco3: '',
  baseExcess: '',
  lactate: '',
  fio2AtSample: '',
  spo2AtSample: '',
});

const INITIAL_VENTILATOR_FORM = Object.freeze({
  mode: '',
  tidalVolumeMl: '',
  respiratoryRateSet: '',
  respiratoryRateMeasured: '',
  fio2: '',
  peep: '',
  pressureSupport: '',
  inspiratoryPressure: '',
  peakPressure: '',
  plateauPressure: '',
  ieRatio: '',
});

const toDisplayDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const formatAdmissionLabel = (admission) => {
  if (!admission) return '';
  const code = admission.appAdmissionCode || admission.id;
  const bed = admission.bedNumber ? `Bed ${admission.bedNumber}` : 'No bed';
  const pathway = admission.patient?.patientPathway || 'Pathway pending';
  return `${code} - ${bed} - ${pathway}`;
};

const createAdmissionOptions = (admissions) =>
  (Array.isArray(admissions) ? admissions : []).map((admission) => ({
    label: formatAdmissionLabel(admission),
    value: admission.id,
  }));

const createInitialStatus = () => ({
  kind: 'idle',
  message: '',
  conflict: null,
});

const TRACKING_PATIENTS_LOAD_ERROR =
  'Unable to load patients for tracking. Please check your connection and try again.';
const TRACKING_DETAIL_LOAD_ERROR =
  "Unable to load this patient's update form. Please return to the patient list and try again.";
const TRACKING_SAVE_ERROR =
  'Unable to save the update. Please review the information and try again.';

const getFirstParam = (value) => (Array.isArray(value) ? value[0] : value);

const normalizeSaveErrorMessage = (error) => {
  const code = String(error?.code || '').toUpperCase();
  if (code === 'VALIDATION_ERROR' || code === 'CURRENT_READINGS_EMPTY') {
    return TRACKING_SAVE_ERROR;
  }
  if (
    [
      'NETWORK_ERROR',
      'REQUEST_TIMEOUT',
      'BACKEND_HOST_UNREACHABLE',
      'BACKEND_UNAVAILABLE',
    ].includes(code)
  ) {
    return 'Unable to save the update. Please check your connection and try again.';
  }
  return TRACKING_SAVE_ERROR;
};

const normalizePatientListLoadErrorMessage = (error) => {
  const code = String(error?.code || '').toUpperCase();
  if (
    [
      'NETWORK_ERROR',
      'REQUEST_TIMEOUT',
      'BACKEND_HOST_UNREACHABLE',
      'BACKEND_UNAVAILABLE',
    ].includes(code)
  ) {
    return TRACKING_PATIENTS_LOAD_ERROR;
  }
  return TRACKING_PATIENTS_LOAD_ERROR;
};

const normalizeAdmissionDetailLoadErrorMessage = (error) => {
  const code = String(error?.code || '').toUpperCase();
  if (
    [
      'NETWORK_ERROR',
      'REQUEST_TIMEOUT',
      'BACKEND_HOST_UNREACHABLE',
      'BACKEND_UNAVAILABLE',
    ].includes(code)
  ) {
    return 'Unable to load tracking details for this patient. Please check your connection and try again.';
  }
  return TRACKING_DETAIL_LOAD_ERROR;
};

const getAdmissionPatientId = (admission) =>
  admission?.patientId || admission?.patient?.id || null;

const findAdmissionForRequestedContext = (
  admissions,
  { admissionId, patientId } = {}
) => {
  if (!Array.isArray(admissions)) return null;
  if (admissionId) {
    const byAdmission = admissions.find((item) => item.id === admissionId);
    if (byAdmission) return byAdmission;
  }
  if (patientId) {
    return (
      admissions.find((item) => getAdmissionPatientId(item) === patientId) ||
      null
    );
  }
  return null;
};

const buildPatientDetails = (admission) => {
  if (!admission) return [];
  const patient = admission.patient || {};
  const rows = [
    ['Admission', admission.appAdmissionCode || admission.id],
    ['Patient', patient.appPatientCode || admission.patientId || patient.id],
    ['Hospital number', patient.hospitalNumber],
    ['Bed', admission.bedNumber || 'No bed recorded'],
    ['Pathway', patient.patientPathway || 'Pathway pending'],
    ['Facility', admission.facility?.name],
    ['Admitted', toDisplayDate(admission.admittedAt)],
  ];

  return rows
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
    .map(([label, value]) => ({ label, value: String(value) }));
};

export default function useCurrentReadingsScreen() {
  const { isOffline } = useNetwork();
  const params = useLocalSearchParams();
  const initialAdmissionId = getFirstParam(params?.admissionId || params?.id);
  const initialPatientId = getFirstParam(params?.patientId);
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(
    initialAdmissionId || null
  );
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [vitals, setVitals] = useState({ ...INITIAL_VITALS_FORM });
  const [abg, setAbg] = useState({ ...INITIAL_ABG_FORM });
  const [ventilator, setVentilator] = useState({ ...INITIAL_VENTILATOR_FORM });
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmissionLoading, setIsAdmissionLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(createInitialStatus);

  const loadAdmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await listActiveAdmissionsUseCase();
      const list = Array.isArray(rows) ? rows : (rows?.items ?? []);
      setAdmissions(list);
      setSelectedAdmissionId((current) => {
        if (current) return current;
        return (
          findAdmissionForRequestedContext(list, {
            admissionId: initialAdmissionId,
            patientId: initialPatientId,
          })?.id ||
          initialAdmissionId ||
          list[0]?.id ||
          null
        );
      });
      setStatus((current) =>
        current.kind === 'load_error' ? createInitialStatus() : current
      );
    } catch (error) {
      setAdmissions([]);
      setSelectedAdmissionId(initialAdmissionId || null);
      setStatus({
        kind: 'load_error',
        message: normalizePatientListLoadErrorMessage(error),
        conflict: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [initialAdmissionId, initialPatientId]);

  const loadSelectedAdmission = useCallback(
    async (admissionId) => {
      if (!admissionId) {
        setSelectedAdmission(null);
        return;
      }
      setIsAdmissionLoading(true);
      try {
        const admission =
          await loadAdmissionCurrentReadingsContextUseCase(admissionId);
        setSelectedAdmission(
          admission ||
            admissions.find((item) => item.id === admissionId) ||
            null
        );
        setStatus((current) =>
          current.kind === 'load_error' ? createInitialStatus() : current
        );
      } catch (error) {
        const fallbackAdmission =
          admissions.find((item) => item.id === admissionId) || null;
        setSelectedAdmission(fallbackAdmission);
        setStatus((current) =>
          current.kind === 'idle' || !fallbackAdmission
            ? {
                kind: 'load_error',
                message: normalizeAdmissionDetailLoadErrorMessage(error),
                conflict: null,
              }
            : current
        );
      } finally {
        setIsAdmissionLoading(false);
      }
    },
    [admissions]
  );

  useEffect(() => {
    loadAdmissions();
  }, [loadAdmissions]);

  useEffect(() => {
    loadSelectedAdmission(selectedAdmissionId);
  }, [loadSelectedAdmission, selectedAdmissionId]);

  const setVitalsField = useCallback((field, value) => {
    setVitals((current) => ({
      ...current,
      [field]: sanitizeCurrentReadingsFieldInput(field, value),
    }));
    setStatus((current) =>
      ['error', 'synced', 'queued'].includes(current.kind)
        ? createInitialStatus()
        : current
    );
  }, []);

  const setAbgField = useCallback((field, value) => {
    setAbg((current) => ({
      ...current,
      [field]: sanitizeCurrentReadingsFieldInput(field, value),
    }));
    setStatus((current) =>
      ['error', 'synced', 'queued'].includes(current.kind)
        ? createInitialStatus()
        : current
    );
  }, []);

  const setVentilatorField = useCallback((field, value) => {
    setVentilator((current) => ({
      ...current,
      [field]: sanitizeCurrentReadingsFieldInput(field, value),
    }));
    setStatus((current) =>
      ['error', 'synced', 'queued'].includes(current.kind)
        ? createInitialStatus()
        : current
    );
  }, []);

  const resetForms = useCallback(() => {
    setVitals({ ...INITIAL_VITALS_FORM });
    setAbg({ ...INITIAL_ABG_FORM });
    setVentilator({ ...INITIAL_VENTILATOR_FORM });
  }, []);

  const selectAdmission = useCallback(
    (admissionId) => {
      setSelectedAdmissionId(admissionId || null);
      resetForms();
      setStatus(createInitialStatus());
    },
    [resetForms]
  );

  const validation = useMemo(
    () =>
      validateCurrentReadingsDraft({
        admissionId: selectedAdmissionId,
        admission: selectedAdmission,
        vitals,
        abg,
        ventilator,
      }),
    [abg, ventilator, vitals, selectedAdmission, selectedAdmissionId]
  );

  const handleSubmit = useCallback(async () => {
    if (isSaving) return;

    if (status.kind === 'load_error') {
      setStatus({
        kind: 'error',
        message:
          "Unable to load this patient's update form. Please return to the patient list and try again.",
        conflict: null,
      });
      return;
    }

    if (
      !selectedAdmissionId ||
      !selectedAdmission?.id ||
      selectedAdmission.id !== selectedAdmissionId
    ) {
      setStatus({
        kind: 'error',
        message:
          "Unable to load this patient's update form. Please return to the patient list and try again.",
        conflict: null,
      });
      return;
    }

    if (!validation.hasValues) {
      setStatus({
        kind: 'error',
        message:
          'Enter at least one current vital sign, ABG reading, or ventilator setting.',
        conflict: null,
      });
      return;
    }

    if (!validation.isValid) {
      setStatus({
        kind: 'error',
        message:
          'Some current readings need review. Please check the highlighted fields.',
        conflict: null,
      });
      return;
    }

    setIsSaving(true);
    setStatus({
      kind: 'saving',
      message: 'Saving current readings...',
      conflict: null,
    });
    try {
      const result = await submitCurrentReadingsUseCase({
        admissionId: selectedAdmissionId,
        vitals,
        abg,
        ventilator,
        isOnline: !isOffline,
      });

      if (result.syncStatus === 'queued') {
        setStatus({
          kind: 'queued',
          message: 'Saved to offline queue. It will retry when online.',
          progressAssessment: null,
          ventilatorRecommendation: null,
          recommendationError: null,
          conflict: null,
        });
        resetForms();
        return;
      }

      if (result.syncStatus === 'conflict') {
        setStatus({
          kind: 'conflict',
          message:
            'Newer clinical data exists. Refresh this admission before resubmitting.',
          conflict: result.conflict,
          progressAssessment: null,
          ventilatorRecommendation: null,
          recommendationError: null,
        });
        return;
      }

      setStatus({
        kind: 'synced',
        message:
          'Current monitor, ABG, and ventilator readings were saved successfully.',
        progressAssessment: result.progressAssessment,
        ventilatorRecommendation: result.ventilatorRecommendation,
        recommendationError: result.recommendationError,
        conflict: null,
      });
      resetForms();
      await loadSelectedAdmission(selectedAdmissionId);
      await loadAdmissions();
    } catch (error) {
      setStatus({
        kind: 'error',
        message: normalizeSaveErrorMessage(error),
        conflict: null,
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    abg,
    vitals,
    ventilator,
    selectedAdmission,
    selectedAdmissionId,
    isSaving,
    isOffline,
    resetForms,
    loadSelectedAdmission,
    loadAdmissions,
    status.kind,
    validation,
  ]);

  const admissionOptions = useMemo(() => {
    const hasSelectedInList =
      selectedAdmission?.id &&
      admissions.some((item) => item.id === selectedAdmission.id);
    const rows =
      hasSelectedInList || !selectedAdmission
        ? admissions
        : [selectedAdmission, ...admissions];
    return createAdmissionOptions(rows);
  }, [admissions, selectedAdmission]);
  const selectedLabel = useMemo(
    () => formatAdmissionLabel(selectedAdmission),
    [selectedAdmission]
  );
  const patientDetails = useMemo(
    () => buildPatientDetails(selectedAdmission),
    [selectedAdmission]
  );
  const latestValues = useMemo(
    () => getLatestCurrentReadingsValues(selectedAdmission || {}),
    [selectedAdmission]
  );
  const progressAssessment = useMemo(
    () =>
      status.progressAssessment ||
      getCurrentReadingsProgressAssessment(selectedAdmission || {}),
    [selectedAdmission, status.progressAssessment]
  );
  const history = useMemo(
    () => getCurrentReadingsHistory(selectedAdmission || {}),
    [selectedAdmission]
  );
  const missingData = useMemo(
    () => getCurrentReadingsMissingData(selectedAdmission || {}),
    [selectedAdmission]
  );
  const advisoryFlags = useMemo(
    () => getCurrentReadingsAdvisoryFlags(selectedAdmission || {}),
    [selectedAdmission]
  );
  const hasValidAdmissionContext = Boolean(
    selectedAdmissionId &&
    selectedAdmission?.id === selectedAdmissionId &&
    (!selectedAdmission.status || selectedAdmission.status === 'ACTIVE')
  );

  return {
    testIds: CURRENT_READINGS_TEST_IDS,
    abg,
    abgFields: ABG_FIELD_DEFINITIONS,
    admissionOptions,
    advisoryFlags,
    handleSubmit,
    history,
    fieldErrors: validation.fieldErrors,
    hasValidAdmissionContext,
    isLoading,
    isAdmissionLoading,
    isOffline,
    isSaving,
    latestValues,
    missingData,
    patientDetails,
    progressAssessment,
    selectedAdmission,
    selectedAdmissionId,
    selectedLabel,
    setAbgField,
    setSelectedAdmissionId: selectAdmission,
    setVitalsField,
    setVentilatorField,
    status,
    toDisplayDate,
    ventilatorRecommendation:
      status.ventilatorRecommendation ||
      selectedAdmission?.ventilatorRecommendation ||
      null,
    recommendationError: status.recommendationError || null,
    vitals,
    vitalsFields: VITAL_SIGN_FIELD_DEFINITIONS,
    ventilator,
    ventilatorFields: VENTILATOR_FIELD_DEFINITIONS,
    ventilatorModeOptions: VENTILATOR_MODE_OPTIONS,
  };
}
