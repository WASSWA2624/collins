/**
 * Badge Component - iOS
 * Status indicators and counts
 * File: Badge.ios.jsx
 */

import React from 'react';
import { StyledBadge, StyledBadgeText } from './Badge.ios.styles';
import { useBadge } from './useBadge';

/**
 * Badge component for iOS
 * @param {Object} props - Badge props
 * @param {string} props.variant - Badge variant (primary, success, warning, error)
 * @param {string} props.size - Badge size (small, medium, large)
 * @param {string|number} props.children - Badge content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const BadgeIOS = ({
  variant,
  size,
  children,
  accessibilityLabel,
  testID,
  ...rest
}) => {
  const resolved = useBadge({ variant, size, children, accessibilityLabel });

  return (
    <StyledBadge
      {...rest}
      variant={resolved.variant}
      size={resolved.size}
      accessibilityRole="text"
      accessibilityLabel={resolved.accessibilityLabel}
      testID={testID}
      accessible
    >
      <StyledBadgeText variant={resolved.variant} size={resolved.size}>
        {children}
      </StyledBadgeText>
    </StyledBadge>
  );
};

export default BadgeIOS;

