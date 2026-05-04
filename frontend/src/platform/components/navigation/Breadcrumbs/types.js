/**
 * Breadcrumbs Component Types
 * Shared types and constants for Breadcrumbs component
 * File: types.js
 */

/**
 * Breadcrumb item prop types
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - Breadcrumb label (user-facing text)
 * @property {string} [href] - Link URL (optional for current item)
 * @property {Function} [onPress] - Press handler (alternative to href)
 */

/**
 * Breadcrumbs prop types
 * @typedef {Object} BreadcrumbsProps
 * @property {Array<BreadcrumbItem>} [items] - Array of breadcrumb items
 * @property {string} [separator] - Separator character (default: '/')
 * @property {Function} [onItemPress] - Item press handler
 * @property {string} [accessibilityLabel] - Accessibility label
 * @property {string} [testID] - Test identifier
 * @property {string} [className] - Additional CSS class (web only)
 * @property {Object} [style] - Additional styles
 */

