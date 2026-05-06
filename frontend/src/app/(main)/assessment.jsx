/**
 * Legacy Assessment Route
 * Redirects old /assessment links to the Admit workflow.
 */
import React from 'react';
import { Redirect } from 'expo-router';

export default function AssessmentRoute() {
  return <Redirect href="/admit" />;
}
