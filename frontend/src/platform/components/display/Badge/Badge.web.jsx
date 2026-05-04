/**
 * Badge Component - Web
 * Status indicators and counts
 * File: Badge.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 4. Styles (relative import - platform-specific)
import { StyledBadge, StyledBadgeText } from './Badge.web.styles';

// 5. Component-specific hook (relative import)
import { useBadge } from './useBadge';

/**
 * Badge component for Web
 * @param {Object} props - Badge props
 * @param {string} props.variant - Badge variant (primary, success, warning, error)
 * @param {string} props.size - Badge size (small, medium, large)
 * @param {string|number} props.children - Badge content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const BadgeWeb = ({
  variant,
  size,
  children,
  accessibilityLabel,
  testID,
  className,
  ...rest
}) => {
  const resolved = useBadge({ variant, size, children, accessibilityLabel });

  return (
    <StyledBadge
      {...rest}
      variant={resolved.variant}
      size={resolved.size}
      role="status"
      aria-label={resolved.accessibilityLabel}
      testID={testID}
      className={className}
    >
      <StyledBadgeText variant={resolved.variant} size={resolved.size}>
        {children}
      </StyledBadgeText>
    </StyledBadge>
  );
};

export default BadgeWeb;

