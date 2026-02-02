/**
 * Platform Layouts Barrel Export
 * Centralized exports for all platform layouts
 * File: index.js
 */

// Main layouts
export { default as MainLayout } from './MainLayout';
export { default as ModalLayout } from './ModalLayout';
export { default as AppFrame } from './AppFrame';

// Route layouts (reusable route layout components)
export { default as MainRouteLayout } from './MainRouteLayout';

// Common layout components
export { default as ThemeProviderWrapper } from './common/ThemeProviderWrapper';
export {
  StyledLoadingContainer,
  StyledActivityIndicator,
} from './common/RootLayoutStyles';

