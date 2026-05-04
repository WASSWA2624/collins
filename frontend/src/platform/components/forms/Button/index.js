/**
 * Button Component
 * Platform selector export (platform file resolution)
 * File: index.js
 */

// 1. Default export (component) - REQUIRED
// For Jest and tools that don't support React Native platform resolution,
// export the web version as default. React Native will use platform-specific files at runtime.
export { default } from './Button';

// 2. Hook exports - OPTIONAL
export { default as useButton } from './useButton';

// 3. Type/constant exports - OPTIONAL
export { VARIANTS, SIZES, STATES } from './types';

