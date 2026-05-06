/**
 * Shared ABG and ventilator setting update screen logic.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNetwork } from '@hooks';
import {
  ABG_FIELD_DEFINITIONS,
  VENTILATOR_FIELD_DEFINITIONS,
  VENTILATOR_MODE_OPTIONS,
  getAbgVentAdvisoryFlags,
  getAbgVentHistory,
  getAbgVentMissingData,
  getLatestAbgVentValues,
  listActiveAdmissionsUseCase,
  loadAdmissionAbgVentilatorContextUseCase,
  submitAbgVentUpdateUseCase,
} from '@features/abgVentUpdates';
import { ABG_VENT_UPDATE_TEST_IDS } from './types';

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
  return date.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
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

const hasAnyValue = (value) =>
  Object.values(value || {}).some((entry) => (typeof entry === 'string' ? entry.trim() : entry !== undefined && entry !== null));

const createInitialStatus = () => ({ kind: 'idle', message: '', conflict: null });

export default function useAbgVentUpdateScreen() {
  const { isOffline } = useNetwork();
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [abg, setAbg] = useState({ ...INITIAL_ABG_FORM });
  const [ventilator, setVentilator] = useState({ ...INITIAL_VENTILATOR_FORM });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(createInitialStatus);

  const loadAdmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await listActiveAdmissionsUseCase();
      const list = Array.isArray(rows) ? rows : [];
      setAdmissions(list);
      setSelectedAdmissionId((current) => current || list[0]?.id || null);
      setStatus((current) => (current.kind === 'load_error' ? createInitialStatus() : current));
    } catch (error) {
      setStatus({ kind: 'load_error', message: error?.safeMessage || error?.message || 'Unable to load active admissions.', conflict: null });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSelectedAdmission = useCallback(async (admissionId) => {
    if (!admissionId) {
      setSelectedAdmission(null);
      return;
    }
    try {
      const admission = await loadAdmissionAbgVentilatorContextUseCase(admissionId);
      setSelectedAdmission(admission || admissions.find((item) => item.id === admissionId) || null);
    } catch {
      setSelectedAdmission(admissions.find((item) => item.id === admissionId) || null);
    }
  }, [admissions]);

  useEffect(() => {
    loadAdmissions();
  }, [loadAdmissions]);

  useEffect(() => {
    loadSelectedAdmission(selectedAdmissionId);
  }, [loadSelectedAdmission, selectedAdmissionId]);

  const setAbgField = useCallback((field, value) => {
    setAbg((current) => ({ ...current, [field]: value }));
  }, []);

  const setVentilatorField = useCallback((field, value) => {
    setVentilator((current) => ({ ...current, [field]: value }));
  }, []);

  const resetForms = useCallback(() => {
    setAbg({ ...INITIAL_ABG_FORM });
    setVentilator({ ...INITIAL_VENTILATOR_FORM });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedAdmissionId) {
      setStatus({ kind: 'error', message: 'Select an active admission before saving.', conflict: null });
      return;
    }

    if (!hasAnyValue(abg) && !hasAnyValue(ventilator)) {
      setStatus({ kind: 'error', message: 'Enter at least one ABG or ventilator setting value.', conflict: null });
      return;
    }

    setIsSaving(true);
    setStatus({ kind: 'saving', message: 'Validating and saving the new ABG and ventilator values.', conflict: null });
    try {
      const result = await submitAbgVentUpdateUseCase({
        admissionId: selectedAdmissionId,
        abg,
        ventilator,
        isOnline: !isOffline,
      });

      if (result.syncStatus === 'queued') {
        setStatus({ kind: 'queued', message: 'Saved to offline queue. It will retry when online.', conflict: null });
        resetForms();
        return;
      }

      if (result.syncStatus === 'conflict') {
        setStatus({
          kind: 'conflict',
          message: 'Newer clinical data exists. Refresh this admission before resubmitting.',
          conflict: result.conflict,
        });
        return;
      }

      setStatus({ kind: 'synced', message: 'ABG and ventilator settings saved as new history entries.', conflict: null });
      resetForms();
      await loadSelectedAdmission(selectedAdmissionId);
      await loadAdmissions();
    } catch (error) {
      setStatus({ kind: 'error', message: error?.safeMessage || error?.message || 'Unable to save update.', conflict: null });
    } finally {
      setIsSaving(false);
    }
  }, [abg, ventilator, selectedAdmissionId, isOffline, resetForms, loadSelectedAdmission, loadAdmissions]);

  const admissionOptions = useMemo(() => createAdmissionOptions(admissions), [admissions]);
  const selectedLabel = useMemo(() => formatAdmissionLabel(selectedAdmission), [selectedAdmission]);
  const latestValues = useMemo(() => getLatestAbgVentValues(selectedAdmission || {}), [selectedAdmission]);
  const history = useMemo(() => getAbgVentHistory(selectedAdmission || {}), [selectedAdmission]);
  const missingData = useMemo(() => getAbgVentMissingData(selectedAdmission || {}), [selectedAdmission]);
  const advisoryFlags = useMemo(() => getAbgVentAdvisoryFlags(selectedAdmission || {}), [selectedAdmission]);

  return {
    testIds: ABG_VENT_UPDATE_TEST_IDS,
    abg,
    abgFields: ABG_FIELD_DEFINITIONS,
    admissionOptions,
    advisoryFlags,
    handleSubmit,
    history,
    isLoading,
    isOffline,
    isSaving,
    latestValues,
    missingData,
    selectedAdmission,
    selectedAdmissionId,
    selectedLabel,
    setAbgField,
    setSelectedAdmissionId,
    setVentilatorField,
    status,
    toDisplayDate,
    ventilator,
    ventilatorFields: VENTILATOR_FIELD_DEFINITIONS,
    ventilatorModeOptions: VENTILATOR_MODE_OPTIONS,
  };
}
