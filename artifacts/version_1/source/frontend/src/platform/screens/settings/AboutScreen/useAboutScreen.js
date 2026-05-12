/**
 * useAboutScreen
 * Shared logic for About screen (app identity, version).
 */
import { useMemo } from 'react';
import { ABOUT_TEST_IDS } from './types';

export default function useAboutScreen() {
  return useMemo(
    () => ({
      testIds: ABOUT_TEST_IDS,
    }),
    []
  );
}
