/**
 * Avatar Component
 * Platform selector export (platform file resolution)
 * File: index.js
 * 
 * Per component-structure.mdc: Barrel files must use index.js (not index.jsx)
 */

// For Jest and tools that don't support React Native platform resolution,
// export the web version as default. React Native will use platform-specific files at runtime.
export { default } from './Avatar';
export { SIZES } from './types';

