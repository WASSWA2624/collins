/**
 * ErrorState Pattern - Web
 * Icon + Message + Retry button composition
 * File: ErrorState.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { Text, Button } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer, StyledIcon, StyledMessage, StyledRetryButton } from './ErrorState.web.styles';

/**
 * ErrorState component for Web
 * @param {Object} props - ErrorState props
 * @param {React.ReactNode|string} props.icon - Icon component or emoji
 * @param {string} props.title - Title text (i18n key or string)
 * @param {string} props.message - Error message (i18n key or string)
 * @param {string} props.retryLabel - Retry button label (i18n key or string)
 * @param {Function} props.onRetry - Retry button handler
 * @param {React.ReactNode} props.children - Additional content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ErrorStateWeb = ({
  icon = '⚠️',
  title,
  message,
  retryLabel,
  onRetry,
  children,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const titleText = title || t('errorState.defaultTitle');
  const retryLabelText = retryLabel || t('common.retry');
  return (
    <StyledContainer
      className={className}
      style={style}
      data-testid={testID}
      role="alert"
      aria-label={accessibilityLabel || titleText}
      {...rest}
    >
      <StyledIcon testID={testID ? `${testID}-icon` : undefined}>
        {typeof icon === 'string' ? icon : icon}
      </StyledIcon>
      {titleText && (
        <Text
          variant="h3"
          testID={testID ? `${testID}-title` : undefined}
        >
          {titleText}
        </Text>
      )}
      {message && (
        <StyledMessage
          variant="body"
          color="error"
          testID={testID ? `${testID}-message` : undefined}
        >
          {message}
        </StyledMessage>
      )}
      {children}
      {onRetry && (
        <StyledRetryButton
          variant="primary"
          onClick={onRetry}
          accessibilityLabel={retryLabelText}
          testID={testID ? `${testID}-retry` : undefined}
        >
          {retryLabelText}
        </StyledRetryButton>
      )}
    </StyledContainer>
  );
};

export default ErrorStateWeb;

