/**
 * Hooks Barrel Export
 * Centralized export for all hooks
 * File: index.js
 * 
 * Phase 5: Exports only cross-cutting hooks (no feature hooks).
 * Feature hooks will be added in Phase 9.
 */
export { default as useTheme } from './useTheme';
export { default as useNetwork } from './useNetwork';
export { default as useDatabaseHealth } from './useDatabaseHealth';
export { default as useI18n } from './useI18n';
export { default as useDebounce } from './useDebounce';
export { default as usePagination } from './usePagination';
export { default as useAsyncState } from './useAsyncState';
export { default as useCrud } from './useCrud';
export { default as useAuth } from './useAuth';
export { default as useBiometricAuth } from './useBiometricAuth';
export { default as useNavigationVisibility } from './useNavigationVisibility';
export { default as useUiState } from './useUiState';
export { default as useNetworkBanner } from './useNetworkBanner';
export { default as useShellBanners } from './useShellBanners';
export { default as useFocusTrap } from './useFocusTrap';
export { default as useVentilationSession } from './useVentilationSession';
export { default as useSessionGuard } from './useSessionGuard';
export { default as useTrainingContent } from './useTrainingContent';

