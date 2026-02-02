/**
 * CaseDetailScreen Component - Web
 * File: CaseDetailScreen.web.jsx
 */
import React from 'react';
import { Text } from '@platform/components';
import { useI18n } from '@hooks';
import useCaseDetailScreen from './useCaseDetailScreen';
import {
  StyledBlock,
  StyledContainer,
  StyledList,
  StyledListItem,
  StyledNotFound,
  StyledSection,
  StyledSectionTitle,
  StyledWarningBox,
} from './CaseDetailScreen.web.styles';
import { CASE_DETAIL_TEST_IDS } from './types';

const SETTING_KEYS = ['mode', 'tidalVolume', 'respiratoryRate', 'fio2', 'peep', 'ieRatio'];

function formatValue(val, key) {
  if (val == null) return '—';
  if (key === 'fio2' && typeof val === 'number') return `${Math.round(val * 100)}%`;
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.length ? val.join(', ') : '—';
  return String(val);
}

const CaseDetailScreenWeb = ({ caseId }) => {
  const { t } = useI18n();
  const {
    caseItem,
    citations,
    reviewStatus,
    intendedUse,
    missingCaseId,
    notFound,
  } = useCaseDetailScreen(caseId);

  if (missingCaseId) {
    return (
      <StyledContainer
        aria-label={t('ventilation.caseDetail.accessibilityLabel')}
        data-testid={CASE_DETAIL_TEST_IDS.missingCaseId}
        role="main"
      >
        <StyledNotFound>
          <Text variant="body">{t('ventilation.caseDetail.missingCaseId')}</Text>
        </StyledNotFound>
      </StyledContainer>
    );
  }

  if (notFound) {
    return (
      <StyledContainer
        aria-label={t('ventilation.caseDetail.accessibilityLabel')}
        data-testid={CASE_DETAIL_TEST_IDS.notFound}
        role="main"
      >
        <StyledNotFound>
          <Text variant="body">{t('ventilation.caseDetail.notFound')}</Text>
        </StyledNotFound>
      </StyledContainer>
    );
  }

  const profile = caseItem?.patientProfile ?? {};
  const clinical = caseItem?.clinicalParameters ?? {};
  const settings = caseItem?.ventilatorSettings ?? {};
  const outcomes = caseItem?.outcomes ?? {};

  return (
    <StyledContainer
      aria-label={t('ventilation.caseDetail.accessibilityLabel')}
      data-testid={CASE_DETAIL_TEST_IDS.screen}
      role="main"
    >
      <StyledWarningBox data-testid={CASE_DETAIL_TEST_IDS.intendedUseWarning}>
        <Text variant="body" color="status.warning.text">
          {intendedUse?.warning ?? t('ventilation.caseDetail.intendedUseWarning')}
        </Text>
      </StyledWarningBox>

      <StyledSection data-testid={CASE_DETAIL_TEST_IDS.summary}>
        <StyledSectionTitle>{t('ventilation.caseDetail.summary')}</StyledSectionTitle>
        <StyledBlock data-testid={CASE_DETAIL_TEST_IDS.patientProfile}>
          <Text variant="label">{t('ventilation.caseDetail.patientProfile')}</Text>
          <StyledList>
            {['condition', 'age', 'weight', 'height', 'gender'].map((k) => (
              <StyledListItem key={k}>
                <Text variant="caption">
                  {t(`ventilation.assessment.patientProfile.${k}`, { default: k })}: {formatValue(profile[k])}
                </Text>
              </StyledListItem>
            ))}
            {profile.comorbidities?.length ? (
              <StyledListItem>
                <Text variant="caption">
                  {t('ventilation.assessment.patientProfile.comorbidities')}: {formatValue(profile.comorbidities)}
                </Text>
              </StyledListItem>
            ) : null}
          </StyledList>
        </StyledBlock>
        <StyledBlock data-testid={CASE_DETAIL_TEST_IDS.clinicalParameters}>
          <Text variant="label">{t('ventilation.caseDetail.clinicalParameters')}</Text>
          <StyledList>
            {['spo2', 'pao2', 'paco2', 'ph', 'respiratoryRate', 'heartRate', 'bloodPressure']
              .filter((k) => clinical[k] != null)
              .map((k) => (
                <StyledListItem key={k}>
                  <Text variant="caption">
                    {t(`ventilation.clinicalParams.${k}`, { default: k })}: {formatValue(clinical[k])}
                  </Text>
                </StyledListItem>
              ))}
          </StyledList>
        </StyledBlock>
      </StyledSection>

      <StyledSection data-testid={CASE_DETAIL_TEST_IDS.ventilatorSettings}>
        <StyledSectionTitle>{t('ventilation.caseDetail.ventilatorSettings')}</StyledSectionTitle>
        <StyledBlock>
          <StyledList>
            {SETTING_KEYS.map((k) => (
              <StyledListItem key={k}>
                <Text variant="caption">
                  {t(`ventilation.recommendation.settings.${k}`, { default: k })}: {formatValue(settings[k], k)}
                </Text>
              </StyledListItem>
            ))}
          </StyledList>
        </StyledBlock>
      </StyledSection>

      <StyledSection data-testid={CASE_DETAIL_TEST_IDS.outcomes}>
        <StyledSectionTitle>{t('ventilation.caseDetail.outcomes')}</StyledSectionTitle>
        <Text variant="caption" color="text.secondary">
          {t('ventilation.caseDetail.datasetCaseFraming')}
        </Text>
        <StyledBlock>
          <StyledList>
            {outcomes.weaningSuccess != null && (
              <StyledListItem>
                <Text variant="caption">Weaning success: {formatValue(outcomes.weaningSuccess)}</Text>
              </StyledListItem>
            )}
            {outcomes.lengthOfVentilation != null && (
              <StyledListItem>
                <Text variant="caption">Length of ventilation: {formatValue(outcomes.lengthOfVentilation)}</Text>
              </StyledListItem>
            )}
            {outcomes.mortality != null && (
              <StyledListItem>
                <Text variant="caption">Mortality: {formatValue(outcomes.mortality)}</Text>
              </StyledListItem>
            )}
            {Array.isArray(outcomes.complications) && outcomes.complications.length > 0 && (
              <StyledListItem>
                <Text variant="caption">Complications: {formatValue(outcomes.complications)}</Text>
              </StyledListItem>
            )}
          </StyledList>
        </StyledBlock>
      </StyledSection>

      <StyledSection data-testid={CASE_DETAIL_TEST_IDS.evidence}>
        <StyledSectionTitle>{t('ventilation.caseDetail.evidence')}</StyledSectionTitle>
        <StyledBlock>
          {citations.length === 0 ? (
            <Text variant="caption">—</Text>
          ) : (
            <StyledList>
              {citations.map((s) => (
                <StyledListItem key={s?.id}>
                  <Text variant="caption">{s?.citation ?? s?.id}</Text>
                  {s?.doi ? (
                    <Text variant="caption"> DOI: {s.doi}</Text>
                  ) : null}
                </StyledListItem>
              ))}
            </StyledList>
          )}
        </StyledBlock>
      </StyledSection>

      <StyledSection data-testid={CASE_DETAIL_TEST_IDS.reviewStatus}>
        <StyledSectionTitle>{t('ventilation.caseDetail.reviewStatus')}</StyledSectionTitle>
        <Text variant="caption" color="text.secondary">
          {t('ventilation.caseDetail.prototypeFraming')}
        </Text>
        <Text variant="body">
          {reviewStatus ? t(`ventilation.caseDetail.review.${reviewStatus}`, { default: reviewStatus }) : '—'}
        </Text>
      </StyledSection>
    </StyledContainer>
  );
};

export default CaseDetailScreenWeb;
