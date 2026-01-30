/**
 * MainRouteLayout Component
 * Platform selector export (platform file resolution)
 * File: index.js
 */

export { default } from './MainRouteLayout';
export {
  useHeaderActions,
  useNotificationData,
  useFilteredNavigationItems,
  useHeaderCustomizationItems,
} from './useMainLayoutMemo';
export { default as useKeyboardShortcuts } from './useKeyboardShortcuts';
export { default as useBreadcrumbs } from './useBreadcrumbs';
export { default as useMainRouteLayoutNative } from './useMainRouteLayoutNative';
export { default as useMainRouteLayoutWeb } from './useMainRouteLayoutWeb';
export {
  SIDEBAR_ICON_SIZE,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_DEFAULT_WIDTH,
  clamp,
} from './types';
