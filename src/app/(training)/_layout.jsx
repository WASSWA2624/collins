/**
 * Training Group Route Layout
 * Uses main layout (sidebar + header) per requirement: no auth, all screens use main layout.
 */
import React from 'react';
import { MainRouteLayout } from '@platform/layouts';

export default function TrainingLayout() {
  return <MainRouteLayout />;
}

