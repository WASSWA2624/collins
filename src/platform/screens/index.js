/**
 * Screens Barrel Export
 * Centralized export for all screen components
 * File: index.js
 * 
 * Per component-structure.mdc: Barrel files must use index.js (not index.jsx)
 * Screens are organized into category folders (common/, main/, etc.)
 */

// Common screens (public/common screens)
export { default as LandingScreen } from './common/LandingScreen';
export { default as NotFoundScreen } from './common/NotFoundScreen';
export { default as ErrorScreen } from './common/ErrorScreen';

// Auth screens (authentication screens)
export { default as LoginScreen } from './auth/LoginScreen';
export { default as RegisterScreen } from './auth/RegisterScreen';
export { default as ForgotPasswordScreen } from './auth/ForgotPasswordScreen';
export { default as ResetPasswordScreen } from './auth/ResetPasswordScreen';
export { default as VerifyEmailScreen } from './auth/VerifyEmailScreen';
export { default as VerifyPhoneScreen } from './auth/VerifyPhoneScreen';

// Main screens (authenticated/main screens)
export { default as HomeScreen } from './main/HomeScreen';
