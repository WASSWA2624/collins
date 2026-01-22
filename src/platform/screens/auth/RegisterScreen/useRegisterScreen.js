/**
 * useRegisterScreen Hook
 * Shared behavior/logic for RegisterScreen across all platforms.
 * File: useRegisterScreen.js
 */
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n, useNetwork } from '@hooks';
import { AUTH } from '@config';
import { isValidUuid, normalizePhoneNumber } from '@utils';
import { STEPS } from './types';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useRegisterScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const {
    register,
    clearError,
    isLoading,
    errorCode,
    isAuthenticated,
    roles,
  } = useAuth();
  const canAccessRegister = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!AUTH.REGISTER_ROLES?.length) return false;
    return AUTH.REGISTER_ROLES.some((role) => roles.includes(role));
  }, [isAuthenticated, roles]);

  const accessErrorMessage = useMemo(() => {
    if (canAccessRegister) return null;
    return t('errors.codes.FORBIDDEN');
  }, [canAccessRegister, t]);
  const [step, setStep] = useState(STEPS.ORGANIZATION);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [phone, setPhone] = useState('');
  const [tenantIdError, setTenantIdError] = useState(null);
  const [facilityIdError, setFacilityIdError] = useState(null);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [errorCode, t]
  );

  const isTenantValid = useMemo(() => isValidUuid(tenantId), [tenantId]);
  const isFacilityValid = useMemo(
    () => (facilityId ? isValidUuid(facilityId) : true),
    [facilityId]
  );

  const canProceed = useMemo(
    () => Boolean(isTenantValid && isFacilityValid) && !isLoading && !isOffline && canAccessRegister,
    [canAccessRegister, isFacilityValid, isLoading, isOffline, isTenantValid]
  );

  const canSubmit = useMemo(
    () => Boolean(email && password && tenantId) && !isLoading && !isOffline && step === STEPS.DETAILS && canAccessRegister,
    [canAccessRegister, email, isLoading, isOffline, password, step, tenantId]
  );

  const resolveTenantError = useCallback(() => {
    if (!tenantId.trim()) return t('forms.validation.required');
    if (!isValidUuid(tenantId)) return t('forms.validation.invalidUuid');
    return null;
  }, [t, tenantId]);

  const resolveFacilityError = useCallback(() => {
    if (!facilityId.trim()) return null;
    if (!isValidUuid(facilityId)) return t('forms.validation.invalidUuid');
    return null;
  }, [facilityId, t]);

  const handleContinue = useCallback(() => {
    const nextTenantError = resolveTenantError();
    const nextFacilityError = resolveFacilityError();
    setTenantIdError(nextTenantError);
    setFacilityIdError(nextFacilityError);
    if (nextTenantError || nextFacilityError) {
      return false;
    }
    setStep(STEPS.DETAILS);
    return true;
  }, [resolveFacilityError, resolveTenantError]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return false;
    clearError();
    const normalizedPhone = phone ? normalizePhoneNumber(phone) : '';
    await register({
      email: email.trim(),
      password,
      tenant_id: tenantId.trim(),
      facility_id: facilityId.trim() || undefined,
      phone: normalizedPhone || undefined,
    });
    return true;
  }, [canSubmit, clearError, email, facilityId, password, phone, register, tenantId]);

  const handleChangeEmail = useCallback((value) => {
    setEmail(value);
  }, []);

  const handleChangePassword = useCallback((value) => {
    setPassword(value);
  }, []);

  const handleChangeTenantId = useCallback((value) => {
    setTenantId(value);
    setTenantIdError(null);
  }, []);

  const handleChangeFacilityId = useCallback((value) => {
    setFacilityId(value);
    setFacilityIdError(null);
  }, []);

  const handleChangePhone = useCallback((value) => {
    setPhone(value);
  }, []);

  const handleGoToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleBack = useCallback(() => {
    setStep(STEPS.ORGANIZATION);
  }, []);

  return {
    step,
    email,
    password,
    tenantId,
    facilityId,
    phone,
    tenantIdError,
    facilityIdError,
    accessErrorMessage,
    errorMessage,
    isLoading,
    isOffline,
    canProceed,
    canSubmit,
    handleContinue,
    handleSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleChangeTenantId,
    handleChangeFacilityId,
    handleChangePhone,
    handleGoToLogin,
    handleBack,
  };
};

export default useRegisterScreen;

