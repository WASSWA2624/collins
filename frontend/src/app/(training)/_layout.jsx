/**
 * Training Group Route Layout
 * Uses main layout (sidebar + header) and the first-run onboarding guard.
 */
import React from 'react';
import { MainRouteLayout } from '@platform/layouts';
import { OnboardingGuard } from '@navigation/guards';

export default function TrainingLayout() {
  return (
    <OnboardingGuard>
      <MainRouteLayout />
    </OnboardingGuard>
  );
}

