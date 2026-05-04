/**
 * useErrorScreen Hook
 * Shared behavior/logic for ErrorScreen across all platforms
 * File: useErrorScreen.js
 */
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * ErrorScreen hook
 * @param {Object} options - Hook options
 * @param {Function} [options.onRetry] - Retry handler (if applicable)
 * @returns {Object} Hook return object with navigation and retry handlers
 */
const useErrorScreen = (options = {}) => {
  const { onRetry } = options;
  const router = useRouter();

  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  return {
    handleGoHome,
    handleRetry,
    hasRetry: !!onRetry,
  };
};

export default useErrorScreen;

