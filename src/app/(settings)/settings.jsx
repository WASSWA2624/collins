/**
 * Settings Route
 * Route: (settings)/settings → /settings
 * File: settings.jsx
 *
 * Per app-router.mdc: route groups omit name from URL.
 * (settings)/settings.jsx yields path /settings for sidebar/navigation links.
 */
import React from 'react';
import { SettingsScreen } from '@platform/screens';

export default function SettingsRoute() {
  return <SettingsScreen />;
}
