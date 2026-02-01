/**
 * RecommendationScreen Component - Web
 * File: RecommendationScreen.web.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
import {
  Button,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import useRecommendationScreen from './useRecommendationScreen';
import {
  StyledActionsRow,
  StyledBadge,
  StyledCaseLink,
  StyledContainer,
  StyledContentPane,
  StyledEvidenceItem,
  StyledList,
  StyledListItem,
  StyledSection,
  StyledSectionBody,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSettingsGrid,
  StyledSettingsTerm,
  StyledSettingsValue,
  StyledSummaryPane,
  StyledWarningBox,
} from './RecommendationScreen.web.styles';
import { RECOMMENDATION_TEST_IDS } from './types';

const SETTING_KEYS = ['mode', 'tidalVolume', 'respiratoryRate', 'fio2', 'peep', 'ieRatio'];

const RecommendationScreenWeb = () => {
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

  const handleStartMonitoring = () => {
    router.push('/session/monitoring');
  };

  const handleBackToAssessment = () => {
    router.push('/assessment');
  };

  const handleCaseClick = (caseId) => (e) => {
    e?.preventDefault?.();
    if (caseId) router.push(`/session/case/${encodeURIComponent(caseId)}`);
  };

  if (isHydrating) {
    return (
      <StyledContainer aria-label={t('ventilation.recommendation.accessibilityLabel')} data-testid={RECOMMENDATION_TEST_IDS.screen}>
        <Text>{t('ventilation.recommendation.states.loading')}</Text>
      </StyledContainer>
    );
  }

  if (errorCode) {
    return (
      <StyledContainer aria-label={t('ventilation.recommendation.accessibilityLabel')} data-testid={RECOMMENDATION_TEST_IDS.screen}>
        <Text variant="body">{t('ventilation.recommendation.states.error')}</Text>
        <Button variant="outline" onPress={handleBackToAssessment}>
          {t('ventilation.recommendation.actions.backToAssessment')}
        </Button>
      </StyledContainer>
    );
  }

  if (isEmpty) {
    return (
      <StyledContainer aria-label={t('ventilation.recommendation.accessibilityLabel')} data-testid={RECOMMENDATION_TEST_IDS.screen}>
        <Text variant="body">{t('ventilation.recommendation.states.empty')}</Text>
        <Button variant="primary" onPress={handleBackToAssessment}>
          {t('ventilation.recommendation.actions.backToAssessment')}
        </Button>
      </StyledContainer>
    );
  }

  const risksAndComplications = [
    ...(riskFactors || []),
    ...(complicationHistory || []),
  ].filter(Boolean);

  return (
    <StyledContainer aria-label={t('ventilation.recommendation.accessibilityLabel')} data-testid={RECOMMENDATION_TEST_IDS.screen} role="main">
      <StyledContentPane>
        <StyledWarningBox data-testid={RECOMMENDATION_TEST_IDS.warning}>
          <Text variant="label">{t('ventilation.recommendation.intendedUse.warningLabel')}</Text>
          <Text variant="body">{safety.intendedUseWarning}</Text>
          {safety.validationRequirement ? (
            <>
              <Text variant="label">{t('ventilation.recommendation.intendedUse.validationLabel')}</Text>
              <Text variant="body">{safety.validationRequirement}</Text>
            </>
          ) : null}
        </StyledWarningBox>

        <StyledSection data-testid={RECOMMENDATION_TEST_IDS.settings}>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('ventilation.recommendation.sections.settings')}</StyledSectionTitle>
            <StyledBadge $tier={confidenceTier}>{t(`ventilation.recommendation.confidence.${confidenceTier}`)}</StyledBadge>
          </StyledSectionHeader>
          <StyledSectionBody>
            <StyledSettingsGrid>
              {SETTING_KEYS.map((key) => {
                const value = settings?.[key];
                if (value == null) return null;
                const unit = units?.[key] ?? '';
                const label = t(`ventilation.recommendation.settings.${key}`);
                return (
                  <React.Fragment key={key}>
                    <StyledSettingsTerm>{label}</StyledSettingsTerm>
                    <StyledSettingsValue>{typeof value === 'number' ? `${value}${unit ? ` ${unit}` : ''}` : String(value)}</StyledSettingsValue>
                  </React.Fragment>
                );
              })}
            </StyledSettingsGrid>
          </StyledSectionBody>
        </StyledSection>

        <StyledSection data-testid={RECOMMENDATION_TEST_IDS.confidence}>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('ventilation.recommendation.sections.confidence')}</StyledSectionTitle>
          </StyledSectionHeader>
          <StyledSectionBody>
            <Text variant="body">{t('ventilation.recommendation.confidence.missingInputs')}</Text>
            {missingInputs?.length > 0 && (
              <StyledList>
                {missingInputs.map((m, i) => (
                  <StyledListItem key={i}>{m}</StyledListItem>
                ))}
              </StyledList>
            )}
            {contributingFactors?.length > 0 && (
              <StyledList>
                {contributingFactors.map((c, i) => (
                  <StyledListItem key={i}>{c}</StyledListItem>
                ))}
              </StyledList>
            )}
          </StyledSectionBody>
        </StyledSection>

        {monitoringPoints?.length > 0 && (
          <StyledSection data-testid={RECOMMENDATION_TEST_IDS.monitoring}>
            <StyledSectionHeader>
              <StyledSectionTitle>{t('ventilation.recommendation.sections.monitoring')}</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledList>
                {monitoringPoints.map((point, i) => (
                  <StyledListItem key={i}>{point}</StyledListItem>
                ))}
              </StyledList>
            </StyledSectionBody>
          </StyledSection>
        )}

        {risksAndComplications.length > 0 && (
          <StyledSection data-testid={RECOMMENDATION_TEST_IDS.risks}>
            <StyledSectionHeader>
              <StyledSectionTitle>{t('ventilation.recommendation.sections.risks')}</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledList>
                {risksAndComplications.map((item, i) => (
                  <StyledListItem key={i}>{item}</StyledListItem>
                ))}
              </StyledList>
            </StyledSectionBody>
          </StyledSection>
        )}

        {matched?.length > 0 && (
          <StyledSection data-testid={RECOMMENDATION_TEST_IDS.matchedCases}>
            <StyledSectionHeader>
              <StyledSectionTitle>{t('ventilation.recommendation.sections.matchedCases')}</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledList>
                {matched.map((m, i) => (
                  <StyledListItem key={m?.caseId ?? i}>
                    <StyledCaseLink
                      href={`/session/case/${encodeURIComponent(m?.caseId ?? '')}`}
                      onClick={handleCaseClick(m?.caseId)}
                      data-testid={`recommendation-case-${m?.caseId}`}
                    >
                      {m?.caseId}
                    </StyledCaseLink>
                    {m?.confidenceTier && ` (${m.confidenceTier})`}
                  </StyledListItem>
                ))}
              </StyledList>
            </StyledSectionBody>
          </StyledSection>
        )}

        {caseEvidence?.length > 0 && (
          <StyledSection data-testid={RECOMMENDATION_TEST_IDS.evidence}>
            <StyledSectionHeader>
              <StyledSectionTitle>{t('ventilation.recommendation.sections.evidence')}</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledSectionBody>
              {caseEvidence.map((ev, i) => (
                <StyledEvidenceItem key={ev?.caseId ?? i}>
                  <Text variant="label">{ev?.caseId}</Text>
                  <Text variant="caption" color="text.tertiary">
                    {t(`ventilation.recommendation.reviewStatus.${ev?.reviewStatus === 'validated' ? 'validated' : 'unvalidated'}`)}
                  </Text>
                  {ev?.evidenceNotes && <Text variant="body">{ev.evidenceNotes}</Text>}
                </StyledEvidenceItem>
              ))}
            </StyledSectionBody>
          </StyledSection>
        )}

        <StyledActionsRow>
          <Button
            variant="primary"
            onPress={handleStartMonitoring}
            testID={RECOMMENDATION_TEST_IDS.startMonitoring}
            accessibilityLabel={t('ventilation.recommendation.actions.startMonitoringHint')}
          >
            {t('ventilation.recommendation.actions.startMonitoring')}
          </Button>
          <Button variant="outline" onPress={handleBackToAssessment}>
            {t('ventilation.recommendation.actions.backToAssessment')}
          </Button>
        </StyledActionsRow>
      </StyledContentPane>

      <StyledSummaryPane>
        <Text variant="label">{t('ventilation.assessment.summary.title')}</Text>
        <StyledSectionBody>
          <Text variant="body">{inputs?.condition ?? '—'}</Text>
          <Text variant="caption" color="text.tertiary">
            {t('ventilation.assessment.summary.vitalsFormat', { spo2: inputs?.spo2 ?? '—', rr: inputs?.respiratoryRate ?? '—', hr: inputs?.heartRate ?? '—' })}
          </Text>
        </StyledSectionBody>
      </StyledSummaryPane>
    </StyledContainer>
  );
};

export default RecommendationScreenWeb;
