/**
 * OfflineState Component - iOS
 * Offline state display with icon, title, description, and optional retry action
 * File: OfflineState.ios.jsx
 */

import React from 'react';
import { StyledOfflineState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer } from './OfflineState.ios.styles';
import { useOfflineState } from './useOfflineState';
import { SIZES } from './types';

/**
 * OfflineState component for iOS
 * @param {Object} props - OfflineState props
 * @param {string} props.size - OfflineState size (small, medium, large)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string|React.ReactNode} props.title - Title text (should be i18n'd by consumer)
 * @param {string|React.ReactNode} props.description - Description text (should be i18n'd by consumer)
 * @param {React.ReactNode} props.action - Retry action button or element
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const OfflineStateIOS = ({
  size = SIZES.MEDIUM,
  icon,
  title,
  description,
  action,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const offlineState = useOfflineState({ size });

  return (
    <StyledOfflineState
      size={offlineState.size}
      accessibilityRole="status"
      accessibilityLabel={accessibilityLabel || (typeof title === 'string' ? title : undefined)}
      testID={testID}
      style={style}
      {...rest}
    >
      {icon && (
        <StyledIconContainer size={offlineState.size}>
          {icon}
        </StyledIconContainer>
      )}
      {title && (
        <StyledTitle size={offlineState.size}>
          {title}
        </StyledTitle>
      )}
      {description && (
        <StyledDescription size={offlineState.size}>
          {description}
        </StyledDescription>
      )}
      {action && (
        <StyledActionContainer>
          {action}
        </StyledActionContainer>
      )}
    </StyledOfflineState>
  );
};

export default OfflineStateIOS;

