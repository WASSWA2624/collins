/**
 * DisclaimerScreen Component - Web
 * File: DisclaimerScreen.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components
import { Button, Text } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import { StyledActions, StyledContainer, StyledContent } from './DisclaimerScreen.web.styles';

// 5. Component hook
import useDisclaimerScreen from './useDisclaimerScreen';

const DisclaimerScreenWeb = () => {
  const { t } = useI18n();
  const { acknowledged, handleAcknowledge } = useDisclaimerScreen();

  const title = t('settings.disclaimer.title');
  const message = t('settings.disclaimer.message');
  const buttonLabel = acknowledged
    ? t('settings.disclaimer.acknowledged')
    : t('settings.disclaimer.acknowledge');

  return (
    <StyledContainer aria-label={title} testID="disclaimer-screen">
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="disclaimer-title">
          {title}
        </Text>
        <Text variant="body" testID="disclaimer-message">
          {message}
        </Text>
        <StyledActions>
          <Button
            variant="primary"
            size="large"
            onPress={handleAcknowledge}
            disabled={acknowledged}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
            accessibilityHint={t('settings.disclaimer.acknowledgeHint')}
            testID="disclaimer-acknowledge-button"
          >
            {buttonLabel}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default DisclaimerScreenWeb;

