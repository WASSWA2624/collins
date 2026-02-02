/**
 * OnboardingScreen - Android (P013)
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { Button, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useOnboardingScreen from './useOnboardingScreen';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './OnboardingScreen.android.styles';
import { ONBOARDING_TEST_IDS } from './types';

const OnboardingScreenAndroid = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { currentStepId, stepTitle, stepBody, isFirst, isLast, goNext, goBack, testIds } = useOnboardingScreen();

  const handleDone = () => router.replace('/');
  const handleBack = () => (isFirst ? router.back() : goBack());

  return (
    <StyledContainer testID={testIds.screen} accessibilityLabel={t('settings.onboarding.accessibilityLabel')}>
      <StyledContent>
        <Text variant="h1" testID={testIds.title}>{t('settings.onboarding.title')}</Text>
        <StyledSection>
          <Text variant="h3" testID={testIds.stepTitle}>{stepTitle(currentStepId)}</Text>
          <Text variant="body" testID={testIds.stepBody}>{stepBody(currentStepId)}</Text>
        </StyledSection>
        <StyledActions>
          <Button variant="outline" onPress={handleBack} testID={testIds.back} accessibilityLabel={t('settings.onboarding.actions.back')}>
            {t('settings.onboarding.actions.back')}
          </Button>
          {isLast ? (
            <Button variant="primary" onPress={handleDone} testID={testIds.done} accessibilityLabel={t('settings.onboarding.actions.done')}>
              {t('settings.onboarding.actions.done')}
            </Button>
          ) : (
            <Button variant="primary" onPress={goNext} testID={testIds.next} accessibilityLabel={t('settings.onboarding.actions.next')}>
              {t('settings.onboarding.actions.next')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default OnboardingScreenAndroid;
