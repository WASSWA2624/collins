/**
 * SearchBar Types
 * Type definitions and constants for SearchBar pattern
 * File: types.js
 */

/**
 * SearchBar prop types (for documentation)
 * @typedef {Object} SearchBarProps
 * @property {string} value - Search value
 * @property {Function} onChange - Change handler (web)
 * @property {Function} onChangeText - Change handler (native)
 * @property {Function} onSearch - Search handler (called on submit/enter or debounced)
 * @property {string} placeholder - Placeholder text (i18n key or string)
 * @property {boolean} showClearButton - Show clear button when value exists
 * @property {number} debounceMs - Debounce delay in milliseconds
 * @property {string} accessibilityLabel - Accessibility label (i18n key or string)
 * @property {string} testID - Test identifier
 * @property {string} className - Additional CSS class (web)
 * @property {Object} style - Additional styles
 */

// Export empty object for type definitions
// Ensure module is executed for coverage
const types = {};

export { types };

