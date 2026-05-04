/**
 * NotFoundScreen Component - Web
 * 404 not found screen for Web platform
 * File: NotFoundScreen.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { Button, Text } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledNotFoundContainer,
  StyledContent,
  StyledMessageSection,
  StyledMessageWrapper,
  StyledButtonRow,
} from './NotFoundScreen.web.styles';

// 5. Component-specific hook (relative import)
import useNotFoundScreen from './useNotFoundScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

/**
 * NotFoundScreen component for Web
 * @param {Object} props - NotFoundScreen props
 */
const NotFoundScreenWeb = (props) => {
  const { t } = useI18n();
  const { handleBack, handleGoHome } = useNotFoundScreen();

  return (
    <StyledNotFoundContainer
      aria-label={t('notFound.title')}
      testID="not-found-screen"
    >
      <StyledContent>
        <StyledMessageSection>
          <Text
            variant="h1"
            align="center"
            accessibilityRole="header"
            testID="not-found-title"
          >
            {t('notFound.title')}
          </Text>
          <StyledMessageWrapper>
            <Text variant="body" align="center" testID="not-found-message">
              {t('notFound.message')}
            </Text>
          </StyledMessageWrapper>
        </StyledMessageSection>

        <StyledButtonRow>
          <Button
            variant="primary"
            size="large"
            onPress={handleBack}
            accessibilityLabel={t('notFound.back')}
            accessibilityHint={t('notFound.backHint')}
            testID="not-found-back-button"
          >
            {t('notFound.back')}
          </Button>
          <Button
            variant="secondary"
            size="large"
            onPress={handleGoHome}
            accessibilityLabel={t('notFound.goHome')}
            accessibilityHint={t('notFound.goHomeHint')}
            testID="not-found-go-home-button"
          >
            {t('notFound.goHome')}
          </Button>
        </StyledButtonRow>
      </StyledContent>
    </StyledNotFoundContainer>
  );
};

export default NotFoundScreenWeb;

