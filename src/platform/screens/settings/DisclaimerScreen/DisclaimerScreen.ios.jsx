/**
 * DisclaimerScreen Component - iOS
 * File: DisclaimerScreen.ios.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledSection,
  StyledNotice,
} from './DisclaimerScreen.ios.styles';
import useDisclaimerScreen from './useDisclaimerScreen';

const DisclaimerScreenIOS = () => {
  const { t } = useI18n();
  const { testIds, intendedUse, acknowledged, acknowledge } = useDisclaimerScreen();

  return (
    <StyledContainer accessibilityLabel={t('settings.disclaimer.screen.label')} testID={testIds.screen}>
      <ScrollView>
        <StyledContent testID={testIds.content}>
          <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
            {t('settings.disclaimer.title')}
          </Text>
          <Stack spacing="lg">
            <StyledSection>
              <Text variant="body">{t('settings.disclaimer.prototypeFraming')}</Text>
            </StyledSection>
            <StyledSection testID={testIds.datasetNotice}>
              <Text variant="h3" accessibilityRole="header">
                {t('settings.disclaimer.datasetNotice')}
              </Text>
              <StyledNotice>
                <Text variant="body">
                  {intendedUse?.warning ?? t('settings.disclaimer.prototypeFraming')}
                </Text>
              </StyledNotice>
            </StyledSection>
            {!acknowledged && (
              <StyledSection>
                <Button
                  label={t('settings.disclaimer.acknowledge')}
                  accessibilityLabel={t('settings.disclaimer.acknowledge')}
                  accessibilityHint={t('settings.disclaimer.acknowledgeHint')}
                  onPress={acknowledge}
                  testID={testIds.acknowledgeButton}
                />
              </StyledSection>
            )}
          </Stack>
        </StyledContent>
      </ScrollView>
    </StyledContainer>
  );
};

export default DisclaimerScreenIOS;
