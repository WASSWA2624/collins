/**
 * RecommendationScreen Component - Android
 * File: RecommendationScreen.android.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import useRecommendationScreen from './useRecommendationScreen';
import {
  StyledActionsRow,
  StyledContainer,
  StyledSection,
  StyledSectionBody,
  StyledSectionHeader,
  StyledSummaryPane,
  StyledWarningBox,
} from './RecommendationScreen.android.styles';
import { RECOMMENDATION_TEST_IDS } from './types';

const SETTING_KEYS = ['mode', 'tidalVolume', 'respiratoryRate', 'fio2', 'peep', 'ieRatio'];

const RecommendationScreenAndroid = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    settings,
    units,
    confidenceTier,
    monitoringPoints,
    riskFactors,
    complicationHistory,
    matched,
    caseEvidence,
    safety,
    inputs,
    isEmpty,
    isHydrating,
    errorCode,
  } = useRecommendationScreen();

  const handleStartMonitoring = () => router.push('/session/monitoring');
  const handleBackToAssessment = () => router.push('/assessment');
  const handleCasePress = (caseId) => () => caseId && router.push(`/session/case/${encodeURIComponent(caseId)}`);

  if (isHydrating) {
    return (
      <StyledContainer testID={RECOMMENDATION_TEST_IDS.screen}>
        <Text>{t('ventilation.recommendation.states.loading')}</Text>
      </StyledContainer>
    );
  }

  if (errorCode) {
    return (
      <StyledContainer testID={RECOMMENDATION_TEST_IDS.screen}>
        <Text variant="body">{t('ventilation.recommendation.states.error')}</Text>
        <Button variant="outline" onPress={handleBackToAssessment}>
          {t('ventilation.recommendation.actions.backToAssessment')}
        </Button>
      </StyledContainer>
    );
  }

  if (isEmpty) {
    return (
      <StyledContainer testID={RECOMMENDATION_TEST_IDS.screen}>
        <Text variant="body">{t('ventilation.recommendation.states.empty')}</Text>
        <Button variant="primary" onPress={handleBackToAssessment}>
          {t('ventilation.recommendation.actions.backToAssessment')}
        </Button>
      </StyledContainer>
    );
  }

  const risksAndComplications = [...(riskFactors || []), ...(complicationHistory || [])].filter(Boolean);

  return (
    <ScrollView style={{ flex: 1 }}>
      <StyledContainer testID={RECOMMENDATION_TEST_IDS.screen}>
        <StyledWarningBox testID={RECOMMENDATION_TEST_IDS.warning}>
          <Text variant="label">{t('ventilation.recommendation.intendedUse.warningLabel')}</Text>
          <Text variant="body">{safety.intendedUseWarning}</Text>
        </StyledWarningBox>

        <StyledSection testID={RECOMMENDATION_TEST_IDS.settings}>
          <StyledSectionHeader>
            <Text variant="label">{t('ventilation.recommendation.sections.settings')}</Text>
            <Text variant="caption">{t(`ventilation.recommendation.confidence.${confidenceTier}`)}</Text>
          </StyledSectionHeader>
          <StyledSectionBody>
            {SETTING_KEYS.map((key) => {
              const value = settings?.[key];
              if (value == null) return null;
              const unit = units?.[key] ?? '';
              const label = t(`ventilation.recommendation.settings.${key}`);
              return (
                <Text key={key} variant="body">
                  {label}: {typeof value === 'number' ? `${value}${unit ? ` ${unit}` : ''}` : String(value)}
                </Text>
              );
            })}
          </StyledSectionBody>
        </StyledSection>

        {monitoringPoints?.length > 0 && (
          <StyledSection testID={RECOMMENDATION_TEST_IDS.monitoring}>
            <StyledSectionHeader>
              <Text variant="label">{t('ventilation.recommendation.sections.monitoring')}</Text>
            </StyledSectionHeader>
            <StyledSectionBody>
              {monitoringPoints.map((point, i) => (
                <Text key={i} variant="body">• {point}</Text>
              ))}
            </StyledSectionBody>
          </StyledSection>
        )}

        {risksAndComplications.length > 0 && (
          <StyledSection testID={RECOMMENDATION_TEST_IDS.risks}>
            <StyledSectionHeader>
              <Text variant="label">{t('ventilation.recommendation.sections.risks')}</Text>
            </StyledSectionHeader>
            <StyledSectionBody>
              {risksAndComplications.map((item, i) => (
                <Text key={i} variant="body">• {item}</Text>
              ))}
            </StyledSectionBody>
          </StyledSection>
        )}

        {matched?.length > 0 && (
          <StyledSection testID={RECOMMENDATION_TEST_IDS.matchedCases}>
            <StyledSectionHeader>
              <Text variant="label">{t('ventilation.recommendation.sections.matchedCases')}</Text>
            </StyledSectionHeader>
            <StyledSectionBody>
              {matched.map((m, i) => (
                <Button
                  key={m?.caseId ?? i}
                  variant="ghost"
                  onPress={handleCasePress(m?.caseId)}
                  testID={`recommendation-case-${m?.caseId}`}
                >
                  {m?.caseId}
                </Button>
              ))}
            </StyledSectionBody>
          </StyledSection>
        )}

        <StyledActionsRow>
          <Button variant="primary" onPress={handleStartMonitoring} testID={RECOMMENDATION_TEST_IDS.startMonitoring}>
            {t('ventilation.recommendation.actions.startMonitoring')}
          </Button>
          <Button variant="outline" onPress={handleBackToAssessment}>
            {t('ventilation.recommendation.actions.backToAssessment')}
          </Button>
        </StyledActionsRow>

        <StyledSummaryPane>
          <Text variant="label">{t('ventilation.assessment.summary.title')}</Text>
          <Text variant="body">{inputs?.condition ?? '—'}</Text>
          <Text variant="caption">SpO₂: {inputs?.spo2 ?? '—'} | RR: {inputs?.respiratoryRate ?? '—'}</Text>
        </StyledSummaryPane>
      </StyledContainer>
    </ScrollView>
  );
};

export default RecommendationScreenAndroid;
