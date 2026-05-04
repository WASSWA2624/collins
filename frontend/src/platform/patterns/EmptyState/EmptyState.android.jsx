/**
 * EmptyState Pattern - Android
 * Icon + Message + Action button composition
 * File: EmptyState.android.jsx
 */
import React from 'react';
import { Text } from '@platform/components';
import { Button } from '@platform/components';
import { StyledContainer, StyledIcon, StyledMessage, StyledAction } from './EmptyState.android.styles';

const EmptyStateAndroid = ({
  icon = '📦',
  title,
  message,
  actionLabel,
  onAction,
  children,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  return (
    <StyledContainer
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
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
          onPress={onAction}
          accessibilityLabel={actionLabel}
          testID={testID ? `${testID}-action` : undefined}
        >
          {actionLabel}
        </StyledAction>
      )}
    </StyledContainer>
  );
};

export default EmptyStateAndroid;

