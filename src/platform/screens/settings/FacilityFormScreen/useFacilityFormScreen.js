/**
 * useFacilityFormScreen Hook
 * Shared logic for FacilityFormScreen (create/edit).
 * File: useFacilityFormScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useFacility, useTenant } from '@hooks';
import { FACILITY_TYPES } from './types';

const useFacilityFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useFacility();
  const { list: listTenants, data: tenantData, isLoading: tenantListLoading } = useTenant();

  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantId, setTenantId] = useState('');

  const facility = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const tenantOptions = useMemo(
    () =>
      tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      })),
    [tenantItems]
  );

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (!isEdit) {
      listTenants({ page: 1, limit: 200 });
    }
  }, [isEdit, listTenants]);

  useEffect(() => {
    if (facility) {
      setName(facility.name ?? '');
      setFacilityType(facility.facility_type ?? '');
      setIsActive(facility.is_active ?? true);
    }
  }, [facility]);

  const handleSubmit = useCallback(async () => {
    try {
      if (isEdit && id) {
        await update(id, { name: name.trim(), facility_type: facilityType || undefined, is_active: isActive });
      } else {
        await create({
          tenant_id: String(tenantId).trim(),
          name: name.trim(),
          facility_type: facilityType,
          is_active: isActive,
        });
      }
      router.replace('/settings/facilities');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, name, facilityType, isActive, tenantId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const typeOptions = FACILITY_TYPES.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

  return {
    isEdit,
    name,
    setName,
    facilityType,
    setFacilityType,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    isLoading,
    hasError: Boolean(errorCode),
    facility,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    typeOptions,
    testID: 'facility-form-screen',
  };
};

export default useFacilityFormScreen;
