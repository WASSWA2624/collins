/**
 * FilterBar Types
 * Type definitions and constants for FilterBar pattern
 * File: types.js
 */

/**
 * Filter object structure
 * @typedef {Object} FilterItem
 * @property {string} id - Unique identifier for the filter
 * @property {string} label - Display label for the filter
 * @property {boolean} active - Whether the filter is currently active
 * @property {Function} [onRemove] - Optional handler to remove this filter
 */

/**
 * FilterBar prop types (for documentation)
 * @typedef {Object} FilterBarProps
 * @property {Array<FilterItem>} filters - Array of filter objects
 * @property {Function} [onFilterPress] - Handler when filter is pressed/toggled
 * @property {Function} [onClearAll] - Handler to clear all active filters
 * @property {boolean} [showClearAll] - Show clear all button (default: true)
 * @property {string} [accessibilityLabel] - Accessibility label (i18n key or string)
 * @property {string} [testID] - Test identifier
 * @property {string} [className] - Additional CSS class (web)
 * @property {Object} [style] - Additional styles
 */

// Export empty object for type definitions
// Ensure module is executed for coverage
const types = {};

export { types };

