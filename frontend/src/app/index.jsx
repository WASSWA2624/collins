/**
 * Root Index Route
 * Root index route.
 *
 * Per dev-plan (Phase 8/9): home is routed through the main layout.
 */
import React from 'react';
import { Redirect } from 'expo-router';

export default function IndexRoute() {
  return <Redirect href="/(main)" />;
}
