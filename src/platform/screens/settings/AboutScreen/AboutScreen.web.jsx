/**
 * AboutScreen Component - Web
 * File: AboutScreen.web.jsx
 */
import React from 'react';
import { Text, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection } from './AboutScreen.web.styles';
import useAboutScreen from './useAboutScreen';

const APP_VERSION = '1.0.0';

const AboutScreenWeb = () => {
  const { t } = useI18n();
  const { testIds } = useAboutScreen();

  return (
    <StyledContainer aria-label={t('settings.about.screen.label')} data-testid={testIds.screen}>
      <StyledContent data-testid={testIds.content}>
        <Text as="h1" variant="h1" data-testid={testIds.title}>
          {t('settings.about.title')}
        </Text>
        <Stack spacing="lg">
          <StyledSection>
            <Text as="h2" variant="h3">
              {t('settings.about.appName')}
            </Text>
            <Text variant="body">
              {t('settings.about.version')}: {APP_VERSION}
            </Text>
          </StyledSection>
          <StyledSection>
            <Text variant="body">{t('settings.about.prototypeScope')}</Text>
          </StyledSection>
        </Stack>
      </StyledContent>
    </StyledContainer>
  );
};

export default AboutScreenWeb;
