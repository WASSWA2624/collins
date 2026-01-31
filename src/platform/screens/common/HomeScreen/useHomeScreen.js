/**
 * useHomeScreen
 * Shared logic for HomeScreen.
 * File: useHomeScreen.js
 */
import { useMemo } from 'react';
import { HOME_TEST_IDS } from './types';

export default function useHomeScreen() {
  return useMemo(
    () => ({
      testIds: HOME_TEST_IDS,
    }),
    []
  );
}
