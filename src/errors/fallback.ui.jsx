/**
 * Fallback UI Component
 * Generic error fallback (minimal, theme-driven)
 * File: fallback.ui.jsx
 */
import React from 'react';
import { tSync } from '@i18n';
import {
  StyledContainer,
  StyledTitle,
  StyledMessage,
  StyledRetryButton,
  StyledRetryText,
} from './fallback.ui.styles';

const FallbackUI = ({ error, onRetry }) => {
  const title = tSync('errors.fallback.title');
  const message = error?.safeMessage || tSync('errors.fallback.message');
  const retry = tSync('errors.fallback.retry');
  const retryHint = tSync('errors.fallback.retryHint');

  return (
    <StyledContainer>
      <StyledTitle accessibilityRole="header">{title}</StyledTitle>
      <StyledMessage>{message}</StyledMessage>
      {onRetry && (
        <StyledRetryButton
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retry}
          accessibilityHint={retryHint}
        >
          <StyledRetryText>{retry}</StyledRetryText>
        </StyledRetryButton>
      )}
    </StyledContainer>
  );
};

export default FallbackUI;

