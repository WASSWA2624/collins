/**
 * DisclaimerScreen Component - Web
 * File: DisclaimerScreen.web.jsx
 */
import React from 'react';
import { Text, Button, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledSection,
  StyledNotice,
  StyledButtonWrap,
} from './DisclaimerScreen.web.styles';
import useDisclaimerScreen from './useDisclaimerScreen';

const DisclaimerScreenWeb = () => {
  const { t } = useI18n();
  const { testIds, intendedUse, acknowledged, acknowledge, decline } = useDisclaimerScreen();
  const getNativeTestProps = (testID) =>
    process.env.JEST_WORKER_ID ? { testID } : {};

  return (
    <StyledContainer
      aria-label={t('settings.disclaimer.screen.label')}
      data-testid={testIds.screen}
      {...getNativeTestProps(testIds.screen)}
    >
      <StyledContent
        data-testid={testIds.content}
        {...getNativeTestProps(testIds.content)}
      >
        <Stack spacing="lg">
          <StyledSection>
            <Text variant="body">{t('settings.disclaimer.prototypeFraming')}</Text>
          </StyledSection>
          <StyledSection
            data-testid={testIds.datasetNotice}
            {...getNativeTestProps(testIds.datasetNotice)}
          >
            <Text as="h2" variant="h3">
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
    </StyledContainer>
  );
};

export default DisclaimerScreenWeb;
