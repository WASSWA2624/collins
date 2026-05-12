/**
 * AboutScreen Component - Android
 * File: AboutScreen.android.jsx
 */
import React from 'react';
import { Text, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledContentWrap, StyledSection } from './AboutScreen.android.styles';
import useAboutScreen from './useAboutScreen';

const APP_VERSION = '1.0.0';

const AboutScreenAndroid = () => {
  const { t } = useI18n();
  const { testIds } = useAboutScreen();

  return (
    <StyledContainer accessibilityLabel={t('settings.about.screen.label')} testID={testIds.screen}>
      <StyledContentWrap>
        <StyledContent testID={testIds.content}>
          <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
            {t('settings.about.title')}
          </Text>
          <Stack spacing="lg">
            <StyledSection>
              <Text variant="h3" accessibilityRole="header">
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
      </StyledContentWrap>
    </StyledContainer>
  );
};

export default AboutScreenAndroid;
