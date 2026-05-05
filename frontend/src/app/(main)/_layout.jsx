/**
 * Main Group Route Layout
 *
 * Route layout for main app routes. Enforces first-run onboarding before content.
 *
 * Per app-router.mdc: route layouts in app/, default exports.
 * Per component-structure.mdc: minimal wrapper; layout logic in platform/layouts/.
 */

import React from 'react';
import { MainRouteLayout } from '@platform/layouts';
import { AuthGuard, OnboardingGuard } from '@navigation/guards';

const MainLayout = () => {
  return (
    <AuthGuard>
      <OnboardingGuard>
        <MainRouteLayout />
      </OnboardingGuard>
    </AuthGuard>
  );
};

export default MainLayout;

