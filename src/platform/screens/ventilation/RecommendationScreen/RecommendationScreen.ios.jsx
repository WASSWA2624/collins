/**
 * RecommendationScreen Component - iOS
 * File: RecommendationScreen.ios.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Accordion,
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
} from './RecommendationScreen.ios.styles';
import { RECOMMENDATION_TEST_IDS } from './types';

const SETTING_KEYS = ['mode', 'tidalVolume', 'respiratoryRate', 'fio2', 'peep', 'ieRatio'];

const RecommendationScreenIOS = () => {
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
    missingInputs,
    contributingFactors,
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
    <ScrollView style={{ flex: 1 }} accessibilityLabel={t('ventilation.recommendation.accessibilityLabel')}>
      <StyledContainer testID={RECOMMENDATION_TEST_IDS.screen}>
        <StyledWarningBox testID={RECOMMENDATION_TEST_IDS.warning}>
          <Text variant="label" color="status.warning.text">{t('ventilation.recommendation.intendedUse.warningLabel')}</Text>
          <Text variant="body" color="status.warning.text">{safety.intendedUseWarning}</Text>
          {safety.validationRequirement ? (
            <>
              <Text variant="label" color="status.warning.text">{t('ventilation.recommendation.intendedUse.validationLabel')}</Text>
              <Text variant="body" color="status.warning.text">{safety.validationRequirement}</Text>
            </>
          ) : null}
        </StyledWarningBox>

        <Accordion title={t('ventilation.recommendation.sections.settings')} defaultExpanded testID={RECOMMENDATION_TEST_IDS.settings}>
        <StyledSection>
          <StyledSectionHeader>
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
        </Accordion>

        <Accordion title={t('ventilation.recommendation.sections.confidence')} defaultExpanded={false} testID={RECOMMENDATION_TEST_IDS.confidence}>
        <StyledSection>
          <StyledSectionBody>
            <Text variant="body">{t('ventilation.recommendation.confidence.missingInputs')}</Text>
            {missingInputs?.length > 0 && missingInputs.map((m, i) => (
              <Text key={i} variant="caption">• {m}</Text>
            ))}
            {contributingFactors?.length > 0 && contributingFactors.map((c, i) => (
              <Text key={i} variant="caption">• {c}</Text>
            ))}
          </StyledSectionBody>
        </StyledSection>
        </Accordion>

        {monitoringPoints?.length > 0 && (
          <Accordion title={t('ventilation.recommendation.sections.monitoring')} defaultExpanded={false} testID={RECOMMENDATION_TEST_IDS.monitoring}>
          <StyledSection>
            <StyledSectionBody>
              {monitoringPoints.map((point, i) => (
                <Text key={i} variant="body">• {point}</Text>
              ))}
            </StyledSectionBody>
          </StyledSection>
          </Accordion>
        )}

        {risksAndComplications.length > 0 && (
          <Accordion title={t('ventilation.recommendation.sections.risks')} defaultExpanded={false} testID={RECOMMENDATION_TEST_IDS.risks}>
          <StyledSection>
            <StyledSectionBody>
              {risksAndComplications.map((item, i) => (
                <Text key={i} variant="body">• {item}</Text>
              ))}
            </StyledSectionBody>
          </StyledSection>
          </Accordion>
        )}

        {matched?.length > 0 && (
          <Accordion title={t('ventilation.recommendation.sections.matchedCases')} defaultExpanded={false} testID={RECOMMENDATION_TEST_IDS.matchedCases}>
          <StyledSection>
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
          </Accordion>
        )}

        {caseEvidence?.length > 0 && (
          <Accordion title={t('ventilation.recommendation.sections.evidence')} defaultExpanded={false} testID={RECOMMENDATION_TEST_IDS.evidence}>
          <StyledSection>
            <StyledSectionBody>
              {caseEvidence.map((ev, i) => (
                <React.Fragment key={ev?.caseId ?? i}>
                  <Text variant="label">{ev?.caseId}</Text>
                  <Text variant="caption">{t(`ventilation.recommendation.reviewStatus.${ev?.reviewStatus === 'validated' ? 'validated' : 'unvalidated'}`)}</Text>
                  {ev?.evidenceNotes ? <Text variant="body">{ev.evidenceNotes}</Text> : null}
                </React.Fragment>
              ))}
            </StyledSectionBody>
          </StyledSection>
          </Accordion>
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
          <Text variant="caption">{t('ventilation.assessment.summary.vitalsFormat', { spo2: inputs?.spo2 ?? '—', rr: inputs?.respiratoryRate ?? '—', hr: inputs?.heartRate ?? '—' })}</Text>
        </StyledSummaryPane>
      </StyledContainer>
    </ScrollView>
  );
};

export default RecommendationScreenIOS;
