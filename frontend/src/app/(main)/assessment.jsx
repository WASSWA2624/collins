/**
 * Legacy Assessment Route
 * Redirects old /assessment links to the New Patient workflow.
 */
import React from 'react';
import { Redirect } from 'expo-router';

export default function AssessmentRoute() {
  return <Redirect href="/new-patient" />;
}
