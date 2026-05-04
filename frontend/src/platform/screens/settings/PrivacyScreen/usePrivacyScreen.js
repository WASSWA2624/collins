/**
 * usePrivacyScreen
 * Shared logic for Privacy screen (content-only).
 */
import { useMemo } from 'react';
import { PRIVACY_TEST_IDS } from './types';

export default function usePrivacyScreen() {
  return useMemo(
    () => ({
      testIds: PRIVACY_TEST_IDS,
    }),
    []
  );
}
