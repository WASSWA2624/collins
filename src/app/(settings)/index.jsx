/**
 * Settings Route
 * Single route for settings: (settings)/index → /settings → SettingsScreen.
 * Per app-router.mdc: one route, one screen; no duplicate route for same screen.
 */
import React from 'react';
import { SettingsScreen } from '@platform/screens';

export default function SettingsRoute() {
  return <SettingsScreen />;
}
