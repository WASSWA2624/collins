/**
 * Screens Barrel Export
 * Centralized export for all screen components
 * File: index.js
 *
 * Per component-structure.mdc: Barrel files must use index.js (not index.jsx)
 * Screens are organized into category folders (common/, main/, etc.)
 */

// Common screens (public/common screens)
export { LoginScreen, RegisterScreen, FacilitySelectionScreen } from './auth';
export { default as HomeScreen } from './common/HomeScreen';
export { default as NotFoundScreen } from './common/NotFoundScreen';
export { default as ErrorScreen } from './common/ErrorScreen';
export { default as DashboardScreen } from './dashboard/DashboardScreen';
export { default as FacilityManagementScreen } from './admin/FacilityManagementScreen';
export { default as UserManagementScreen } from './admin/UserManagementScreen';
export { DatasetCaptureScreen } from './dataset';

// Ventilation screens
export { default as AssessmentScreen } from './ventilation/AssessmentScreen';
export { default as RecommendationScreen } from './ventilation/RecommendationScreen';
export { default as MonitoringScreen } from './ventilation/MonitoringScreen';
export { default as HistoryScreen } from './ventilation/HistoryScreen';
export { default as TrackingScreen } from './ventilation/HistoryScreen';
export { default as CurrentReadingsScreen } from './ventilation/CurrentReadingsScreen';
export { default as CaseDetailScreen } from './ventilation/CaseDetailScreen';

// Review screens
export { default as ReviewQueueScreen } from './review/ReviewQueueScreen';

// Settings screens
export { default as SettingsScreen } from './settings/SettingsScreen';
export { default as DisclaimerScreen } from './settings/DisclaimerScreen';
export { default as DataSourcesScreen } from './settings/DataSourcesScreen';
export { default as PrivacyScreen } from './settings/PrivacyScreen';
export { default as AboutScreen } from './settings/AboutScreen';
export { default as OnboardingScreen } from './onboarding/OnboardingScreen';
export { default as HelpScreen } from './help/HelpScreen';
