/**
 * Button Component Types
 * Defines variants, sizes, and prop types
 * File: types.js
 */

/**
 * Button variants
 * @type {Object}
 */
export const VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  TEXT: 'text',
};

/**
 * Button sizes
 * @type {Object}
 */
export const SIZES = {
  SMALL: 'small',   // 44px height (minimum touch target)
  MEDIUM: 'medium', // 48px height
  LARGE: 'large',   // 56px height
};

/**
 * Button states
 * @type {Object}
 */
export const STATES = {
  DEFAULT: 'default',
  HOVER: 'hover',
  ACTIVE: 'active',
  DISABLED: 'disabled',
  LOADING: 'loading',
};
