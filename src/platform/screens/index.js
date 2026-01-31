/**
 * Screens Barrel Export
 * Centralized export for all screen components
 * File: index.js
 * 
 * Per component-structure.mdc: Barrel files must use index.js (not index.jsx)
 * Screens are organized into category folders (common/, main/, etc.)
 */

// Common screens (public/common screens)
export { default as NotFoundScreen } from './common/NotFoundScreen';
export { default as ErrorScreen } from './common/ErrorScreen';
export { default as DisclaimerScreen } from './common/DisclaimerScreen';
export { default as LandingScreen } from './common/LandingScreen';

// Ventilation workflow (Phase 8+)
export { default as AssessmentEntryScreen } from './ventilation/AssessmentEntryScreen';
