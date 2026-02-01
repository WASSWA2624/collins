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
} from './DisclaimerScreen.web.styles';
import useDisclaimerScreen from './useDisclaimerScreen';

const DisclaimerScreenWeb = () => {
  const { t } = useI18n();
  const { testIds, intendedUse, acknowledged, acknowledge } = useDisclaimerScreen();

  return (
    <StyledContainer aria-label={t('settings.disclaimer.screen.label')} data-testid={testIds.screen}>
      <StyledContent data-testid={testIds.content}>
        <Text as="h1" variant="h1" data-testid={testIds.title}>
          {t('settings.disclaimer.title')}
        </Text>
        <Stack spacing="lg">
          <StyledSection>
            <Text variant="body">{t('settings.disclaimer.prototypeFraming')}</Text>
          </StyledSection>
          <StyledSection data-testid={testIds.datasetNotice}>
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
    </StyledContainer>
  );
};

export default DisclaimerScreenWeb;
