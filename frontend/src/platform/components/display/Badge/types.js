/**
 * Badge Component Types
 * Defines variants and sizes
 * File: types.js
 */

/**
 * Badge variants
 * @type {Object}
 */
const VARIANTS = {
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

/**
 * Badge sizes
 * @type {Object}
 */
const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

const VARIANT_KEYS = Object.values(VARIANTS);
const SIZE_KEYS = Object.values(SIZES);

export { SIZES, SIZE_KEYS, VARIANTS, VARIANT_KEYS };

