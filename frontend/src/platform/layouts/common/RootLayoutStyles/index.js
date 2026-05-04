/**
 * RootLayoutStyles Component
 * Barrel export for root layout styles.
 * File: index.js
 *
 * Rules enforced:
 * - index.js is required for barrel files (not index.jsx)
 * - Exports must come from `.web` file for Jest compatibility; Metro resolves platform files.
 */

export {
  StyledRootContainer,
  StyledLoadingContainer,
  StyledActivityIndicator,
} from './RootLayoutStyles.web.styles';

