/**
 * useResetPasswordScreen Hook
 * Shared behavior/logic for ResetPasswordScreen across all platforms.
 * File: useResetPasswordScreen.js
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

const useResetPasswordScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const { resetPassword, clearError, isLoading, errorCode } = useAuth();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [errorCode, t]
  );

  const passwordMismatch = useMemo(
    () => Boolean(confirmPassword) && password !== confirmPassword,
    [confirmPassword, password]
  );

  const canSubmit = useMemo(
    () => Boolean(token && password && confirmPassword) && !passwordMismatch && !isLoading && !isOffline,
    [confirmPassword, isLoading, isOffline, password, passwordMismatch, token]
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return false;
    clearError();
    const result = await resetPassword({
      token: token.trim(),
      new_password: password,
      confirm_password: confirmPassword,
    });
    const succeeded = !result?.error;
    if (succeeded) {
      setIsSubmitted(true);
    }
    return succeeded;
  }, [canSubmit, clearError, confirmPassword, password, resetPassword, token]);

  const handleChangeToken = useCallback((value) => {
    setToken(value);
    setIsSubmitted(false);
  }, []);

  const handleChangePassword = useCallback((value) => {
    setPassword(value);
    setIsSubmitted(false);
  }, []);

  const handleChangeConfirmPassword = useCallback((value) => {
    setConfirmPassword(value);
    setIsSubmitted(false);
  }, []);

  const handleGoToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    token,
    password,
    confirmPassword,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    passwordMismatch,
    canSubmit,
    handleSubmit,
    handleChangeToken,
    handleChangePassword,
    handleChangeConfirmPassword,
    handleGoToLogin,
  };
};

export default useResetPasswordScreen;

