/**
 * EmptyState Pattern - Web
 * Icon + Message + Action button composition
 * File: EmptyState.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { Text, Button } from '@platform/components';

// 3. Styles (relative import - platform-specific)
import { StyledContainer, StyledIcon, StyledMessage, StyledAction } from './EmptyState.web.styles';

/**
 * EmptyState component for Web
 * @param {Object} props - EmptyState props
 * @param {React.ReactNode|string} props.icon - Icon component or emoji
 * @param {string} props.title - Title text
 * @param {string} props.message - Description message
 * @param {string} props.actionLabel - Action button label
 * @param {Function} props.onAction - Action button handler
 * @param {React.ReactNode} props.children - Additional content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const EmptyStateWeb = ({
  icon = '📦',
  title,
  message,
  actionLabel,
  onAction,
  children,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  return (
    <StyledContainer
      className={className}
      style={style}
      data-testid={testID}
      role="status"
      aria-label={accessibilityLabel || title}
      {...rest}
    >
      <StyledIcon testID={testID ? `${testID}-icon` : undefined}>
        {typeof icon === 'string' ? icon : icon}
      </StyledIcon>
      {title && (
        <Text
          variant="h3"
          testID={testID ? `${testID}-title` : undefined}
        >
          {title}
        </Text>
      )}
      {message && (
        <StyledMessage
          variant="body"
          color="secondary"
          testID={testID ? `${testID}-message` : undefined}
        >
          {message}
        </StyledMessage>
      )}
      {children}
      {actionLabel && onAction && (
        <StyledAction
          variant="primary"
          onClick={onAction}
          accessibilityLabel={actionLabel}
          testID={testID ? `${testID}-action` : undefined}
        >
          {actionLabel}
        </StyledAction>
      )}
    </StyledContainer>
  );
};

export default EmptyStateWeb;

