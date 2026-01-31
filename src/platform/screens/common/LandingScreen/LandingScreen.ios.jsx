/**
 * LandingScreen Component - iOS
 * File: LandingScreen.ios.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components
import { Button, Text } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import { StyledActions, StyledContainer, StyledContent } from './LandingScreen.ios.styles';

// 5. Component hook
import useLandingScreen from './useLandingScreen';

const LandingScreenIOS = () => {
  const { t } = useI18n();
  const { handleGetStarted } = useLandingScreen();

  return (
    <StyledContainer accessibilityLabel={t('landing.title')} testID="landing-screen">
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="landing-title">
          {t('landing.hero.title')}
        </Text>
        <Text variant="body" testID="landing-description">
          {t('landing.hero.description')}
        </Text>
        <StyledActions>
          <Button
            variant="primary"
            size="large"
            onPress={handleGetStarted}
            accessibilityRole="button"
            accessibilityLabel={t('landing.cta.getStarted')}
            accessibilityHint={t('landing.cta.getStartedHint')}
            testID="landing-get-started"
          >
            {t('landing.cta.getStarted')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default LandingScreenIOS;

