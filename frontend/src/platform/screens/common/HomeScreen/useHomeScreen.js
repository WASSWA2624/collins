/**
 * useHomeScreen
 * Shared logic for HomeScreen. Sections match sidebar/tab nav (MAIN_NAV_ITEMS).
 * File: useHomeScreen.js
 */
import { useMemo } from 'react';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';
import { HOME_TEST_IDS } from './types';

const OVERVIEW_IDS = ['assessment', 'history', 'training'];

export default function useHomeScreen() {
  const sections = useMemo(
    () => MAIN_NAV_ITEMS.filter((it) => OVERVIEW_IDS.includes(it.id)),
    []
  );
  return useMemo(
    () => ({
      testIds: HOME_TEST_IDS,
      sections,
    }),
    [sections]
  );
}
