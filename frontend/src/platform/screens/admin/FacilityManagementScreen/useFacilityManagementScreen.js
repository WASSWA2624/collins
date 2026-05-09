import { useCallback, useEffect, useMemo, useState } from 'react';
import { MEMBERSHIP_ROLES } from '@config/accessControl';
import {
  createFacilityUseCase,
  deleteFacilityUseCase,
  listAdminFacilitiesUseCase,
  updateFacilityUseCase,
} from '@features/facilities';
import { useAuth } from '@hooks';
import { FACILITY_MANAGEMENT_TEST_IDS } from './types';

const STATUS_OPTIONS = Object.freeze([
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Suspended', value: 'SUSPENDED' },
]);

const DEPENDENCY_LABELS = Object.freeze({
  memberships: 'memberships',
  onboardingSelections: 'onboarding',
  patients: 'patients',
  admissions: 'admissions',
  datasetCases: 'dataset cases',
  referenceRules: 'reference rules',
  reviewActions: 'review actions',
  idempotencyRecords: 'sync records',
  syncEvents: 'sync events',
  activeUserSettings: 'active user settings',
});

const emptyForm = Object.freeze({
  registryCode: '',
  name: '',
  district: '',
  region: '',
  type: '',
  ownership: '',
  verificationStatus: 'VERIFIED',
  abgAvailability: '',
});

const asText = (value) => String(value || '').trim();
const nullableText = (value) => asText(value) || null;

const getErrorMessage = (error) =>
  error?.safeMessage || error?.message || 'Unable to save facility changes';

const facilityToForm = (facility) => ({
  registryCode: facility?.registryCode || '',
  name: facility?.name || '',
  district: facility?.district || '',
  region: facility?.region || '',
  type: facility?.type || '',
  ownership: facility?.ownership || '',
  verificationStatus: facility?.verificationStatus || 'VERIFIED',
  abgAvailability: facility?.abgAvailability || '',
});

const buildFacilityPayload = (form) => ({
  registryCode: nullableText(form.registryCode),
  name: asText(form.name),
  district: nullableText(form.district),
  region: nullableText(form.region),
  type: nullableText(form.type),
  ownership: nullableText(form.ownership),
  verificationStatus: form.verificationStatus || 'VERIFIED',
  abgAvailability: nullableText(form.abgAvailability),
});

const matchesFacilityQuery = (facility, query) => {
  const term = asText(query).toLowerCase();
  if (!term) return true;
  return [
    facility.name,
    facility.registryCode,
    facility.district,
    facility.region,
    facility.type,
    facility.ownership,
    facility.verificationStatus,
  ].some((value) => String(value || '').toLowerCase().includes(term));
};

const replaceFacility = (facilities, nextFacility) => {
  if (!nextFacility?.id) return facilities;
  const exists = facilities.some((facility) => facility.id === nextFacility.id);
  if (!exists) return [nextFacility, ...facilities];
  return facilities.map((facility) => (
    facility.id === nextFacility.id ? nextFacility : facility
  ));
};

const getDeleteBlockers = (facility) =>
  Object.entries(facility?.counts || {})
    .filter(([, count]) => Number(count || 0) > 0)
    .map(([key, count]) => ({
      key,
      count,
      label: DEPENDENCY_LABELS[key] || key,
    }));

const buildSummary = (facilities) => ({
  total: facilities.length,
  verified: facilities.filter((facility) => facility.verificationStatus === 'VERIFIED').length,
  pending: facilities.filter((facility) => facility.verificationStatus === 'PENDING').length,
  suspended: facilities.filter((facility) => facility.verificationStatus === 'SUSPENDED').length,
});

export default function useFacilityManagementScreen() {
  const auth = useAuth();
  const roleKeys = useMemo(
    () => auth.roleKeys || auth.roles || [],
    [auth.roleKeys, auth.roles]
  );
  const canManage = roleKeys.includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN);

  const [facilities, setFacilities] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingFacilityId, setDeletingFacilityId] = useState('');
  const [notice, setNotice] = useState(null);

  const selectedFacility = useMemo(
    () => facilities.find((facility) => facility.id === selectedFacilityId) || null,
    [facilities, selectedFacilityId]
  );
  const isCreating = !selectedFacilityId;
  const filteredFacilities = useMemo(
    () => facilities.filter((facility) => matchesFacilityQuery(facility, query)),
    [facilities, query]
  );
  const summary = useMemo(() => buildSummary(facilities), [facilities]);
  const deleteBlockers = useMemo(() => getDeleteBlockers(selectedFacility), [selectedFacility]);
  const hasFilters = Boolean(asText(query));
  const canSave = Boolean(asText(form.name)) && !isSaving;
  const canDelete = Boolean(selectedFacility?.id) && deleteBlockers.length === 0 && !isSaving;

  const setFormField = useCallback((field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  }, []);

  const loadFacilities = useCallback(async () => {
    if (!canManage) return;
    setIsLoading(true);
    setNotice(null);
    try {
      const result = await listAdminFacilitiesUseCase();
      const nextFacilities = result.facilities || [];
      setFacilities(nextFacilities);
      setSelectedFacilityId((current) => {
        if (current && nextFacilities.some((facility) => facility.id === current)) return current;
        return nextFacilities[0]?.id || '';
      });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  useEffect(() => {
    setForm(isCreating ? emptyForm : facilityToForm(selectedFacility));
  }, [isCreating, selectedFacility]);

  const startCreate = useCallback(() => {
    setSelectedFacilityId('');
    setForm(emptyForm);
    setNotice(null);
  }, []);

  const clearSearch = useCallback(() => setQuery(''), []);

  const saveFacility = useCallback(async () => {
    if (!canSave) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const payload = buildFacilityPayload(form);
      const savedFacility = isCreating
        ? await createFacilityUseCase(payload)
        : await updateFacilityUseCase(selectedFacilityId, payload);
      setFacilities((current) => replaceFacility(current, savedFacility));
      setSelectedFacilityId(savedFacility.id);
      setNotice({
        type: 'success',
        message: isCreating ? 'Facility created' : 'Facility updated',
      });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }, [canSave, form, isCreating, selectedFacilityId]);

  const deleteSelectedFacility = useCallback(async () => {
    if (!canDelete) return;
    const id = selectedFacility.id;
    setDeletingFacilityId(id);
    setNotice(null);
    try {
      await deleteFacilityUseCase(id);
      setFacilities((current) => current.filter((facility) => facility.id !== id));
      setSelectedFacilityId((current) => (current === id ? '' : current));
      setForm(emptyForm);
      setNotice({ type: 'success', message: 'Facility deleted' });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setDeletingFacilityId('');
    }
  }, [canDelete, selectedFacility]);

  return {
    canDelete,
    canManage,
    canSave,
    clearSearch,
    deleteBlockers,
    deleteSelectedFacility,
    deletingFacilityId,
    facilities,
    filteredFacilities,
    form,
    hasFilters,
    isCreating,
    isLoading,
    isSaving,
    notice,
    query,
    refresh: loadFacilities,
    selectedFacility,
    selectedFacilityId,
    setFormField,
    setQuery,
    setSelectedFacilityId,
    saveFacility,
    startCreate,
    statusOptions: STATUS_OPTIONS,
    summary,
    testIds: FACILITY_MANAGEMENT_TEST_IDS,
  };
}
