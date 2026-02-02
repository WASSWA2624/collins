/**
 * CaseDetailScreen Component - iOS
 * File: CaseDetailScreen.ios.jsx
 */
import React from 'react';
import { Text } from '@platform/components';
import { useI18n } from '@hooks';
import useCaseDetailScreen from './useCaseDetailScreen';
import {
  StyledBlock,
  StyledContainer,
  StyledNotFound,
  StyledSection,
  StyledWarningBox,
} from './CaseDetailScreen.ios.styles';
import { CASE_DETAIL_TEST_IDS } from './types';

const SETTING_KEYS = ['mode', 'tidalVolume', 'respiratoryRate', 'fio2', 'peep', 'ieRatio'];

function formatValue(val, key) {
  if (val == null) return '—';
  if (key === 'fio2' && typeof val === 'number') return `${Math.round(val * 100)}%`;
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.length ? val.join(', ') : '—';
  return String(val);
}

const CaseDetailScreenIos = ({ caseId }) => {
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
      <StyledContainer testID={CASE_DETAIL_TEST_IDS.missingCaseId}>
        <StyledNotFound>
          <Text variant="body">{t('ventilation.caseDetail.missingCaseId')}</Text>
        </StyledNotFound>
      </StyledContainer>
    );
  }

  if (notFound) {
    return (
      <StyledContainer testID={CASE_DETAIL_TEST_IDS.notFound}>
        <StyledNotFound>
          <Text variant="body">{t('ventilation.caseDetail.notFound')}</Text>
        </StyledNotFound>
      </StyledContainer>
    );
  }

  const profile = caseItem?.patientProfile ?? {};
  const clinical = caseItem?.clinicalParameters ?? {};
  const ventSettings = caseItem?.ventilatorSettings ?? {};
  const outcomes = caseItem?.outcomes ?? {};

  return (
    <StyledContainer testID={CASE_DETAIL_TEST_IDS.screen}>
      <StyledWarningBox testID={CASE_DETAIL_TEST_IDS.intendedUseWarning}>
        <Text variant="body" color="status.warning.text">
          {intendedUse?.warning ?? t('ventilation.caseDetail.intendedUseWarning')}
        </Text>
      </StyledWarningBox>

      <StyledSection testID={CASE_DETAIL_TEST_IDS.summary}>
        <Text variant="label">{t('ventilation.caseDetail.summary')}</Text>
        <StyledBlock testID={CASE_DETAIL_TEST_IDS.patientProfile}>
          <Text variant="label">{t('ventilation.caseDetail.patientProfile')}</Text>
          {['condition', 'age', 'weight', 'height', 'gender'].map((k) => (
            <Text key={k} variant="caption">
              {t(`ventilation.assessment.patientProfile.${k}`, { default: k })}: {formatValue(profile[k])}
            </Text>
          ))}
          {profile.comorbidities?.length ? (
            <Text variant="caption">
              {t('ventilation.assessment.patientProfile.comorbidities')}: {formatValue(profile.comorbidities)}
            </Text>
          ) : null}
        </StyledBlock>
        <StyledBlock testID={CASE_DETAIL_TEST_IDS.clinicalParameters}>
          <Text variant="label">{t('ventilation.caseDetail.clinicalParameters')}</Text>
          {['spo2', 'pao2', 'paco2', 'ph', 'respiratoryRate', 'heartRate', 'bloodPressure']
            .filter((k) => clinical[k] != null)
            .map((k) => (
              <Text key={k} variant="caption">
                {t(`ventilation.clinicalParams.${k}`, { default: k })}: {formatValue(clinical[k])}
              </Text>
            ))}
        </StyledBlock>
      </StyledSection>

      <StyledSection testID={CASE_DETAIL_TEST_IDS.ventilatorSettings}>
        <Text variant="label">{t('ventilation.caseDetail.ventilatorSettings')}</Text>
        <StyledBlock>
          {SETTING_KEYS.map((k) => (
            <Text key={k} variant="caption">
              {t(`ventilation.recommendation.settings.${k}`, { default: k })}: {formatValue(ventSettings[k], k)}
            </Text>
          ))}
        </StyledBlock>
      </StyledSection>

      <StyledSection testID={CASE_DETAIL_TEST_IDS.outcomes}>
        <Text variant="label">{t('ventilation.caseDetail.outcomes')}</Text>
        <Text variant="caption" color="text.secondary">
          {t('ventilation.caseDetail.datasetCaseFraming')}
        </Text>
        <StyledBlock>
          {outcomes.weaningSuccess != null && (
            <Text variant="caption">Weaning success: {formatValue(outcomes.weaningSuccess)}</Text>
          )}
          {outcomes.lengthOfVentilation != null && (
            <Text variant="caption">Length of ventilation: {formatValue(outcomes.lengthOfVentilation)}</Text>
          )}
          {outcomes.mortality != null && (
            <Text variant="caption">Mortality: {formatValue(outcomes.mortality)}</Text>
          )}
          {Array.isArray(outcomes.complications) && outcomes.complications.length > 0 && (
            <Text variant="caption">Complications: {formatValue(outcomes.complications)}</Text>
          )}
        </StyledBlock>
      </StyledSection>

      <StyledSection testID={CASE_DETAIL_TEST_IDS.evidence}>
        <Text variant="label">{t('ventilation.caseDetail.evidence')}</Text>
        <StyledBlock>
          {citations.length === 0 ? (
            <Text variant="caption">—</Text>
          ) : (
            citations.map((s) => (
              <Text key={s?.id} variant="caption">
                {s?.citation ?? s?.id}
                {s?.doi ? ` DOI: ${s.doi}` : ''}
              </Text>
            ))
          )}
        </StyledBlock>
      </StyledSection>

      <StyledSection testID={CASE_DETAIL_TEST_IDS.reviewStatus}>
        <Text variant="label">{t('ventilation.caseDetail.reviewStatus')}</Text>
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

export default CaseDetailScreenIos;
