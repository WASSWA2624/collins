/**
 * OnboardingScreen - Web (P013)
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { Button, Text, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import useOnboardingScreen from './useOnboardingScreen';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './OnboardingScreen.web.styles';
import { ONBOARDING_TEST_IDS } from './types';

const OnboardingScreenWeb = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    currentStepId,
    stepTitle,
    stepBody,
    isFirst,
    isLast,
    goNext,
    goBack,
    testIds,
  } = useOnboardingScreen();

  const handleDone = () => router.replace('/');
  const handleBack = () => (isFirst ? router.back() : goBack());

  return (
    <StyledContainer aria-label={t('settings.onboarding.accessibilityLabel')} data-testid={testIds.screen} role="main">
      <StyledContent>
        <Text as="h1" variant="h1" data-testid={testIds.title}>
          {t('settings.onboarding.title')}
        </Text>
        <StyledSection>
          <Text as="h2" variant="h3" data-testid={testIds.stepTitle}>
            {stepTitle(currentStepId)}
          </Text>
          <Text variant="body" data-testid={testIds.stepBody}>
            {stepBody(currentStepId)}
          </Text>
        </StyledSection>
        <StyledActions>
          <Button variant="outline" onPress={handleBack} data-testid={testIds.back} accessibilityLabel={t('settings.onboarding.actions.back')}>
            {t('settings.onboarding.actions.back')}
          </Button>
          {isLast ? (
            <Button variant="primary" onPress={handleDone} data-testid={testIds.done} accessibilityLabel={t('settings.onboarding.actions.done')}>
              {t('settings.onboarding.actions.done')}
            </Button>
          ) : (
            <Button variant="primary" onPress={goNext} data-testid={testIds.next} accessibilityLabel={t('settings.onboarding.actions.next')}>
              {t('settings.onboarding.actions.next')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default OnboardingScreenWeb;
