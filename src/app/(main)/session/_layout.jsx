/**
 * Session Route Layout
 * (main)/session - Guards child routes; redirects to /assessment when no session
 */
import React from 'react';
import { Slot } from 'expo-router';
import { useSessionGuard } from '@hooks';

export default function SessionLayout() {
  const { hasSession, isReady } = useSessionGuard();

  if (!isReady || !hasSession) {
    return null;
  }

  return <Slot />;
}
