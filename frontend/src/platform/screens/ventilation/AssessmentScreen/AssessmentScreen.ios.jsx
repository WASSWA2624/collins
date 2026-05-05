/**
 * AssessmentScreen Component - iOS
 * File: AssessmentScreen.ios.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  Button,
  Checkbox,
  ProgressBar,
  Select,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useAssessmentScreen from './useAssessmentScreen';
import {
  StyledActionsRow,
  StyledContainer,
  StyledContentWrap,
  StyledExpandButton,
  StyledFieldGroup,
  StyledMissingTests,
  StyledStepContent,
  StyledStepDescription,
  StyledStepHeader,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryLabelWrap,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledSummaryValueWrap,
  StyledWizardPane,
} from './AssessmentScreen.ios.styles';
import {
  PATIENT_PATHWAY_OPTIONS,
  PERMITTED_MISSING_FIELD_OPTIONS,
  SEX_OPTIONS,
  STEPS,
} from './types';

const mapOptions = (options, t, keyPrefix) =>
  options.map((option) => ({
    value: option.value,
    label: t(`${keyPrefix}.${option.labelKey}`),
  }));

const parseNum = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatValue = (value, unit) => {
  if (value == null || value === '') return null;
  return unit ? `${value} ${unit}` : String(value);
};

const AssessmentScreenIOS = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const {
    currentStep,
    progressPercent,
    mergedInputs,
    updateInput,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    readiness,
    canProceedFromStep,
    goNext,
    goBackOrExit,
    saveAdmission,
    isSaving,
    isHydrating,
    errorCode,
    testIds,
    stepKey,
    totalSteps,
    syncStatus,
    togglePermittedMissingField,
  } = useAssessmentScreen();

  const stepLabel = t(`ventilation.assessment.steps.${stepKey}`);
  const pathwayOptions = mapOptions(
    PATIENT_PATHWAY_OPTIONS,
    t,
    'ventilation.assessment.patientReason.pathways'
  );
  const sexOptions = mapOptions(SEX_OPTIONS, t, 'ventilation.assessment.patientReason.sex');

  const renderSummary = () => {
    const rows = [
      { key: 'facility', label: t('ventilation.assessment.summary.facility'), value: summaryData.facilityId },
      { key: 'pathway', label: t('ventilation.assessment.summary.pathway'), value: summaryData.pathway },
      { key: 'reason', label: t('ventilation.assessment.summary.reason'), value: summaryData.reasonForSupport },
      { key: 'spo2', label: t('ventilation.assessment.summary.spo2'), value: formatValue(summaryData.spo2, '%') },
      { key: 'fio2', label: t('ventilation.assessment.summary.fio2'), value: summaryData.fio2 },
      { key: 'pao2', label: t('ventilation.assessment.summary.pao2'), value: formatValue(summaryData.pao2, 'mmHg') },
      { key: 'peep', label: t('ventilation.assessment.summary.peep'), value: formatValue(summaryData.peep, 'cmH2O') },
      { key: 'vt', label: t('ventilation.assessment.summary.tidalVolume'), value: formatValue(summaryData.tidalVolumeMl, 'mL') },
      { key: 'sync', label: t('ventilation.assessment.summary.syncStatus'), value: syncStatus },
    ].filter((row) => row.value != null && row.value !== '');

    return (
      <StyledSummaryPane
        accessibilityLabel={t('ventilation.assessment.summary.accessibilityLabel')}
        testID={testIds.summary}
      >
        <StyledSummaryHeader>
          <Text variant="label">{t('ventilation.assessment.summary.title')}</Text>
          <StyledExpandButton
            onPress={() => setSummaryExpanded((expanded) => !expanded)}
            accessibilityRole="button"
            accessibilityState={{ expanded: summaryExpanded }}
            accessibilityLabel={
              summaryExpanded
                ? t('ventilation.assessment.summary.collapse')
                : t('ventilation.assessment.summary.expand')
            }
            testID={testIds.summaryExpand}
          >
            <Text>{summaryExpanded ? '-' : '+'}</Text>
          </StyledExpandButton>
        </StyledSummaryHeader>
        {summaryExpanded && (
          <StyledSummaryBody>
            {rows.length === 0 ? (
              <Text variant="body" color="text.tertiary">
                {t('ventilation.assessment.summary.empty')}
              </Text>
            ) : (
              rows.map(({ key, label, value }) => (
                <StyledSummaryRow key={key}>
                  <StyledSummaryLabelWrap>
                    <Text variant="body" color="text.secondary">{label}</Text>
                  </StyledSummaryLabelWrap>
                  <StyledSummaryValueWrap>
                    <Text variant="label" color="text.primary">{value}</Text>
                  </StyledSummaryValueWrap>
                </StyledSummaryRow>
              ))
            )}
          </StyledSummaryBody>
        )}
      </StyledSummaryPane>
    );
  };

  const renderPatientReasonStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.patientReason.description')}</StyledStepDescription>
      <TextField label={t('ventilation.assessment.patientReason.facilityId')} placeholder={t('ventilation.assessment.patientReason.facilityIdPlaceholder')} value={mergedInputs.facilityId} onChangeText={(value) => updateInput({ facilityId: value })} required testID="assessment-facility-id" />
      <TextField label={t('ventilation.assessment.patientReason.bedNumber')} placeholder={t('ventilation.assessment.patientReason.bedNumberPlaceholder')} value={mergedInputs.bedNumber} onChangeText={(value) => updateInput({ bedNumber: value })} testID="assessment-bed-number" />
      <Select label={t('ventilation.assessment.patientReason.pathway')} placeholder={t('ventilation.assessment.patientReason.pathwayPlaceholder')} options={pathwayOptions} value={mergedInputs.patientPathway} onValueChange={(value) => updateInput({ patientPathway: value })} required testID="assessment-patient-pathway" />
      <Select label={t('ventilation.assessment.patientReason.sexForSize')} options={sexOptions} value={mergedInputs.sexForSizeCalculations} onValueChange={(value) => updateInput({ sexForSizeCalculations: value })} testID="assessment-sex-for-size" />
      <TextField label={t('ventilation.assessment.patientReason.ageYears')} type="number" value={mergedInputs.ageYears != null ? String(mergedInputs.ageYears) : ''} onChangeText={(value) => updateInput({ ageYears: parseNum(value) })} testID="assessment-age" />
      <TextField label={t('ventilation.assessment.patientReason.weightKg')} type="number" value={mergedInputs.actualWeightKg != null ? String(mergedInputs.actualWeightKg) : ''} onChangeText={(value) => updateInput({ actualWeightKg: parseNum(value) })} testID="assessment-weight" />
      <TextArea label={t('ventilation.assessment.patientReason.reasonForSupport')} placeholder={t('ventilation.assessment.patientReason.reasonForSupportPlaceholder')} value={mergedInputs.reasonForSupport} onChangeText={(value) => updateInput({ reasonForSupport: value })} required minHeight={76} testID="assessment-reason" />
      <Text variant="label">{t('ventilation.assessment.patientReason.permittedMissing')}</Text>
      {PERMITTED_MISSING_FIELD_OPTIONS.map((field) => (
        <Checkbox key={field.value} checked={mergedInputs.permittedMissingFields.includes(field.value)} onChange={(checked) => togglePermittedMissingField(field.value, checked)} value={field.value} label={t(`ventilation.assessment.patientReason.permittedMissingFields.${field.labelKey}`)} testID={`assessment-permitted-${field.labelKey}`} />
      ))}
    </StyledFieldGroup>
  );

  const renderOxygenAbgVentilatorStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.oxygenAbgVentilator.description')}</StyledStepDescription>
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportType')} value={mergedInputs.oxygenSupportType} onChangeText={(value) => updateInput({ oxygenSupportType: value })} testID="assessment-oxygen-support" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.spo2')} type="number" value={mergedInputs.spo2 != null ? String(mergedInputs.spo2) : ''} onChangeText={(value) => updateInput({ spo2: parseNum(value) })} testID="assessment-spo2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.fio2')} type="number" value={mergedInputs.fio2 != null ? String(mergedInputs.fio2) : ''} onChangeText={(value) => updateInput({ fio2: parseNum(value) })} testID="assessment-fio2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.ph')} type="number" value={mergedInputs.ph != null ? String(mergedInputs.ph) : ''} onChangeText={(value) => updateInput({ ph: parseNum(value) })} testID="assessment-ph" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.pao2')} type="number" value={mergedInputs.pao2 != null ? String(mergedInputs.pao2) : ''} onChangeText={(value) => updateInput({ pao2: parseNum(value) })} testID="assessment-pao2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.paco2')} type="number" value={mergedInputs.paco2 != null ? String(mergedInputs.paco2) : ''} onChangeText={(value) => updateInput({ paco2: parseNum(value) })} testID="assessment-paco2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.ventilatorMode')} value={mergedInputs.ventilatorMode} onChangeText={(value) => updateInput({ ventilatorMode: value })} testID="assessment-ventilator-mode" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.tidalVolumeMl')} type="number" value={mergedInputs.tidalVolumeMl != null ? String(mergedInputs.tidalVolumeMl) : ''} onChangeText={(value) => updateInput({ tidalVolumeMl: parseNum(value) })} testID="assessment-tidal-volume" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.peep')} type="number" value={mergedInputs.peep != null ? String(mergedInputs.peep) : ''} onChangeText={(value) => updateInput({ peep: parseNum(value) })} testID="assessment-peep" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.deviceId')} value={mergedInputs.deviceId} onChangeText={(value) => updateInput({ deviceId: value })} testID="assessment-device-id" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFields')} placeholder={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFieldsPlaceholder')} value={mergedInputs.uncertaintyFieldsText} onChangeText={(value) => updateInput({ uncertaintyFieldsText: value })} testID="assessment-uncertainty-fields" />
      <TextArea label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyReason')} value={mergedInputs.uncertaintyReason} onChangeText={(value) => updateInput({ uncertaintyReason: value })} minHeight={76} testID="assessment-uncertainty-reason" />
    </StyledFieldGroup>
  );

  const renderSaveReviewStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.saveReview.description')}</StyledStepDescription>
      <StyledMissingTests testID={testIds.readiness} accessibilityRole="alert">
        <Text variant="label" color="status.warning.text">{readiness.isReadyToSave ? t('ventilation.assessment.saveReview.ready') : t('ventilation.assessment.saveReview.needsCorrection')}</Text>
        <Text variant="body" color="status.warning.text" testID={testIds.syncStatus}>{t('ventilation.assessment.saveReview.syncStatus', { status: syncStatus })}</Text>
        {(readiness.warnings || []).map((warning, index) => (
          <Text key={`${warning.code}-${warning.field}-${index}`} variant="body" color="status.warning.text">{warning.message}</Text>
        ))}
        {(readiness.blockers || []).map((blocker, index) => (
          <Text key={`${blocker.code}-${blocker.field}-${index}`} variant="body" color="status.warning.text">{blocker.message}</Text>
        ))}
        {errorCode ? <Text variant="body" color="status.warning.text">{t('ventilation.assessment.states.error')}</Text> : null}
      </StyledMissingTests>
      <Checkbox checked={mergedInputs.clinicianConfirmed} onChange={(checked) => updateInput({ clinicianConfirmed: checked })} label={t('ventilation.assessment.saveReview.clinicianConfirmed')} testID="assessment-clinician-confirmed" />
      {(readiness.blockers || []).length > 0 && (
        <TextArea label={t('ventilation.assessment.saveReview.overrideReason')} value={mergedInputs.overrideReason} onChangeText={(value) => updateInput({ overrideReason: value })} minHeight={76} required testID="assessment-override-reason" />
      )}
      <TextArea label={t('ventilation.assessment.saveReview.reviewNote')} value={mergedInputs.reviewNote} onChangeText={(value) => updateInput({ reviewNote: value })} minHeight={76} testID="assessment-review-note" />
    </StyledFieldGroup>
  );

  const renderStepContent = () => {
    if (currentStep === STEPS.PATIENT_REASON) return renderPatientReasonStep();
    if (currentStep === STEPS.OXYGEN_ABG_VENTILATOR) return renderOxygenAbgVentilatorStep();
    if (currentStep === STEPS.SAVE_REVIEW) return renderSaveReviewStep();
    return null;
  };

  if (isHydrating) {
    return (
      <StyledContainer accessibilityLabel={t('ventilation.assessment.accessibilityLabel')} testID={testIds.screen}>
        <Text>{t('ventilation.assessment.states.loading')}</Text>
      </StyledContainer>
    );
  }

  const contentPaddingBottom = theme?.spacing?.xl ?? 32;

  return (
    <StyledContentWrap>
      <StyledContainer accessibilityLabel={t('ventilation.assessment.accessibilityLabel')} testID={testIds.screen}>
        <ProgressBar value={progressPercent} testID={testIds.progressBar} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: contentPaddingBottom }} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
          <StyledWizardPane>
            <StyledStepHeader>
              <Text variant="h2">{stepLabel}</Text>
              <Text variant="caption">{t('ventilation.assessment.stepIndicator', { current: currentStep + 1, total: totalSteps })}</Text>
            </StyledStepHeader>
            <StyledStepContent testID={testIds.stepContent}>{renderStepContent()}</StyledStepContent>
            <StyledActionsRow>
              <Button variant="outline" onPress={goBackOrExit} testID={testIds.backButton}>{t('ventilation.assessment.actions.back')}</Button>
              {currentStep < STEPS.SAVE_REVIEW ? (
                <Button variant="primary" onPress={goNext} disabled={isSaving || !canProceedFromStep(currentStep)} loading={isSaving} testID={testIds.nextButton}>{t('common.next')}</Button>
              ) : (
                <Button variant="primary" onPress={saveAdmission} disabled={isSaving || !canProceedFromStep(currentStep)} loading={isSaving} testID={testIds.generateButton}>{t('ventilation.assessment.actions.saveAdmission')}</Button>
              )}
            </StyledActionsRow>
          </StyledWizardPane>
          {renderSummary()}
        </ScrollView>
      </StyledContainer>
    </StyledContentWrap>
  );
};

export default AssessmentScreenIOS;
