/**
 * useLandingScreen
 * Shared logic for LandingScreen.
 * File: useLandingScreen.js
 */
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

export default function useLandingScreen() {
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    router.push('/assessment');
  }, [router]);

  return { handleGetStarted };
}

