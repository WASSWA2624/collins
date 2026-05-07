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
  LoadingSpinner,
  ProgressBar,
  Select,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useAssessmentScreen, { parseAdmissionNumberInput } from './useAssessmentScreen';
import {
  StyledActionsRow,
  StyledContainer,
  StyledContentWrap,
  StyledExpandButton,
  StyledFieldGroup,
  StyledLoadingPane,
  StyledLoadingText,
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
  OXYGEN_SUPPORT_OPTIONS,
  PATIENT_PATHWAY_OPTIONS,
  SEX_OPTIONS,
  STEPS,
  VENTILATOR_MODE_OPTIONS,
} from './types';

const mapOptions = (options, t, keyPrefix) =>
  options.map((option) => ({
    value: option.value,
    label: t(`${keyPrefix}.${option.labelKey}`),
  }));

const parseNum = parseAdmissionNumberInput;

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
    updateBodyMetric,
    toggleClinicianConfirmed,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    readiness,
    recommendationSettings,
    suggestedVentilatorInputs,
    recommendationMissingInputs,
    recommendationConfidence,
    recommendationErrorCode,
    isGeneratingRecommendation,
    validation,
    canProceedFromStep,
    goNext,
    goBackOrExit,
    saveAdmission,
    isSaving,
    isHydrating,
    errorCode,
    loadErrorCode,
    retryLoadAdmissionForm,
    testIds,
    stepKey,
    totalSteps,
    syncStatus,
  } = useAssessmentScreen();

  const stepLabel = t(`ventilation.assessment.steps.${stepKey}`);
  const pathwayOptions = mapOptions(
    PATIENT_PATHWAY_OPTIONS,
    t,
    'ventilation.assessment.patientReason.pathways'
  );
  const sexOptions = mapOptions(SEX_OPTIONS, t, 'ventilation.assessment.patientReason.sex');
  const oxygenSupportOptions = mapOptions(OXYGEN_SUPPORT_OPTIONS, t, 'ventilation.assessment.oxygenAbgVentilator.oxygenSupportOptions');
  const ventilatorModeOptions = mapOptions(VENTILATOR_MODE_OPTIONS, t, 'ventilation.assessment.saveReview.ventilatorModeOptions');
  const errorTranslationKey = errorCode ? `errors.codes.${errorCode}` : null;
  const translatedErrorMessage = errorTranslationKey ? t(errorTranslationKey) : null;
  const errorMessage =
    translatedErrorMessage && translatedErrorMessage !== errorTranslationKey
      ? translatedErrorMessage
      : errorCode
      ? t('errors.codes.UNKNOWN_ERROR')
      : null;

  const renderValidationMessages = () => {
    if (!validation?.messages?.length) return null;
    return (
      <StyledMissingTests testID="assessment-validation" accessibilityRole="alert">
        <Text variant="label" color="status.warning.text">{t('ventilation.assessment.validation.title')}</Text>
        {validation.messages.map((message) => (
          <Text key={message} variant="body" color="status.warning.text">{message}</Text>
        ))}
      </StyledMissingTests>
    );
  };

  const renderLoadError = () => {
    if (!loadErrorCode) return null;
    return (
      <StyledMissingTests testID="assessment-load-error" accessibilityRole="alert">
        <Text variant="label" color="status.warning.text">{t('ventilation.assessment.states.errorTitle')}</Text>
        <Text variant="body" color="status.warning.text">{t('ventilation.assessment.states.error')}</Text>
        <Button variant="outline" onPress={retryLoadAdmissionForm}>
          {t('ventilation.assessment.states.retryLoad')}
        </Button>
      </StyledMissingTests>
    );
  };

  const renderSummary = () => {
    const rows = [
      { key: 'facility', label: t('ventilation.assessment.summary.facility'), value: summaryData.facilityLabel },
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
      {renderValidationMessages()}
      <Select label={t('ventilation.assessment.patientReason.pathway')} placeholder={t('ventilation.assessment.patientReason.pathwayPlaceholder')} options={pathwayOptions} value={mergedInputs.patientPathway} onValueChange={(value) => updateInput({ patientPathway: value })} required testID="assessment-patient-pathway" />
      <Select label={t('ventilation.assessment.patientReason.sexForSize')} options={sexOptions} value={mergedInputs.sexForSizeCalculations} onValueChange={(value) => updateInput({ sexForSizeCalculations: value })} testID="assessment-sex-for-size" />
      <TextField label={t('ventilation.assessment.patientReason.ageYears')} type="number" value={mergedInputs.ageYears != null ? String(mergedInputs.ageYears) : ''} onChangeText={(value) => updateInput({ ageYears: parseNum(value) })} testID="assessment-age" />
      <TextField label={t('ventilation.assessment.patientReason.weightKg')} type="number" value={mergedInputs.actualWeightKg != null ? String(mergedInputs.actualWeightKg) : ''} onChangeText={(value) => updateBodyMetric('actualWeightKg', parseNum(value))} testID="assessment-weight" />
      <TextField label={t('ventilation.assessment.patientReason.heightCm')} type="number" value={mergedInputs.heightOrLengthCm != null ? String(mergedInputs.heightOrLengthCm) : ''} onChangeText={(value) => updateBodyMetric('heightOrLengthCm', parseNum(value))} testID="assessment-height" />
      <TextField label={t('ventilation.assessment.patientReason.bmi')} type="number" value={mergedInputs.bmi != null ? String(mergedInputs.bmi) : ''} onChangeText={(value) => updateBodyMetric('bmi', parseNum(value))} testID="assessment-bmi" />
      <TextArea label={t('ventilation.assessment.patientReason.reasonForSupport')} placeholder={t('ventilation.assessment.patientReason.reasonForSupportPlaceholder')} value={mergedInputs.reasonForSupport} onChangeText={(value) => updateInput({ reasonForSupport: value })} minHeight={76} testID="assessment-reason" />
    </StyledFieldGroup>
  );

  const renderOxygenAbgVentilatorStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.oxygenAbgVentilator.description')}</StyledStepDescription>
      {renderValidationMessages()}
      <Select label={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportType')} placeholder={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportPlaceholder')} helperText={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportHint')} options={oxygenSupportOptions} value={mergedInputs.oxygenSupportType} onValueChange={(value) => updateInput({ oxygenSupportType: value })} testID="assessment-oxygen-support" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.measuredAt')} type="datetime-local" placeholder={t('ventilation.assessment.oxygenAbgVentilator.timePlaceholder')} helperText={t('ventilation.assessment.oxygenAbgVentilator.timeHint')} value={mergedInputs.measuredAt} onChangeText={(value) => updateInput({ measuredAt: value })} testID="assessment-measured-at" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.spo2')} type="number" value={mergedInputs.spo2 != null ? String(mergedInputs.spo2) : ''} onChangeText={(value) => updateInput({ spo2: parseNum(value) })} testID="assessment-spo2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.fio2')} type="number" value={mergedInputs.fio2 != null ? String(mergedInputs.fio2) : ''} onChangeText={(value) => updateInput({ fio2: parseNum(value) })} testID="assessment-fio2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.respiratoryRate')} type="number" value={mergedInputs.respiratoryRate != null ? String(mergedInputs.respiratoryRate) : ''} onChangeText={(value) => updateInput({ respiratoryRate: parseNum(value) })} testID="assessment-respiratory-rate" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.heartRate')} type="number" value={mergedInputs.heartRate != null ? String(mergedInputs.heartRate) : ''} onChangeText={(value) => updateInput({ heartRate: parseNum(value) })} testID="assessment-heart-rate" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.ph')} type="number" value={mergedInputs.ph != null ? String(mergedInputs.ph) : ''} onChangeText={(value) => updateInput({ ph: parseNum(value) })} testID="assessment-ph" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.pao2')} type="number" value={mergedInputs.pao2 != null ? String(mergedInputs.pao2) : ''} onChangeText={(value) => updateInput({ pao2: parseNum(value) })} testID="assessment-pao2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.paco2')} type="number" value={mergedInputs.paco2 != null ? String(mergedInputs.paco2) : ''} onChangeText={(value) => updateInput({ paco2: parseNum(value) })} testID="assessment-paco2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.hco3')} type="number" value={mergedInputs.hco3 != null ? String(mergedInputs.hco3) : ''} onChangeText={(value) => updateInput({ hco3: parseNum(value) })} testID="assessment-hco3" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.baseExcess')} type="number" value={mergedInputs.baseExcess != null ? String(mergedInputs.baseExcess) : ''} onChangeText={(value) => updateInput({ baseExcess: parseNum(value) })} testID="assessment-base-excess" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.lactate')} type="number" value={mergedInputs.lactate != null ? String(mergedInputs.lactate) : ''} onChangeText={(value) => updateInput({ lactate: parseNum(value) })} testID="assessment-lactate" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.fio2AtSample')} type="number" value={mergedInputs.fio2AtSample != null ? String(mergedInputs.fio2AtSample) : ''} onChangeText={(value) => updateInput({ fio2AtSample: parseNum(value) })} testID="assessment-fio2-at-sample" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.spo2AtSample')} type="number" value={mergedInputs.spo2AtSample != null ? String(mergedInputs.spo2AtSample) : ''} onChangeText={(value) => updateInput({ spo2AtSample: parseNum(value) })} testID="assessment-spo2-at-sample" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFields')} placeholder={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFieldsPlaceholder')} value={mergedInputs.uncertaintyFieldsText} onChangeText={(value) => updateInput({ uncertaintyFieldsText: value })} testID="assessment-uncertainty-fields" />
      <TextArea label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyReason')} value={mergedInputs.uncertaintyReason} onChangeText={(value) => updateInput({ uncertaintyReason: value })} minHeight={76} testID="assessment-uncertainty-reason" />
    </StyledFieldGroup>
  );

  const renderRecommendation = () => {
    const hasRecommendation = recommendationSettings && Object.keys(recommendationSettings).length > 0;

    return (
      <StyledMissingTests testID={testIds.recommendation} accessibilityRole="alert">
        <Text variant="label" color="status.warning.text">{t('ventilation.assessment.saveReview.recommendationTitle')}</Text>
        {isGeneratingRecommendation ? (
          <>
            <LoadingSpinner size="large" accessibilityLabel={t('ventilation.assessment.saveReview.recommendationGenerating')} testID="assessment-recommendation-loading" />
            <Text variant="body" color="status.warning.text">{t('ventilation.assessment.saveReview.recommendationGenerating')}</Text>
          </>
        ) : hasRecommendation ? (
          <>
            <Text variant="body" color="status.warning.text">{t('ventilation.assessment.saveReview.recommendationConfidence', { confidence: t(`ventilation.recommendation.confidence.${recommendationConfidence}`) })}</Text>
            <Text variant="body" color="status.warning.text">{t('ventilation.assessment.saveReview.suggestedSettingsHint')}</Text>
            <Select label={t('ventilation.assessment.saveReview.ventilatorMode')} placeholder={t('ventilation.assessment.saveReview.modePlaceholder')} options={ventilatorModeOptions} value={suggestedVentilatorInputs.ventilatorMode} onValueChange={(value) => updateInput({ ventilatorMode: value })} testID="assessment-suggested-ventilator-mode" />
            <TextField label={t('ventilation.assessment.saveReview.tidalVolumeMl')} type="number" value={suggestedVentilatorInputs.tidalVolumeMl != null ? String(suggestedVentilatorInputs.tidalVolumeMl) : ''} onChangeText={(value) => updateInput({ tidalVolumeMl: parseNum(value) })} testID="assessment-suggested-tidal-volume" />
            <TextField label={t('ventilation.assessment.saveReview.respiratoryRateSet')} type="number" value={suggestedVentilatorInputs.respiratoryRateSet != null ? String(suggestedVentilatorInputs.respiratoryRateSet) : ''} onChangeText={(value) => updateInput({ respiratoryRateSet: parseNum(value) })} testID="assessment-suggested-respiratory-rate-set" />
            <TextField label={t('ventilation.assessment.saveReview.ventilatorFio2')} type="number" value={suggestedVentilatorInputs.ventilatorFio2 != null ? String(suggestedVentilatorInputs.ventilatorFio2) : ''} onChangeText={(value) => updateInput({ ventilatorFio2: parseNum(value) })} testID="assessment-suggested-ventilator-fio2" />
            <TextField label={t('ventilation.assessment.saveReview.peep')} type="number" value={suggestedVentilatorInputs.peep != null ? String(suggestedVentilatorInputs.peep) : ''} onChangeText={(value) => updateInput({ peep: parseNum(value) })} testID="assessment-suggested-peep" />
            <TextField label={t('ventilation.assessment.saveReview.ieRatio')} value={suggestedVentilatorInputs.ieRatio} onChangeText={(value) => updateInput({ ieRatio: value })} testID="assessment-suggested-ie-ratio" />
          </>
        ) : (
          <Text variant="body" color="status.warning.text">
            {recommendationErrorCode ? t('ventilation.assessment.saveReview.recommendationError') : t('ventilation.assessment.saveReview.recommendationEmpty')}
          </Text>
        )}
        {recommendationMissingInputs.length > 0 ? (
          <Text variant="body" color="status.warning.text">{t('ventilation.recommendation.decisionSupport.missingData')}: {recommendationMissingInputs.join(', ')}</Text>
        ) : null}
      </StyledMissingTests>
    );
  };

  const renderSaveReviewStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.saveReview.description')}</StyledStepDescription>
      {renderRecommendation()}
      <StyledMissingTests testID={testIds.readiness} accessibilityRole="alert">
        <Text variant="label" color="status.warning.text">{readiness.isReadyToSave ? t('ventilation.assessment.saveReview.ready') : t('ventilation.assessment.saveReview.needsCorrection')}</Text>
        <Text variant="body" color="status.warning.text" testID={testIds.syncStatus}>{t('ventilation.assessment.saveReview.syncStatus', { status: syncStatus })}</Text>
        {(readiness.warnings || []).map((warning, index) => (
          <Text key={`${warning.code}-${warning.field}-${index}`} variant="body" color="status.warning.text">{warning.message}</Text>
        ))}
        {(readiness.blockers || []).map((blocker, index) => (
          <Text key={`${blocker.code}-${blocker.field}-${index}`} variant="body" color="status.warning.text">{blocker.message}</Text>
        ))}
        {errorMessage ? <Text variant="body" color="status.warning.text">{errorMessage}</Text> : null}
      </StyledMissingTests>
      {renderValidationMessages()}
      <Checkbox checked={mergedInputs.clinicianConfirmed} onChange={toggleClinicianConfirmed} label={t('ventilation.assessment.saveReview.clinicianConfirmed')} testID="assessment-clinician-confirmed" />
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
        <StyledLoadingPane>
          <LoadingSpinner size="large" accessibilityLabel={t('ventilation.assessment.states.loading')} testID="assessment-loading-spinner" />
          <StyledLoadingText>{t('ventilation.assessment.states.loading')}</StyledLoadingText>
        </StyledLoadingPane>
      </StyledContainer>
    );
  }

  const contentPaddingBottom = theme?.spacing?.xl ?? 32;

  return (
    <StyledContentWrap>
      <StyledContainer accessibilityLabel={t('ventilation.assessment.accessibilityLabel')} testID={testIds.screen}>
        <ProgressBar value={progressPercent} testID={testIds.progressBar} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: contentPaddingBottom }} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
          {renderLoadError()}
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
