/**
 * ErrorScreen Component - Android
 * Generic error screen for Android platform
 * File: ErrorScreen.android.jsx
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
  StyledContentWrapper,
  StyledScrollViewContent,
  StyledMessageWrapper,
} from './ErrorScreen.android.styles';

// 5. Component-specific hook (relative import)
import useErrorScreen from './useErrorScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

/**
 * ErrorScreen component for Android
 * @param {Object} props - ErrorScreen props
 * @param {Function} [props.onRetry] - Retry handler (if applicable)
 */
const ErrorScreenAndroid = ({ onRetry, ...rest }) => {
  const { t } = useI18n();
  const { handleGoHome, handleRetry, hasRetry } = useErrorScreen({ onRetry });

  return (
    <StyledContentWrapper
      accessibilityLabel={t('error.title')}
      testID="error-screen"
    >
      <StyledScrollViewContent>
        <StyledErrorContainer>
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
              <Text
                variant="body"
                align="center"
                testID="error-message"
              >
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
      </StyledScrollViewContent>
    </StyledContentWrapper>
  );
};

export default ErrorScreenAndroid;

