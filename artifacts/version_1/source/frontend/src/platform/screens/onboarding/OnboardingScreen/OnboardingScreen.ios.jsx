/**
 * OnboardingScreen - iOS (P013)
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { Button, Checkbox, ClinicalSafetyNotice, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useOnboardingScreen from './useOnboardingScreen';
import {
  StyledContainer,
  StyledContent,
  StyledSection,
  StyledAcknowledgement,
  StyledActions,
} from './OnboardingScreen.ios.styles';
import { ONBOARDING_TEST_IDS } from './types';

const SCROLL_CONTENT_STYLE = { flexGrow: 1 };

const OnboardingScreenIos = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    currentStepId,
    stepTitle,
    stepBody,
    isFirst,
    isLast,
    clinicalSafetyAcknowledged,
    isPersistingSafety,
    syncErrorCode,
    canComplete,
    onboardingCompleted,
    goNext,
    goBack,
    setClinicalSafetyAcknowledged,
    completeOnboarding,
    testIds,
  } = useOnboardingScreen();

  const isSafetyStep = currentStepId === 'clinicalSafety';
  const handleDone = async () => {
    const completed = await completeOnboarding();
    if (completed) router.replace('/');
  };
  const handleBack = () => (isFirst ? router.back() : goBack());
  const handleNext = () => {
    if (isSafetyStep && !clinicalSafetyAcknowledged) return;
    goNext();
  };

  React.useEffect(() => {
    if (onboardingCompleted) router.replace('/');
  }, [onboardingCompleted, router]);

  if (onboardingCompleted) return null;

  return (
    <StyledContainer
      contentContainerStyle={SCROLL_CONTENT_STYLE}
      testID={testIds.screen}
      accessibilityLabel={t('settings.onboarding.accessibilityLabel')}
    >
      <StyledContent>
        <Text variant="h1" testID={testIds.title}>{t('settings.onboarding.title')}</Text>
        <StyledSection>
          <Text variant="h3" testID={testIds.stepTitle}>{stepTitle(currentStepId)}</Text>
          <Text variant="body" testID={testIds.stepBody}>{stepBody(currentStepId)}</Text>
          {isSafetyStep ? (
            <>
              <ClinicalSafetyNotice
                title={t('settings.onboarding.safety.title')}
                message={t('settings.onboarding.safety.body')}
                secondaryMessage={t('settings.onboarding.safety.secondary')}
                accessibilityLabel={t('settings.onboarding.safety.accessibilityLabel')}
                testID={testIds.safetyNotice}
              />
              <StyledAcknowledgement>
                <Checkbox
                  checked={clinicalSafetyAcknowledged}
                  disabled={isPersistingSafety}
                  label={t('settings.onboarding.safety.acknowledgeLabel')}
                  onChange={setClinicalSafetyAcknowledged}
                  accessibilityLabel={t('settings.onboarding.safety.acknowledgeLabel')}
                  accessibilityHint={t('settings.onboarding.safety.acknowledgeHint')}
                  testID={testIds.safetyAcknowledge}
                />
                {syncErrorCode ? (
                  <Text variant="caption" color="text.secondary" testID={testIds.syncNotice}>
                    {t('settings.onboarding.safety.syncDeferred')}
                  </Text>
                ) : null}
              </StyledAcknowledgement>
            </>
          ) : null}
        </StyledSection>
        <StyledActions>
          <Button size="small" variant="outline" onPress={handleBack} testID={testIds.back} accessibilityLabel={t('settings.onboarding.actions.back')}>
            {t('settings.onboarding.actions.back')}
          </Button>
          {isLast ? (
            <Button size="small" variant="primary" onPress={handleDone} disabled={!canComplete} testID={testIds.done} accessibilityLabel={t('settings.onboarding.actions.done')}>
              {t('settings.onboarding.actions.done')}
            </Button>
          ) : (
            <Button size="small" variant="primary" onPress={handleNext} disabled={isSafetyStep && !clinicalSafetyAcknowledged} testID={testIds.next} accessibilityLabel={t('settings.onboarding.actions.next')}>
              {t('settings.onboarding.actions.next')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default OnboardingScreenIos;
