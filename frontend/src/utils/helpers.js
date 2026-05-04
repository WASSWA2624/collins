/**
 * Helper Utilities
 * Generic helper functions
 * File: helpers.js
 */

/**
 * Clamps a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (value, min, max) => {
  if (typeof value !== 'number') return min;
  if (typeof min !== 'number') return value;
  if (typeof max !== 'number') return value;
  return Math.min(Math.max(value, min), max);
};

/**
 * Creates a stable string safe for display/search: trims and collapses whitespace.
 * @param {string} value
 * @returns {string}
 */
const normalizeWhitespace = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
};

/**
 * Safe JSON parse with deterministic fallback.
 * @param {string} value
 * @param {*} fallback
 * @returns {*}
 */
const safeJsonParse = (value, fallback = null) => {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export { clamp, normalizeWhitespace, safeJsonParse };

