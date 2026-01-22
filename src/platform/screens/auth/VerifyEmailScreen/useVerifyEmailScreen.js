/**
 * useVerifyEmailScreen Hook
 * Shared behavior/logic for VerifyEmailScreen across all platforms.
 * File: useVerifyEmailScreen.js
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

const useVerifyEmailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const { verifyEmail, clearError, isLoading, errorCode } = useAuth();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [errorCode, t]
  );

  const canSubmit = useMemo(
    () => Boolean(token) && !isLoading && !isOffline,
    [isLoading, isOffline, token]
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return false;
    clearError();
    const payload = {
      token: token.trim(),
      email: email.trim() || undefined,
    };
    const result = await verifyEmail(payload);
    const succeeded = !result?.error;
    if (succeeded) {
      setIsSubmitted(true);
    }
    return succeeded;
  }, [canSubmit, clearError, email, token, verifyEmail]);

  const handleChangeToken = useCallback((value) => {
    setToken(value);
    setIsSubmitted(false);
  }, []);

  const handleChangeEmail = useCallback((value) => {
    setEmail(value);
    setIsSubmitted(false);
  }, []);

  const handleGoToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    token,
    email,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    handleSubmit,
    handleChangeToken,
    handleChangeEmail,
    handleGoToLogin,
  };
};

export default useVerifyEmailScreen;

