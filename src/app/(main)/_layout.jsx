/**
 * Main Group Route Layout
 *
 * Route layout for main app routes. P013: enforces first-run disclaimer acknowledgement
 * via DisclaimerGuard before rendering main content.
 *
 * Per app-router.mdc: route layouts in app/, default exports.
 * Per component-structure.mdc: minimal wrapper; layout logic in platform/layouts/.
 */

import React from 'react';
import { MainRouteLayout } from '@platform/layouts';
import { DisclaimerGuard } from '@navigation/guards';

const MainLayout = () => {
  return (
    <DisclaimerGuard>
      <MainRouteLayout />
    </DisclaimerGuard>
  );
};

export default MainLayout;

