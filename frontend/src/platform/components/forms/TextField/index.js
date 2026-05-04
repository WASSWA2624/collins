/**
 * TextField Component
 * Platform selector export (platform file resolution)
 * File: index.js
 */

// 1. Default export (component) - REQUIRED
// For Jest and tools that don't support React Native platform resolution,
// export the web version as default. React Native will use platform-specific files at runtime.
export { default } from './TextField';

// 2. Hook exports (if applicable) - OPTIONAL
export { default as useTextField } from './useTextField';

// 3. Type/constant exports (if applicable) - OPTIONAL
export { INPUT_TYPES, VALIDATION_STATES } from './types';

