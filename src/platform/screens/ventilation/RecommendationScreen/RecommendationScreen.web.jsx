/**
 * RecommendationScreen Component - Web
 * File: RecommendationScreen.web.jsx
 */
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Button,
  Text,
  Checkbox,
  Stack,
} from '@platform/components';
import { useI18n, useExportSession } from '@hooks';
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
import { STEP_KEYS } from '../AssessmentScreen/types';

const SETTING_KEYS = ['mode', 'tidalVolume', 'respiratoryRate', 'fio2', 'peep', 'ieRatio'];

const RecommendationScreenWeb = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    recommendationSummary,
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
    sessionId,
    showRequestAi,
    isOnline,
    isRequestingAi,
    requestAiRecommendation,
    aiReasons,
    aiHints,
    responseSource,
    goToAssessmentStep,
    startNewAssessment,
  } = useRecommendationScreen();
  const { exportSummary } = useExportSession({
    recommendationSummary,
    inputs,
    sessionId,
  });
  const [anonymizeExport, setAnonymizeExport] = useState(false);

  const handleStartMonitoring = () => {
    router.push('/session/monitoring');
  };

  const handleStartNewAssessment = () => {
    startNewAssessment();
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
        <Button variant="outline" onPress={handleStartNewAssessment}>
          {t('ventilation.recommendation.actions.startNewAssessment')}
        </Button>
      </StyledContainer>
    );
  }

  if (isEmpty) {
    return (
      <StyledContainer aria-label={t('ventilation.recommendation.accessibilityLabel')} data-testid={RECOMMENDATION_TEST_IDS.screen}>
        <Text variant="body">{t('ventilation.recommendation.states.empty')}</Text>
          <Button variant="primary" onPress={handleStartNewAssessment}>
          {t('ventilation.recommendation.actions.startNewAssessment')}
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
          <Text variant="label" color="status.warning.text">{t('ventilation.recommendation.intendedUse.warningLabel')}</Text>
          <Text variant="body" color="status.warning.text">{safety.intendedUseWarning}</Text>
          {safety.validationRequirement ? (
            <>
              <Text variant="label" color="status.warning.text">{t('ventilation.recommendation.intendedUse.validationLabel')}</Text>
              <Text variant="body" color="status.warning.text">{safety.validationRequirement}</Text>
            </>
          ) : null}
        </StyledWarningBox>

        <StyledSection data-testid={RECOMMENDATION_TEST_IDS.settings}>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('ventilation.recommendation.sections.settings')}</StyledSectionTitle>
            <StyledBadge $tier={confidenceTier}>{t(`ventilation.recommendation.confidence.${confidenceTier}`)}</StyledBadge>
            <StyledBadge $tier={responseSource === 'online' ? 'high' : 'low'} data-testid="recommendation-response-source" aria-label={t('ventilation.recommendation.responseSource.title')}>
              {t('ventilation.recommendation.responseSource.title')}: {t(`ventilation.recommendation.responseSource.${responseSource}`)}
            </StyledBadge>
          </StyledSectionHeader>
          <StyledSectionBody>
            <StyledSettingsGrid>
              {SETTING_KEYS.map((key) => {
                const value = settings?.[key];
                if (value == null) return null;
                const unit = units?.[key] ?? '';
                const label = t(`ventilation.recommendation.settings.${key}`);
                const displayValue = key === 'fio2' && typeof value === 'number'
                  ? `${Math.round(value * 100)}%`
                  : (typeof value === 'number' ? `${value}${unit ? ` ${unit}` : ''}` : String(value));
                return (
                  <React.Fragment key={key}>
                    <StyledSettingsTerm>{label}</StyledSettingsTerm>
                    <StyledSettingsValue>{displayValue}</StyledSettingsValue>
                  </React.Fragment>
                );
              })}
            </StyledSettingsGrid>
          </StyledSectionBody>
        </StyledSection>

        {(aiReasons?.length > 0 || aiHints?.length > 0) && (
          <StyledSection data-testid="recommendation-ai-reasons">
            <StyledSectionHeader>
              <StyledSectionTitle>{t('ventilation.recommendation.aiReasons.title')}</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledSectionBody>
              {aiReasons?.length > 0 && (
                <StyledList>
                  {aiReasons.map((reason, i) => (
                    <StyledListItem key={i}>{reason}</StyledListItem>
                  ))}
                </StyledList>
              )}
              {aiHints?.length > 0 && (
                <>
                  <Text variant="caption" color="text.secondary">{t('ventilation.recommendation.aiReasons.hints')}</Text>
                  <StyledList>
                    {aiHints.map((hint, i) => (
                      <StyledListItem key={i}>{hint}</StyledListItem>
                    ))}
                  </StyledList>
                </>
              )}
            </StyledSectionBody>
          </StyledSection>
        )}

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

        <StyledSection data-testid="recommendation-export-section">
          <Stack spacing="xs">
            <Checkbox
              label={t('ventilation.recommendation.actions.anonymizeBeforeExport')}
              checked={anonymizeExport}
              onChange={(checked) => setAnonymizeExport(!!checked)}
              accessibilityLabel={t('ventilation.recommendation.actions.anonymizeBeforeExport')}
            />
            <Button
              variant="outline"
              onPress={() => exportSummary(anonymizeExport)}
              testID="recommendation-export-summary"
              accessibilityLabel={t('ventilation.recommendation.actions.exportSummaryHint')}
            >
              {t('ventilation.recommendation.actions.exportSummary')}
            </Button>
          </Stack>
        </StyledSection>
        {showRequestAi && (
          <StyledSection data-testid="recommendation-ai-section">
            <Text variant="caption" color="text.secondary">{t('ventilation.recommendation.actions.connectivityRequired')}</Text>
            <Text variant="caption" color="text.secondary">{t('ventilation.recommendation.actions.supplementalDisclaimer')}</Text>
            <Button
              variant="outline"
              onPress={requestAiRecommendation}
              disabled={!isOnline || isRequestingAi}
              testID="recommendation-request-ai"
              accessibilityLabel={t('ventilation.recommendation.actions.requestAiHint')}
            >
              {isRequestingAi ? t('common.loading') : t('ventilation.recommendation.actions.requestAiRecommendation')}
            </Button>
          </StyledSection>
        )}
        <StyledSection data-testid="recommendation-edit-assessment">
          <StyledSectionHeader>
            <StyledSectionTitle>{t('ventilation.recommendation.actions.editAssessmentTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <StyledSectionBody>
            <Stack direction="row" gap="sm" wrap>
              {STEP_KEYS.map((stepKey, index) => (
                <Button
                  key={stepKey}
                  variant="outline"
                  onPress={() => goToAssessmentStep(index)}
                  testID={`recommendation-edit-step-${index}`}
                  accessibilityLabel={t('ventilation.assessment.steps.' + stepKey)}
                >
                  {t('ventilation.assessment.steps.' + stepKey)}
                </Button>
              ))}
            </Stack>
          </StyledSectionBody>
        </StyledSection>
        <StyledActionsRow>
          <Button
            variant="primary"
            onPress={handleStartMonitoring}
            testID={RECOMMENDATION_TEST_IDS.startMonitoring}
            accessibilityLabel={t('ventilation.recommendation.actions.startMonitoringHint')}
          >
            {t('ventilation.recommendation.actions.startMonitoring')}
          </Button>
          <Button variant="outline" onPress={handleStartNewAssessment}>
            {t('ventilation.recommendation.actions.startNewAssessment')}
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
