/**
 * EmptyState Component - Web
 * Empty state display with icon, title, description, and optional action
 * File: EmptyState.web.jsx
 */

import React from 'react';
import { StyledEmptyState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer } from './EmptyState.web.styles';
import { useEmptyState } from './useEmptyState';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * EmptyState component for Web
 * @param {Object} props - EmptyState props
 * @param {string} props.size - EmptyState size (small, medium, large)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string|React.ReactNode} props.title - Title text
 * @param {string|React.ReactNode} props.description - Description text
 * @param {React.ReactNode} props.action - Action button or element
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const EmptyStateWeb = ({
  size = SIZES.MEDIUM,
  icon,
  title,
  description,
  action,
  accessibilityLabel,
  testID,
  className,
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
      role="status"
      aria-label={defaultAccessibilityLabel}
      data-testid={testID}
      testID={testID}
      className={className}
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

export default EmptyStateWeb;

