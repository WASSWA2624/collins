/**
 * useBiometricAuth Hook
 * Exposes biometric availability and authentication helpers.
 * File: useBiometricAuth.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import useI18n from '@hooks/useI18n';
import { authenticateBiometric, isBiometricEnrolled, isBiometricSupported } from '@security';

const useBiometricAuth = () => {
  const { t } = useI18n();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const checkAvailability = useCallback(async () => {
    setIsChecking(true);
    const [supported, enrolled] = await Promise.all([
      isBiometricSupported(),
      isBiometricEnrolled(),
    ]);
    setIsAvailable(Boolean(supported && enrolled));
    setIsChecking(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const [supported, enrolled] = await Promise.all([
        isBiometricSupported(),
        isBiometricEnrolled(),
      ]);
      if (!isMounted) return;
      setIsAvailable(Boolean(supported && enrolled));
      setIsChecking(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const authenticate = useCallback(async () => {
    setErrorMessage(null);
    const result = await authenticateBiometric({
      promptMessage: t('auth.login.biometric.prompt'),
      cancelLabel: t('auth.login.biometric.cancel'),
      fallbackLabel: t('auth.login.biometric.fallback'),
    });
    if (!result?.success) {
      setErrorMessage(t('auth.login.biometric.error'));
      return false;
    }
    return true;
  }, [t]);

  return useMemo(() => ({
    isAvailable,
    isChecking,
    errorMessage,
    authenticate,
    refreshAvailability: checkAvailability,
  }), [authenticate, checkAvailability, errorMessage, isAvailable, isChecking]);
};

export default useBiometricAuth;
