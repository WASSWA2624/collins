/**
 * EmptyState Component - iOS
 * Empty state display with icon, title, description, and optional action
 * File: EmptyState.ios.jsx
 */

import React from 'react';
import { StyledEmptyState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer } from './EmptyState.ios.styles';
import { useEmptyState } from './useEmptyState';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * EmptyState component for iOS
 * @param {Object} props - EmptyState props
 * @param {string} props.size - EmptyState size (small, medium, large)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string|React.ReactNode} props.title - Title text
 * @param {string|React.ReactNode} props.description - Description text
 * @param {React.ReactNode} props.action - Action button or element
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const EmptyStateIOS = ({
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
  const { t } = useI18n();
  const emptyState = useEmptyState({ size });
  
  // Determine if we should use title as label (only for non-empty strings)
  const canUseTitleAsLabel = typeof title === 'string' && title !== '';
  const defaultAccessibilityLabel = accessibilityLabel || (canUseTitleAsLabel ? title : t('common.emptyState'));

  return (
    <StyledEmptyState
      size={emptyState.size}
      accessibilityRole="status"
      accessibilityLabel={defaultAccessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      {icon && (
        <StyledIconContainer size={emptyState.size}>
          {icon}
        </StyledIconContainer>
      )}
      {title && (
        <StyledTitle size={emptyState.size}>
          {title}
        </StyledTitle>
      )}
      {description && (
        <StyledDescription size={emptyState.size}>
          {description}
        </StyledDescription>
      )}
      {action && (
        <StyledActionContainer>
          {action}
        </StyledActionContainer>
      )}
    </StyledEmptyState>
  );
};

export default EmptyStateIOS;

