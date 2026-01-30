/**
 * useTenantFormScreen Hook
 * Shared logic for TenantFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useTenant } from '@hooks';

const useTenantFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useTenant();

  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);

  const tenant = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name ?? '');
      setSlug(tenant.slug ?? '');
      setIsActive(tenant.is_active ?? true);
    }
  }, [tenant]);

  const handleSubmit = useCallback(async () => {
    try {
      if (isEdit && id) {
        await update(id, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          is_active: isActive,
        });
      } else {
        await create({
          name: name.trim(),
          slug: slug.trim() || undefined,
          is_active: isActive,
        });
      }
      router.replace('/settings/tenants');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, name, slug, isActive, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  return {
    isEdit,
    name,
    setName,
    slug,
    setSlug,
    isActive,
    setIsActive,
    isLoading,
    hasError: Boolean(errorCode),
    tenant,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'tenant-form-screen',
  };
};

export default useTenantFormScreen;
