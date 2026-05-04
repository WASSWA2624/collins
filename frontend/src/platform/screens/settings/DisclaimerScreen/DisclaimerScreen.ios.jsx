/**
 * DisclaimerScreen Component - iOS
 * File: DisclaimerScreen.ios.jsx
 */
import React from 'react';
import { Text, Button, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledContentWrap,
  StyledSection,
  StyledNotice,
  StyledButtonWrap,
} from './DisclaimerScreen.ios.styles';
import useDisclaimerScreen from './useDisclaimerScreen';

const DisclaimerScreenIOS = () => {
  const { t } = useI18n();
  const { testIds, intendedUse, acknowledged, acknowledge, decline } = useDisclaimerScreen();

  return (
    <StyledContainer accessibilityLabel={t('settings.disclaimer.screen.label')} testID={testIds.screen}>
      <StyledContentWrap>
        <StyledContent testID={testIds.content}>
          <Stack spacing="lg">
            <StyledSection>
              <Text variant="body">{t('settings.disclaimer.prototypeFraming')}</Text>
            </StyledSection>
            <StyledSection testID={testIds.datasetNotice}>
              <Text variant="h3">
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
                <StyledButtonWrap>
                  <Stack spacing="md">
                    <Button
                      text={t('settings.disclaimer.acknowledge')}
                      size="large"
                      accessibilityLabel={t('settings.disclaimer.acknowledge')}
                      accessibilityHint={t('settings.disclaimer.acknowledgeHint')}
                      onPress={acknowledge}
                      testID={testIds.acknowledgeButton}
                    />
                    <Button
                      variant="outline"
                      text={t('settings.disclaimer.decline')}
                      size="large"
                      accessibilityLabel={t('settings.disclaimer.decline')}
                      accessibilityHint={t('settings.disclaimer.declineHint')}
                      onPress={decline}
                      testID={testIds.declineButton}
                    />
                  </Stack>
                </StyledButtonWrap>
              </StyledSection>
            )}
          </Stack>
        </StyledContent>
      </StyledContentWrap>
    </StyledContainer>
  );
};

export default DisclaimerScreenIOS;
