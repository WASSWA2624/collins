/**
 * ErrorScreen Component - Web
 * Generic error screen for Web platform
 * File: ErrorScreen.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { Button, Text } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledErrorContainer,
  StyledContent,
  StyledMessageSection,
  StyledButtonGroup,
  StyledMessageWrapper,
} from './ErrorScreen.web.styles';

// 5. Component-specific hook (relative import)
import useErrorScreen from './useErrorScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

/**
 * ErrorScreen component for Web
 * @param {Object} props - ErrorScreen props
 * @param {Function} [props.onRetry] - Retry handler (if applicable)
 */
const ErrorScreenWeb = ({ onRetry, ...rest }) => {
  const { t } = useI18n();
  const { handleGoHome, handleRetry, hasRetry } = useErrorScreen({ onRetry });

  return (
    <StyledErrorContainer
      aria-label={t('error.title')}
      accessibilityLabel={t('error.title')}
      testID="error-screen"
    >
      <StyledContent>
        <StyledMessageSection>
          <Text
            variant="h1"
            align="center"
            accessibilityRole="header"
            testID="error-title"
          >
            {t('error.title')}
          </Text>
          <StyledMessageWrapper>
            <Text variant="body" align="center" testID="error-message">
              {t('error.message')}
            </Text>
          </StyledMessageWrapper>
        </StyledMessageSection>

        <StyledButtonGroup>
          {hasRetry && (
            <Button
              variant="primary"
              size="large"
              onPress={handleRetry}
              accessibilityLabel={t('error.retry')}
              accessibilityHint={t('error.retryHint')}
              testID="error-retry-button"
            >
              {t('error.retry')}
            </Button>
          )}
          <Button
            variant={hasRetry ? 'secondary' : 'primary'}
            size="large"
            onPress={handleGoHome}
            accessibilityLabel={t('error.goHome')}
            accessibilityHint={t('error.goHomeHint')}
            testID="error-go-home-button"
          >
            {t('error.goHome')}
          </Button>
        </StyledButtonGroup>
      </StyledContent>
    </StyledErrorContainer>
  );
};

export default ErrorScreenWeb;

