/**
 * TabBar Component Types
 * Shared types and constants for TabBar component
 * File: types.js
 */

/**
 * Tab item prop types
 * @typedef {Object} TabItem
 * @property {string} id - Unique identifier for the tab
 * @property {string} label - Tab label (user-facing text)
 * @property {string} [href] - Route path for navigation
 * @property {string|React.ReactNode} [icon] - Tab icon (text emoji or component)
 * @property {Function} [onPress] - Custom press handler for the tab
 * @property {boolean} [badge] - Whether to show a badge
 * @property {number} [badgeCount] - Badge count (shows "99+" if > 99)
 */

/**
 * TabBar prop types
 * @typedef {Object} TabBarProps
 * @property {Array<TabItem>} [items] - Array of tab items
 * @property {Function} [onTabPress] - Tab press handler
 * @property {Function} [isTabVisible] - Function to check tab visibility
 * @property {string} [accessibilityLabel] - Accessibility label
 * @property {string} [testID] - Test identifier
 * @property {Object} [style] - Additional styles
 */

