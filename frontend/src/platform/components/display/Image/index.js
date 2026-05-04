/**
 * Image Component
 * Platform selector export (platform file resolution)
 * File: index.js
 */

// 1. Default export (component) - REQUIRED
// For Jest and tools that don't support React Native platform resolution,
// export the web version as default. React Native will use platform-specific files at runtime.
export { default } from './Image';

// 2. Type/constant exports (if applicable) - OPTIONAL
export { RESIZE_MODE, RESIZE_MODE_KEYS } from './types';

