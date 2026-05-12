/**
 * Login Route
 */
import React from 'react';
import { PublicAuthGuard } from '@navigation/guards';
import { LoginScreen } from '@platform/screens';

export default function LoginRoute() {
  return (
    <PublicAuthGuard>
      <LoginScreen />
    </PublicAuthGuard>
  );
}
