/**
 * PrivacyScreen Component - Android
 * File: PrivacyScreen.android.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { Text, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection } from './PrivacyScreen.android.styles';
import usePrivacyScreen from './usePrivacyScreen';

const PrivacyScreenAndroid = () => {
  const { t } = useI18n();
  const { testIds } = usePrivacyScreen();

  return (
    <StyledContainer accessibilityLabel={t('settings.privacy.screen.label')} testID={testIds.screen}>
      <ScrollView>
        <StyledContent testID={testIds.content}>
          <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
            {t('settings.privacy.title')}
          </Text>
          <Stack spacing="lg">
            <StyledSection>
              <Text variant="h3" accessibilityRole="header">
                {t('settings.privacy.localStorage')}
              </Text>
              <Text variant="body">{t('settings.privacy.localStorageDescription')}</Text>
            </StyledSection>
            <StyledSection>
              <Text variant="body">{t('settings.privacy.optionalAI')}</Text>
            </StyledSection>
          </Stack>
        </StyledContent>
      </ScrollView>
    </StyledContainer>
  );
};

export default PrivacyScreenAndroid;
