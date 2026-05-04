/**
 * PasswordField Component Types
 * Defines password strength levels and constants
 * File: types.js
 */

/**
 * Password strength levels
 * @type {Object}
 */
const PASSWORD_STRENGTH = {
  WEAK: 0,
  FAIR: 1,
  GOOD: 2,
  STRONG: 3,
  VERY_STRONG: 4,
};

/**
 * Password strength labels
 * Note: These labels are deprecated. Use i18n in components instead.
 * @type {Object}
 * @deprecated Use i18n translation keys in components
 */
const PASSWORD_STRENGTH_LABELS = {
  [PASSWORD_STRENGTH.WEAK]: 'Weak',
  [PASSWORD_STRENGTH.FAIR]: 'Fair',
  [PASSWORD_STRENGTH.GOOD]: 'Good',
  [PASSWORD_STRENGTH.STRONG]: 'Strong',
  [PASSWORD_STRENGTH.VERY_STRONG]: 'Very Strong',
};

// Password strength colors are now resolved from theme in usePasswordField hook
// No longer exported as constants to enforce theme-driven design

export {
  PASSWORD_STRENGTH,
  PASSWORD_STRENGTH_LABELS,
};

