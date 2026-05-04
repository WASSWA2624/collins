/**
 * Feature Flags
 * File: feature.flags.js
 */

export const OFFLINE_MODE = true;
export const ANALYTICS_ENABLED = false;
export const MAINTENANCE_MODE = false;
export const MAINTENANCE_MESSAGE = '';

/**
 * Optional online augmentation (future-phase hook point).
 * Must remain disabled by default to preserve offline-first reliability.
 */
export const AI_AUGMENTATION_ENABLED = false;

