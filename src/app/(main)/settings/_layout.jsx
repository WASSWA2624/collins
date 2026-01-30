/**
 * Settings segment layout.
 * Renders SettingsScreen as template (sidebar + scrollable content) with Slot for sub-routes.
 * Per app-router.mdc: group layouts use _layout.jsx, default export.
 * Key Slot by pathname so nested routes (facilities, users, etc.) mount correctly when navigating from the sidebar.
 */
import { Slot, usePathname } from 'expo-router';
import { SettingsScreen } from '@platform/screens';

export default function SettingsLayoutRoute() {
  const pathname = usePathname();
  return (
    <SettingsScreen>
      <Slot key={pathname} />
    </SettingsScreen>
  );
}
