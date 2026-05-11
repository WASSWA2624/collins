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
  Select,
  Text,
  TextArea as PlatformTextArea,
  TextField as PlatformTextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useAssessmentScreen, { parseAdmissionNumberInput } from './useAssessmentScreen';
import {
  StyledActionsRow,
  StyledChoiceGrid,
  StyledChoiceHeader,
  StyledChoiceOption,
  StyledChoiceSection,
  StyledChoiceText,
  StyledContainer,
  StyledContentWrap,
  StyledExpandButton,
  StyledFieldGroup,
  StyledLoadingPane,
  StyledLoadingText,
  StyledMissingTests,
  StyledStepper,
  StyledStepperItem,
  StyledStepperMarker,
  StyledStepperMeta,
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
  REASON_FOR_SUPPORT_OPTIONS,
  SEX_OPTIONS,
  STEP_KEYS,
  STEPS,
  VENTILATOR_MODE_OPTIONS,
} from './types';

const mapOptions = (options, t, keyPrefix) =>
  options.map((option) => ({
    value: option.value,
    label: t(`${keyPrefix}.${option.labelKey}`),
    rangeKey: option.rangeKey,
  }));

const mapReasonOptions = (options, t, keyPrefix) =>
  options.map((option) => {
    const label = t(`${keyPrefix}.${option.labelKey}`);
    return {
      value: label,
      label,
    };
  });

const parseNum = parseAdmissionNumberInput;

const STEP_STATUS = Object.freeze({
  COMPLETE: 'complete',
  CURRENT: 'current',
  ERROR: 'error',
  UPCOMING: 'upcoming',
});

const TextField = (props) => <PlatformTextField {...props} debounceMs={0} />;
const TextArea = (props) => <PlatformTextArea {...props} debounceMs={0} />;

const findOptionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label || value;

const formatValue = (value, unit) => {
  if (value == null || value === '') return null;
  return unit ? `${value} ${unit}` : String(value);
};

const AssessmentScreenIOS = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const {
    currentStep,
    mergedInputs,
    updateInput,
    updateDecimalInput,
    updateAgeComponent,
    updateDateOfBirth,
    getNumericInputValue,
    toggleClinicianConfirmed,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    readiness,
    recommendationSettings,
    suggestedVentilatorInputs,
    recommendationMissingInputs,
    recommendationConfidence,
    recommendationSourceCategory,
    recommendationSourceCategoryLabel,
    recommendationCalculation,
    recommendationErrorCode,
    isGeneratingRecommendation,
    validation,
    stepValidationStates,
    rangeSuggestions,
    goNext,
    goBackOrExit,
    saveAdmission,
    conflictWarning,
    continueAfterConflict,
    dismissConflictWarning,
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
  const patientPathwayOptions = mapOptions(
    PATIENT_PATHWAY_OPTIONS,
    t,
    'ventilation.assessment.patientReason.pathways'
  );
  const sexOptions = mapOptions(SEX_OPTIONS, t, 'ventilation.assessment.patientReason.sex');
  const getFieldErrorProps = (field) => {
    const message = validation?.fieldErrors?.[field];
    return message ? { validationState: 'error', errorMessage: message } : {};
  };
  const helperTextFor = (field, fallback) =>
    [fallback, rangeSuggestions?.[field]].filter(Boolean).join(' ');
  const reasonForSupportOptions = mapReasonOptions(
    REASON_FOR_SUPPORT_OPTIONS,
    t,
    'ventilation.assessment.patientReason.reasonOptions'
  );
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
  const nextActionLabel = currentStep === STEPS.OXYGEN_ABG_VENTILATOR
    ? t('ventilation.assessment.actions.generateVentSuggestion')
    : t('common.next');

  const renderValidationMessages = () => {
    const messages = [...new Set([errorMessage, ...(validation?.messages || [])].filter(Boolean))];
    if (!messages.length) return null;
    return (
      <StyledMissingTests testID="assessment-validation" accessibilityRole="alert">
        <Text variant="label" color="status.warning.text">{t('ventilation.assessment.validation.title')}</Text>
        {messages.map((message) => (
          <Text key={message} variant="body" color="status.warning.text">{message}</Text>
        ))}
      </StyledMissingTests>
    );
  };

  const renderConflictWarning = () => {
    if (!conflictWarning) return null;
    return (
      <StyledMissingTests testID="assessment-conflict-warning" accessibilityRole="alert">
        <Text variant="label" color="status.warning.text">{t('ventilation.assessment.validation.conflictTitle')}</Text>
        <Text variant="body" color="status.warning.text">{t('ventilation.assessment.validation.conflictBody')}</Text>
        <StyledActionsRow>
          <Button
            variant="outline"
            onPress={dismissConflictWarning}
            disabled={isSaving}
            testID="assessment-conflict-edit"
          >
            {t('ventilation.assessment.validation.conflictCancel')}
          </Button>
          <Button
            variant="primary"
            onPress={continueAfterConflict}
            disabled={isSaving}
            loading={isSaving}
            testID="assessment-conflict-continue"
          >
            {t('ventilation.assessment.validation.conflictContinue')}
          </Button>
        </StyledActionsRow>
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

  const renderStepper = () => (
    <StyledStepper testID={testIds.progressBar} accessibilityLabel={t('ventilation.assessment.stepIndicator', { current: currentStep + 1, total: totalSteps })}>
      {STEP_KEYS.map((key, index) => {
        const stepValidation = stepValidationStates?.[index];
        const hasStepError = stepValidation?.hasErrors;
        const status =
          hasStepError
            ? STEP_STATUS.ERROR
            : index < currentStep
            ? STEP_STATUS.COMPLETE
            : index === currentStep
              ? STEP_STATUS.CURRENT
              : STEP_STATUS.UPCOMING;
        const metaLabel = hasStepError
          ? `${stepValidation.errorCount || 1} field${stepValidation.errorCount === 1 ? '' : 's'} need attention`
          : t('ventilation.assessment.stepIndicator', { current: index + 1, total: totalSteps });
        return (
          <StyledStepperItem key={key} status={status}>
            <StyledStepperMarker status={status}>
              <Text variant="caption" color={status === STEP_STATUS.CURRENT || status === STEP_STATUS.ERROR ? 'text.inverse' : 'text.primary'}>
                {status === STEP_STATUS.ERROR ? '!' : status === STEP_STATUS.COMPLETE ? '\u2713' : index + 1}
              </Text>
            </StyledStepperMarker>
            <StyledStepperMeta>
              <Text variant="label">
                {t(`ventilation.assessment.steps.${key}`)}
              </Text>
              <Text variant="caption" color={status === STEP_STATUS.ERROR ? 'error' : 'text.secondary'}>
                {metaLabel}
              </Text>
            </StyledStepperMeta>
          </StyledStepperItem>
        );
      })}
    </StyledStepper>
  );

  const renderSummary = () => {
    const pathwaySummary =
      summaryData.pathway && summaryData.pathway !== 'UNKNOWN'
        ? findOptionLabel(patientPathwayOptions, summaryData.pathway)
        : null;
    const rows = [
      { key: 'facility', label: t('ventilation.assessment.summary.facility'), value: summaryData.facilityLabel },
      { key: 'name', label: t('ventilation.assessment.summary.patientName'), value: summaryData.optionalName },
      { key: 'pathway', label: t('ventilation.assessment.summary.ageGroup'), value: pathwaySummary },
      { key: 'reason', label: t('ventilation.assessment.summary.reason'), value: summaryData.reasonForSupport },
      { key: 'spo2', label: t('ventilation.assessment.summary.spo2'), value: formatValue(summaryData.spo2, '%') },
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
      {renderConflictWarning()}
      {renderValidationMessages()}
      <TextField label={t('ventilation.assessment.patientReason.patientName')} placeholder={t('ventilation.assessment.patientReason.patientNamePlaceholder')} value={mergedInputs.optionalName} onChangeText={(value) => updateInput({ optionalName: value })} testID="assessment-patient-name" />
      <Select label={t('ventilation.assessment.patientReason.reasonForSupport')} placeholder={t('ventilation.assessment.patientReason.reasonForSupportPlaceholder')} searchPlaceholder={t('ventilation.assessment.patientReason.reasonForSupportSearchPlaceholder')} options={reasonForSupportOptions} value={mergedInputs.reasonForSupport} onValueChange={(value) => updateInput({ reasonForSupport: value })} {...getFieldErrorProps('reasonForSupport')} allowCustomValue required testID="assessment-reason" />
      <TextField label={t('ventilation.assessment.patientReason.ageYears')} type="number" keyboardType="number-pad" value={getNumericInputValue('ageYearsPart')} onChangeText={(value) => updateAgeComponent('ageYearsPart', value)} {...getFieldErrorProps('ageYears')} testID="assessment-age-years" />
      <TextField label={t('ventilation.assessment.patientReason.ageMonths')} type="number" keyboardType="number-pad" value={getNumericInputValue('ageMonthsPart')} onChangeText={(value) => updateAgeComponent('ageMonthsPart', value)} testID="assessment-age-months" />
      <TextField label={t('ventilation.assessment.patientReason.ageDays')} type="number" keyboardType="number-pad" value={getNumericInputValue('ageDaysPart')} onChangeText={(value) => updateAgeComponent('ageDaysPart', value)} testID="assessment-age-days" />
      <TextField label={t('ventilation.assessment.patientReason.dateOfBirth')} placeholder={t('ventilation.assessment.patientReason.dateOfBirthPlaceholder')} value={mergedInputs.dateOfBirth} onChangeText={updateDateOfBirth} helperText={t('ventilation.assessment.patientReason.ageRequirementHint')} {...getFieldErrorProps('dateOfBirth')} testID="assessment-date-of-birth" />
      <TextField label={t('ventilation.assessment.patientReason.weightKg')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('actualWeightKg')} value={getNumericInputValue('actualWeightKg')} onChangeText={(value) => updateDecimalInput('actualWeightKg', value)} {...getFieldErrorProps('actualWeightKg')} required testID="assessment-weight" />
      <TextField label={t('ventilation.assessment.patientReason.heightCm')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('heightOrLengthCm')} value={getNumericInputValue('heightOrLengthCm')} onChangeText={(value) => updateDecimalInput('heightOrLengthCm', value)} {...getFieldErrorProps('heightOrLengthCm')} required testID="assessment-height" />
      <TextField label={t('ventilation.assessment.patientReason.bmi')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('bmi')} value={getNumericInputValue('bmi')} onChangeText={(value) => updateDecimalInput('bmi', value)} {...getFieldErrorProps('bmi')} testID="assessment-bmi" />
      <StyledChoiceSection testID="assessment-sex-for-size">
        <StyledChoiceHeader>
          <Text variant="label">{t('ventilation.assessment.patientReason.sexForSize')}</Text>
        </StyledChoiceHeader>
        <StyledChoiceGrid>
          {sexOptions.map((option) => {
            const selected = mergedInputs.sexForSizeCalculations === option.value;
            return (
              <StyledChoiceOption
                key={option.value}
                selected={selected}
                compact
                onPress={() => updateInput({ sexForSizeCalculations: option.value })}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`assessment-sex-${option.value.toLowerCase()}`}
              >
                <StyledChoiceText>
                  <Text variant="label">{option.label}</Text>
                </StyledChoiceText>
              </StyledChoiceOption>
            );
          })}
        </StyledChoiceGrid>
      </StyledChoiceSection>
    </StyledFieldGroup>
  );

  const renderOxygenAbgVentilatorStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.oxygenAbgVentilator.description')}</StyledStepDescription>
      {renderConflictWarning()}
      {renderValidationMessages()}
      <Select label={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportType')} placeholder={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportPlaceholder')} helperText={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportHint')} options={oxygenSupportOptions} value={mergedInputs.oxygenSupportType} onValueChange={(value) => updateInput({ oxygenSupportType: value })} {...getFieldErrorProps('oxygenSupportType')} required testID="assessment-oxygen-support" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.spo2')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('spo2')} value={getNumericInputValue('spo2')} onChangeText={(value) => updateDecimalInput('spo2', value)} {...getFieldErrorProps('spo2')} required testID="assessment-spo2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.respiratoryRate')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('respiratoryRate')} value={getNumericInputValue('respiratoryRate')} onChangeText={(value) => updateDecimalInput('respiratoryRate', value)} {...getFieldErrorProps('respiratoryRate')} required testID="assessment-respiratory-rate" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.heartRate')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('heartRate')} value={getNumericInputValue('heartRate')} onChangeText={(value) => updateDecimalInput('heartRate', value)} {...getFieldErrorProps('heartRate')} required testID="assessment-heart-rate" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.ph')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('ph')} value={getNumericInputValue('ph')} onChangeText={(value) => updateDecimalInput('ph', value)} {...getFieldErrorProps('ph')} required testID="assessment-ph" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.pao2')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('pao2')} value={getNumericInputValue('pao2')} onChangeText={(value) => updateDecimalInput('pao2', value)} {...getFieldErrorProps('pao2')} testID="assessment-pao2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.paco2')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('paco2')} value={getNumericInputValue('paco2')} onChangeText={(value) => updateDecimalInput('paco2', value)} {...getFieldErrorProps('paco2')} testID="assessment-paco2" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.hco3')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('hco3')} value={getNumericInputValue('hco3')} onChangeText={(value) => updateDecimalInput('hco3', value)} {...getFieldErrorProps('hco3')} testID="assessment-hco3" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.baseExcess')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('baseExcess')} value={getNumericInputValue('baseExcess')} onChangeText={(value) => updateDecimalInput('baseExcess', value)} {...getFieldErrorProps('baseExcess')} testID="assessment-base-excess" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.lactate')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('lactate')} value={getNumericInputValue('lactate')} onChangeText={(value) => updateDecimalInput('lactate', value)} {...getFieldErrorProps('lactate')} testID="assessment-lactate" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.spo2AtSample')} type="number" keyboardType="decimal-pad" helperText={helperTextFor('spo2AtSample')} value={getNumericInputValue('spo2AtSample')} onChangeText={(value) => updateDecimalInput('spo2AtSample', value)} {...getFieldErrorProps('spo2AtSample')} testID="assessment-spo2-at-sample" />
      <TextField label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFields')} placeholder={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFieldsPlaceholder')} value={mergedInputs.uncertaintyFieldsText} onChangeText={(value) => updateInput({ uncertaintyFieldsText: value })} testID="assessment-uncertainty-fields" />
      <TextArea label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyReason')} value={mergedInputs.uncertaintyReason} onChangeText={(value) => updateInput({ uncertaintyReason: value })} minHeight={76} testID="assessment-uncertainty-reason" />
    </StyledFieldGroup>
  );

  const renderRecommendation = () => {
    const hasRecommendation = recommendationSettings && Object.keys(recommendationSettings).length > 0;
    const sourceCategoryText =
      recommendationSourceCategoryLabel ||
      t(`ventilation.assessment.saveReview.sourceCategories.${recommendationSourceCategory || 'unknown'}`);
    const calculationText =
      recommendationCalculation?.referenceWeightKg && recommendationCalculation?.tidalVolumeMlPerKg
        ? t('ventilation.assessment.saveReview.calculationSummary', {
          referenceWeight: recommendationCalculation.referenceWeightKg,
          mlPerKg: recommendationCalculation.tidalVolumeMlPerKg,
        })
        : null;

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
            <Text variant="body" color="status.warning.text">{t('ventilation.assessment.saveReview.sourceCategory', { category: sourceCategoryText })}</Text>
            <Text variant="body" color="status.warning.text">{t('ventilation.assessment.saveReview.clinicianDecisionNotice')}</Text>
            <Text variant="body" color="status.warning.text">{t('ventilation.assessment.saveReview.suggestedSettingsHint')}</Text>
            {calculationText ? <Text variant="body" color="status.warning.text">{calculationText}</Text> : null}
            <Select label={t('ventilation.assessment.saveReview.ventilatorMode')} placeholder={t('ventilation.assessment.saveReview.modePlaceholder')} options={ventilatorModeOptions} value={suggestedVentilatorInputs.ventilatorMode} onValueChange={(value) => updateInput({ ventilatorMode: value })} {...getFieldErrorProps('ventilatorMode')} testID="assessment-suggested-ventilator-mode" />
            <TextField label={t('ventilation.assessment.saveReview.tidalVolumeMl')} type="number" helperText={helperTextFor('tidalVolumeMl')} value={suggestedVentilatorInputs.tidalVolumeMl != null ? String(suggestedVentilatorInputs.tidalVolumeMl) : ''} onChangeText={(value) => updateInput({ tidalVolumeMl: parseNum(value) })} {...getFieldErrorProps('tidalVolumeMl')} testID="assessment-suggested-tidal-volume" />
            <TextField label={t('ventilation.assessment.saveReview.respiratoryRateSet')} type="number" helperText={helperTextFor('respiratoryRateSet')} value={suggestedVentilatorInputs.respiratoryRateSet != null ? String(suggestedVentilatorInputs.respiratoryRateSet) : ''} onChangeText={(value) => updateInput({ respiratoryRateSet: parseNum(value) })} {...getFieldErrorProps('respiratoryRateSet')} testID="assessment-suggested-respiratory-rate-set" />
            <TextField label={t('ventilation.assessment.saveReview.peep')} type="number" helperText={helperTextFor('peep')} value={suggestedVentilatorInputs.peep != null ? String(suggestedVentilatorInputs.peep) : ''} onChangeText={(value) => updateInput({ peep: parseNum(value) })} {...getFieldErrorProps('peep')} testID="assessment-suggested-peep" />
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
      </StyledMissingTests>
      {renderConflictWarning()}
      {renderValidationMessages()}
      <Checkbox checked={mergedInputs.clinicianConfirmed} onChange={toggleClinicianConfirmed} label={t('ventilation.assessment.saveReview.clinicianConfirmed')} required testID="assessment-clinician-confirmed" />
      {(readiness.blockers || []).length > 0 && (
        <TextArea label={t('ventilation.assessment.saveReview.overrideReason')} value={mergedInputs.overrideReason} onChangeText={(value) => updateInput({ overrideReason: value })} {...getFieldErrorProps('overrideReason')} minHeight={76} required testID="assessment-override-reason" />
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
        {renderStepper()}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: contentPaddingBottom }} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
          {renderLoadError()}
          <StyledWizardPane>
            <StyledStepHeader>
              <Text variant="h2">{stepLabel}</Text>
              <Text variant="caption">{t('ventilation.assessment.stepIndicator', { current: currentStep + 1, total: totalSteps })}</Text>
            </StyledStepHeader>
            <StyledStepContent testID={testIds.stepContent}>{renderStepContent()}</StyledStepContent>
            <StyledActionsRow>
              <Button variant="outline" onPress={goBackOrExit} testID={testIds.backButton} style={{ borderRadius: 0, minHeight: 46, flexGrow: 1 }}>{t('ventilation.assessment.actions.back')}</Button>
              {currentStep < STEPS.SAVE_REVIEW ? (
                <Button variant="primary" onPress={goNext} disabled={isSaving} loading={isSaving} testID={testIds.nextButton} style={{ borderRadius: 0, minHeight: 46, flexGrow: 1 }}>{nextActionLabel}</Button>
              ) : (
                <Button variant="primary" onPress={saveAdmission} disabled={isSaving} loading={isSaving} testID={testIds.generateButton} style={{ borderRadius: 0, minHeight: 46, flexGrow: 1 }}>{t('ventilation.assessment.actions.saveAdmission')}</Button>
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
