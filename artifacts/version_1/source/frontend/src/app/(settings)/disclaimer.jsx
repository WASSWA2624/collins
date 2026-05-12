/**
 * Legacy Disclaimer Route
 * Migrates old links to in-flow onboarding safety wording.
 */
import React from 'react';
import { Redirect } from 'expo-router';

export default function DisclaimerRoute() {
  return <Redirect href="/onboarding" />;
}
