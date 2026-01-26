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
export { default as TenantSelectionScreen } from './auth/TenantSelectionScreen';
export { default as FacilitySelectionScreen } from './auth/FacilitySelectionScreen';

// Main screens (authenticated/main screens)
export { default as HomeScreen } from './main/HomeScreen';

// Settings screens
export { default as SettingsScreen } from './settings/SettingsScreen';
export { default as UserSessionListScreen } from './settings/UserSessionListScreen';
export { default as UserSessionDetailScreen } from './settings/UserSessionDetailScreen';
export { default as TenantListScreen } from './settings/TenantListScreen';
export { default as TenantDetailScreen } from './settings/TenantDetailScreen';
export { default as FacilityListScreen } from './settings/FacilityListScreen';
export { default as FacilityDetailScreen } from './settings/FacilityDetailScreen';
export { default as BranchListScreen } from './settings/BranchListScreen';
export { default as BranchDetailScreen } from './settings/BranchDetailScreen';
export { default as DepartmentListScreen } from './settings/DepartmentListScreen';
export { default as DepartmentDetailScreen } from './settings/DepartmentDetailScreen';
export { default as UnitListScreen } from './settings/UnitListScreen';
export { default as UnitDetailScreen } from './settings/UnitDetailScreen';
export { default as RoomListScreen } from './settings/RoomListScreen';
export { default as RoomDetailScreen } from './settings/RoomDetailScreen';
export { default as WardListScreen } from './settings/WardListScreen';
export { default as WardDetailScreen } from './settings/WardDetailScreen';
export { default as BedListScreen } from './settings/BedListScreen';
export { default as BedDetailScreen } from './settings/BedDetailScreen';
export { default as AddressListScreen } from './settings/AddressListScreen';
export { default as AddressDetailScreen } from './settings/AddressDetailScreen';
export { default as ContactListScreen } from './settings/ContactListScreen';
export { default as ContactDetailScreen } from './settings/ContactDetailScreen';
