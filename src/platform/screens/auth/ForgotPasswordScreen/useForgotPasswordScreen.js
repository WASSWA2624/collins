/**
 * useForgotPasswordScreen Hook
 * Shared behavior/logic for ForgotPasswordScreen across all platforms.
 * File: useForgotPasswordScreen.js
 */
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n, useNetwork } from '@hooks';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useForgotPasswordScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const { forgotPassword, clearError, isLoading, errorCode } = useAuth();
  const [email, setEmail] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [errorCode, t]
  );

  const canSubmit = useMemo(
    () => Boolean(email && tenantId) && !isLoading && !isOffline,
    [email, isLoading, isOffline, tenantId]
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return false;
    clearError();
    const result = await forgotPassword({
      email: email.trim(),
      tenant_id: tenantId.trim(),
    });
    const succeeded = !result?.error;
    if (succeeded) {
      setIsSubmitted(true);
    }
    return succeeded;
  }, [canSubmit, clearError, email, forgotPassword, tenantId]);

  const handleChangeEmail = useCallback((value) => {
    setEmail(value);
    setIsSubmitted(false);
  }, []);

  const handleChangeTenantId = useCallback((value) => {
    setTenantId(value);
    setIsSubmitted(false);
  }, []);

  const handleGoToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    email,
    tenantId,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    handleSubmit,
    handleChangeEmail,
    handleChangeTenantId,
    handleGoToLogin,
  };
};

export default useForgotPasswordScreen;

