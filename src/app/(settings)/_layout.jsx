/**
 * Settings Group Route Layout
 * Uses main layout (sidebar + header) per requirement; disclaimer uses minimal layout.
 */
import React from 'react';
import { Slot, usePathname } from 'expo-router';
import { MainRouteLayout, DisclaimerLayout } from '@platform/layouts';

export default function SettingsLayout() {
  const pathname = usePathname();
  const isDisclaimer = pathname?.includes('disclaimer') ?? false;

  if (isDisclaimer) {
    return (
      <DisclaimerLayout>
        <Slot />
      </DisclaimerLayout>
    );
  }

  return <MainRouteLayout />;
}

