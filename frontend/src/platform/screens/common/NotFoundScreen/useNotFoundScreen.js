/**
 * useNotFoundScreen Hook
 * Shared behavior/logic for NotFoundScreen across all platforms
 * File: useNotFoundScreen.js
 */
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * NotFoundScreen hook
 * @returns {Object} Hook return object with navigation handlers
 */
const useNotFoundScreen = () => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.history?.length > 1) router.back();
      else router.replace('/');
    } else {
      router.back();
    }
  }, [router]);

  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return {
    handleBack,
    handleGoHome,
  };
};

export default useNotFoundScreen;

