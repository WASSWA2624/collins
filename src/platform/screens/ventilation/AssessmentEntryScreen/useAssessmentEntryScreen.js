/**
 * useAssessmentEntryScreen
 * Shared logic for AssessmentEntryScreen.
 * File: useAssessmentEntryScreen.js
 */
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

export default function useAssessmentEntryScreen() {
  const router = useRouter();

  const handleStart = useCallback(() => {
    // Phase 8: assessment entry is a placeholder for Phase 11 wizard.
    // For now, remain on the assessment entry route.
    router.replace('/assessment');
  }, [router]);

  return { handleStart };
}

