/**
 * Training group index — redirects to /training (sidebar target).
 * (training)/index → "/" within group; (training)/training → /training.
 */
import React from 'react';
import { Redirect } from 'expo-router';

export default function TrainingIndexRoute() {
  return <Redirect href="/training" />;
}
