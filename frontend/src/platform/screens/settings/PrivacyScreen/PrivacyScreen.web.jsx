/**
 * PrivacyScreen Component - Web
 * File: PrivacyScreen.web.jsx
 */
import React from 'react';
import { Text, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection } from './PrivacyScreen.web.styles';
import usePrivacyScreen from './usePrivacyScreen';

const PrivacyScreenWeb = () => {
  const { t } = useI18n();
  const { testIds } = usePrivacyScreen();

  return (
    <StyledContainer aria-label={t('settings.privacy.screen.label')} data-testid={testIds.screen}>
      <StyledContent data-testid={testIds.content}>
        <Text as="h1" variant="h1" data-testid={testIds.title}>
          {t('settings.privacy.title')}
        </Text>
        <Stack spacing="lg">
          <StyledSection>
            <Text as="h2" variant="h3">
              {t('settings.privacy.localStorage')}
            </Text>
            <Text variant="body">{t('settings.privacy.localStorageDescription')}</Text>
          </StyledSection>
          <StyledSection>
            <Text variant="body">{t('settings.privacy.optionalAI')}</Text>
          </StyledSection>
        </Stack>
      </StyledContent>
    </StyledContainer>
  );
};

export default PrivacyScreenWeb;
