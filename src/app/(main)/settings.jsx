/**
 * Settings Group Parent Route
 * File: settings.jsx
 * 
 * Parent route for settings that displays the main SettingsScreen with tab navigation.
 * Nested routes (users, roles, etc.) are displayed within the tab content area.
 * 
 * Per app-router.mdc:
 * - Route files are minimal wrappers that delegate to platform screens
 * - All logic belongs in platform/screens/
 */

import { SettingsScreen } from '@platform/screens';

export default function SettingsRoute() {
  return <SettingsScreen />;
}
