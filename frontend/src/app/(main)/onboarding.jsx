/**
 * Onboarding Route — redirects to merged Training screen.
 * (main)/onboarding → /training (Training includes Getting started).
 */
import React from 'react';
import { Redirect } from 'expo-router';

export default function OnboardingRoute() {
  return <Redirect href="/training" />;
}
