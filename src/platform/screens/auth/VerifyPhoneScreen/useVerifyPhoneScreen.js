/**
 * useVerifyPhoneScreen Hook
 * Shared behavior/logic for VerifyPhoneScreen across all platforms.
 * File: useVerifyPhoneScreen.js
 */
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n, useNetwork } from '@hooks';
import { normalizePhoneNumber } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useVerifyPhoneScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const { verifyPhone, clearError, isLoading, errorCode } = useAuth();
  const [token, setToken] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [errorCode, t]
  );

  const canSubmit = useMemo(
    () => Boolean(token && phone) && !isLoading && !isOffline,
    [isLoading, isOffline, phone, token]
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return false;
    clearError();
    const result = await verifyPhone({
      token: token.trim(),
      phone: normalizePhoneNumber(phone),
    });
    const succeeded = !result?.error;
    if (succeeded) {
      setIsSubmitted(true);
    }
    return succeeded;
  }, [canSubmit, clearError, phone, token, verifyPhone]);

  const handleChangeToken = useCallback((value) => {
    setToken(value);
    setIsSubmitted(false);
  }, []);

  const handleChangePhone = useCallback((value) => {
    setPhone(value);
    setIsSubmitted(false);
  }, []);

  const handleGoToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    token,
    phone,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    handleSubmit,
    handleChangeToken,
    handleChangePhone,
    handleGoToLogin,
  };
};

export default useVerifyPhoneScreen;

