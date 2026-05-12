/**
 * Legacy /admit route
 * Redirects old /admit links to the New Patient workflow.
 */
import React from 'react';
import { Redirect } from 'expo-router';

export default function LegacyNewPatientRoute() {
  return <Redirect href="/new-patient" />;
}
