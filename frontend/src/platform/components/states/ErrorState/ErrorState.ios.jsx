/**
 * ErrorState Component - iOS
 * Error state display with icon, title, description, and optional retry action
 * File: ErrorState.ios.jsx
 */

import React from 'react';
import { StyledErrorState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer } from './ErrorState.ios.styles';
import { useErrorState } from './useErrorState';
import { SIZES } from './types';

/**
 * ErrorState component for iOS
 * @param {Object} props - ErrorState props
 * @param {string} props.size - ErrorState size (small, medium, large)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string|React.ReactNode} props.title - Title text (should be i18n'd by consumer)
 * @param {string|React.ReactNode} props.description - Description text (should be i18n'd by consumer)
 * @param {React.ReactNode} props.action - Retry action button or element
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ErrorStateIOS = ({
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
  const errorState = useErrorState({ size });

  return (
    <StyledErrorState
      size={errorState.size}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || (typeof title === 'string' ? title : undefined)}
      testID={testID}
      style={style}
      {...rest}
    >
      {icon && (
        <StyledIconContainer size={errorState.size}>
          {icon}
        </StyledIconContainer>
      )}
      {title && (
        <StyledTitle size={errorState.size}>
          {title}
        </StyledTitle>
      )}
      {description && (
        <StyledDescription size={errorState.size}>
          {description}
        </StyledDescription>
      )}
      {action && (
        <StyledActionContainer>
          {action}
        </StyledActionContainer>
      )}
    </StyledErrorState>
  );
};

export default ErrorStateIOS;

