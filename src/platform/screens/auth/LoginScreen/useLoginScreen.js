/**
 * useLoginScreen Hook
 * Shared behavior/logic for LoginScreen across all platforms.
 * File: useLoginScreen.js
 */
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useBiometricAuth, useI18n, useNetwork } from '@hooks';
import { AUTH } from '@config';
import { normalizePhoneNumber } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const normalizeIdentifier = (value) => String(value || '').trim();
const isEmailIdentifier = (value) => normalizeIdentifier(value).includes('@');

const useLoginScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const {
    login,
    clearError,
    isLoading,
    errorCode,
    refreshSession,
    loadCurrentUser,
    isAuthenticated,
    roles,
  } = useAuth();
  const {
    isAvailable: isBiometricAvailable,
    isChecking: isBiometricChecking,
    errorMessage: biometricErrorMessage,
    authenticate: authenticateBiometric,
  } = useBiometricAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');

  const errorMessage = useMemo(() => {
    const authMessage = resolveErrorMessage(t, errorCode);
    return authMessage || biometricErrorMessage;
  }, [biometricErrorMessage, errorCode, t]);

  const canSubmit = useMemo(
    () => Boolean(identifier && password && tenantId) && !isLoading && !isOffline,
    [identifier, isLoading, isOffline, password, tenantId]
  );

  const canAccessRegister = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!AUTH.REGISTER_ROLES?.length) return false;
    return AUTH.REGISTER_ROLES.some((role) => roles.includes(role));
  }, [isAuthenticated, roles]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return false;
    clearError();
    const rawIdentifier = normalizeIdentifier(identifier);
    const payload = isEmailIdentifier(rawIdentifier)
      ? { email: rawIdentifier.toLowerCase() }
      : { phone: normalizePhoneNumber(rawIdentifier) };
    await login({
      ...payload,
      password,
      tenant_id: tenantId.trim(),
      facility_id: facilityId.trim() || undefined,
    });
    return true;
  }, [canSubmit, clearError, facilityId, identifier, login, password, tenantId]);

  const handleChangeIdentifier = useCallback((value) => {
    setIdentifier(value);
  }, []);

  const handleChangePassword = useCallback((value) => {
    setPassword(value);
  }, []);

  const handleChangeTenantId = useCallback((value) => {
    setTenantId(value);
  }, []);

  const handleChangeFacilityId = useCallback((value) => {
    setFacilityId(value);
  }, []);

  const handleGoToRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

  const handleGoToForgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, [router]);

  const handleBiometricLogin = useCallback(async () => {
    if (!isBiometricAvailable || isBiometricChecking || isOffline) return false;
    const authenticated = await authenticateBiometric();
    if (!authenticated) return false;
    clearError();
    await refreshSession();
    await loadCurrentUser();
    return true;
  }, [
    authenticateBiometric,
    clearError,
    isBiometricAvailable,
    isBiometricChecking,
    isOffline,
    loadCurrentUser,
    refreshSession,
  ]);

  return {
    identifier,
    password,
    tenantId,
    facilityId,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    canAccessRegister,
    isBiometricAvailable,
    isBiometricChecking,
    handleSubmit,
    handleChangeIdentifier,
    handleChangePassword,
    handleChangeTenantId,
    handleChangeFacilityId,
    handleGoToRegister,
    handleGoToForgotPassword,
    handleBiometricLogin,
  };
};

export default useLoginScreen;

