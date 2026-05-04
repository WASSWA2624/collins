/**
 * NotFoundScreen Component - iOS
 * 404 not found screen for iOS platform
 * File: NotFoundScreen.ios.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { Button, Text } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledContentWrap,
  StyledNotFoundContainer,
  StyledContent,
  StyledMessageSection,
  StyledMessageWrapper,
} from './NotFoundScreen.ios.styles';

// 5. Component-specific hook (relative import)
import useNotFoundScreen from './useNotFoundScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

/**
 * NotFoundScreen component for iOS
 * @param {Object} props - NotFoundScreen props
 */
const NotFoundScreenIOS = (props) => {
  const { t } = useI18n();
  const { handleBack, handleGoHome } = useNotFoundScreen();

  return (
    <StyledContentWrap
      accessibilityLabel={t('notFound.title')}
      testID="not-found-screen"
    >
      <StyledNotFoundContainer>
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
              <Text
                variant="body"
                align="center"
                testID="not-found-message"
              >
                {t('notFound.message')}
              </Text>
            </StyledMessageWrapper>
          </StyledMessageSection>

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
        </StyledContent>
      </StyledNotFoundContainer>
    </StyledContentWrap>
  );
};

export default NotFoundScreenIOS;

