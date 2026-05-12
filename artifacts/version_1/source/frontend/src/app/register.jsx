/**
 * Register Route
 */
import React from 'react';
import { PublicAuthGuard } from '@navigation/guards';
import { RegisterScreen } from '@platform/screens';

export default function RegisterRoute() {
  return (
    <PublicAuthGuard>
      <RegisterScreen />
    </PublicAuthGuard>
  );
}
