/**
 * AssessmentScreen Component - Web
 * File: AssessmentScreen.web.jsx
 */
import React from 'react';
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
  StyledExpandButton,
  StyledFieldGroup,
  StyledFieldGrid,
  StyledFieldGridFull,
  StyledFieldWithHint,
  StyledLoadingMessage,
  StyledLoadingPane,
  StyledLoadingTitle,
  StyledMissingTests,
  StyledMissingTestsHint,
  StyledMissingTestsTitle,
  StyledProgressSection,
  StyledStepContent,
  StyledStepDescription,
  StyledStepHeader,
  StyledStepIndicator,
  StyledStepTitle,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryLabel,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledSummaryTitle,
  StyledSummaryValue,
  StyledSummaryWrap,
  StyledWizardCard,
  StyledWizardPane,
} from './AssessmentScreen.web.styles';
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

const AssessmentScreenWeb = () => {
  const { t } = useI18n();
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
  const stepIndicator = t('ventilation.assessment.stepIndicator', {
    current: currentStep + 1,
    total: totalSteps,
  });

  const pathwayOptions = mapOptions(
    PATIENT_PATHWAY_OPTIONS,
    t,
    'ventilation.assessment.patientReason.pathways'
  );
  const sexOptions = mapOptions(SEX_OPTIONS, t, 'ventilation.assessment.patientReason.sex');
  const oxygenSupportOptions = mapOptions(
    OXYGEN_SUPPORT_OPTIONS,
    t,
    'ventilation.assessment.oxygenAbgVentilator.oxygenSupportOptions'
  );
  const ventilatorModeOptions = mapOptions(
    VENTILATOR_MODE_OPTIONS,
    t,
    'ventilation.assessment.saveReview.ventilatorModeOptions'
  );
  const getFieldErrorProps = (field) => {
    const message = validation?.fieldErrors?.[field];
    return message ? { validationState: 'error', errorMessage: message } : {};
  };
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
      <StyledMissingTests data-testid="assessment-validation" role="alert">
        <StyledMissingTestsTitle>{t('ventilation.assessment.validation.title')}</StyledMissingTestsTitle>
        {validation.messages.map((message) => (
          <StyledMissingTestsHint key={message}>{message}</StyledMissingTestsHint>
        ))}
      </StyledMissingTests>
    );
  };

  const renderLoadError = () => {
    if (!loadErrorCode) return null;
    return (
      <StyledMissingTests data-testid="assessment-load-error" role="alert">
        <StyledMissingTestsTitle>{t('ventilation.assessment.states.errorTitle')}</StyledMissingTestsTitle>
        <StyledMissingTestsHint>{t('ventilation.assessment.states.error')}</StyledMissingTestsHint>
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
      { key: 'ph', label: t('ventilation.assessment.summary.ph'), value: summaryData.ph },
      { key: 'ventMode', label: t('ventilation.assessment.summary.ventilatorMode'), value: summaryData.ventilatorMode },
      { key: 'peep', label: t('ventilation.assessment.summary.peep'), value: formatValue(summaryData.peep, 'cmH2O') },
      { key: 'vt', label: t('ventilation.assessment.summary.tidalVolume'), value: formatValue(summaryData.tidalVolumeMl, 'mL') },
      { key: 'sync', label: t('ventilation.assessment.summary.syncStatus'), value: syncStatus },
    ].filter((row) => row.value != null && row.value !== '');

    return (
      <StyledSummaryWrap>
        <StyledSummaryPane
          aria-label={t('ventilation.assessment.summary.accessibilityLabel')}
          data-testid={testIds.summary}
          testID={testIds.summary}
        >
          <StyledSummaryHeader>
            <StyledSummaryTitle>
              <Text variant="label">{t('ventilation.assessment.summary.title')}</Text>
            </StyledSummaryTitle>
            <StyledExpandButton
              type="button"
              onClick={() => setSummaryExpanded((expanded) => !expanded)}
              aria-expanded={summaryExpanded}
              data-testid={testIds.summaryExpand}
              testID={testIds.summaryExpand}
              aria-label={
                summaryExpanded
                  ? t('ventilation.assessment.summary.collapse')
                  : t('ventilation.assessment.summary.expand')
              }
            >
              {summaryExpanded ? '-' : '+'}
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
                    <StyledSummaryLabel>{label}</StyledSummaryLabel>
                    <StyledSummaryValue>{value}</StyledSummaryValue>
                  </StyledSummaryRow>
                ))
              )}
            </StyledSummaryBody>
          )}
        </StyledSummaryPane>
      </StyledSummaryWrap>
    );
  };

  const renderPatientReasonStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.patientReason.description')}</StyledStepDescription>
      {renderValidationMessages()}
      <StyledFieldGrid>
        <Select
          label={t('ventilation.assessment.patientReason.pathway')}
          placeholder={t('ventilation.assessment.patientReason.pathwayPlaceholder')}
          options={pathwayOptions}
          value={mergedInputs.patientPathway}
          onValueChange={(value) => updateInput({ patientPathway: value })}
          {...getFieldErrorProps('patientPathway')}
          required
          testID="assessment-patient-pathway"
        />
        <Select
          label={t('ventilation.assessment.patientReason.sexForSize')}
          options={sexOptions}
          value={mergedInputs.sexForSizeCalculations}
          onValueChange={(value) => updateInput({ sexForSizeCalculations: value })}
          testID="assessment-sex-for-size"
        />
        <TextField
          label={t('ventilation.assessment.patientReason.ageYears')}
          type="number"
          value={mergedInputs.ageYears != null ? String(mergedInputs.ageYears) : ''}
          onChangeText={(value) => updateInput({ ageYears: parseNum(value) })}
          {...getFieldErrorProps('ageYears')}
          testID="assessment-age"
        />
        <TextField
          label={t('ventilation.assessment.patientReason.weightKg')}
          type="number"
          value={mergedInputs.actualWeightKg != null ? String(mergedInputs.actualWeightKg) : ''}
          onChangeText={(value) => updateBodyMetric('actualWeightKg', parseNum(value))}
          {...getFieldErrorProps('actualWeightKg')}
          testID="assessment-weight"
        />
        <TextField
          label={t('ventilation.assessment.patientReason.heightCm')}
          type="number"
          value={mergedInputs.heightOrLengthCm != null ? String(mergedInputs.heightOrLengthCm) : ''}
          onChangeText={(value) => updateBodyMetric('heightOrLengthCm', parseNum(value))}
          {...getFieldErrorProps('heightOrLengthCm')}
          testID="assessment-height"
        />
        <TextField
          label={t('ventilation.assessment.patientReason.bmi')}
          type="number"
          value={mergedInputs.bmi != null ? String(mergedInputs.bmi) : ''}
          onChangeText={(value) => updateBodyMetric('bmi', parseNum(value))}
          {...getFieldErrorProps('bmi')}
          testID="assessment-bmi"
        />
        <StyledFieldGridFull>
          <TextArea
            label={t('ventilation.assessment.patientReason.reasonForSupport')}
            placeholder={t('ventilation.assessment.patientReason.reasonForSupportPlaceholder')}
            value={mergedInputs.reasonForSupport}
            onChangeText={(value) => updateInput({ reasonForSupport: value })}
            {...getFieldErrorProps('reasonForSupport')}
            minHeight={76}
            testID="assessment-reason"
          />
        </StyledFieldGridFull>
      </StyledFieldGrid>
    </StyledFieldGroup>
  );

  const renderOxygenAbgVentilatorStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.oxygenAbgVentilator.description')}</StyledStepDescription>
      {renderValidationMessages()}
      <StyledFieldGrid>
        <Select
          label={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportType')}
          placeholder={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportPlaceholder')}
          helperText={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportHint')}
          options={oxygenSupportOptions}
          value={mergedInputs.oxygenSupportType}
          onValueChange={(value) => updateInput({ oxygenSupportType: value })}
          {...getFieldErrorProps('oxygenSupportType')}
          testID="assessment-oxygen-support"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.measuredAt')}
          type="datetime-local"
          placeholder={t('ventilation.assessment.oxygenAbgVentilator.timePlaceholder')}
          helperText={t('ventilation.assessment.oxygenAbgVentilator.timeHint')}
          value={mergedInputs.measuredAt}
          onChangeText={(value) => updateInput({ measuredAt: value })}
          {...getFieldErrorProps('measuredAt')}
          testID="assessment-measured-at"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.spo2')}
          type="number"
          value={mergedInputs.spo2 != null ? String(mergedInputs.spo2) : ''}
          onChangeText={(value) => updateInput({ spo2: parseNum(value) })}
          {...getFieldErrorProps('spo2')}
          testID="assessment-spo2"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.fio2')}
          type="number"
          value={mergedInputs.fio2 != null ? String(mergedInputs.fio2) : ''}
          onChangeText={(value) => updateInput({ fio2: parseNum(value) })}
          {...getFieldErrorProps('fio2')}
          testID="assessment-fio2"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.respiratoryRate')}
          type="number"
          value={mergedInputs.respiratoryRate != null ? String(mergedInputs.respiratoryRate) : ''}
          onChangeText={(value) => updateInput({ respiratoryRate: parseNum(value) })}
          {...getFieldErrorProps('respiratoryRate')}
          testID="assessment-respiratory-rate"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.heartRate')}
          type="number"
          value={mergedInputs.heartRate != null ? String(mergedInputs.heartRate) : ''}
          onChangeText={(value) => updateInput({ heartRate: parseNum(value) })}
          {...getFieldErrorProps('heartRate')}
          testID="assessment-heart-rate"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.ph')}
          type="number"
          value={mergedInputs.ph != null ? String(mergedInputs.ph) : ''}
          onChangeText={(value) => updateInput({ ph: parseNum(value) })}
          {...getFieldErrorProps('ph')}
          testID="assessment-ph"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.pao2')}
          type="number"
          value={mergedInputs.pao2 != null ? String(mergedInputs.pao2) : ''}
          onChangeText={(value) => updateInput({ pao2: parseNum(value) })}
          {...getFieldErrorProps('pao2')}
          testID="assessment-pao2"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.paco2')}
          type="number"
          value={mergedInputs.paco2 != null ? String(mergedInputs.paco2) : ''}
          onChangeText={(value) => updateInput({ paco2: parseNum(value) })}
          {...getFieldErrorProps('paco2')}
          testID="assessment-paco2"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.hco3')}
          type="number"
          value={mergedInputs.hco3 != null ? String(mergedInputs.hco3) : ''}
          onChangeText={(value) => updateInput({ hco3: parseNum(value) })}
          {...getFieldErrorProps('hco3')}
          testID="assessment-hco3"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.baseExcess')}
          type="number"
          value={mergedInputs.baseExcess != null ? String(mergedInputs.baseExcess) : ''}
          onChangeText={(value) => updateInput({ baseExcess: parseNum(value) })}
          {...getFieldErrorProps('baseExcess')}
          testID="assessment-base-excess"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.lactate')}
          type="number"
          value={mergedInputs.lactate != null ? String(mergedInputs.lactate) : ''}
          onChangeText={(value) => updateInput({ lactate: parseNum(value) })}
          {...getFieldErrorProps('lactate')}
          testID="assessment-lactate"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.fio2AtSample')}
          type="number"
          value={mergedInputs.fio2AtSample != null ? String(mergedInputs.fio2AtSample) : ''}
          onChangeText={(value) => updateInput({ fio2AtSample: parseNum(value) })}
          {...getFieldErrorProps('fio2AtSample')}
          testID="assessment-fio2-at-sample"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.spo2AtSample')}
          type="number"
          value={mergedInputs.spo2AtSample != null ? String(mergedInputs.spo2AtSample) : ''}
          onChangeText={(value) => updateInput({ spo2AtSample: parseNum(value) })}
          {...getFieldErrorProps('spo2AtSample')}
          testID="assessment-spo2-at-sample"
        />
        <StyledFieldGridFull>
          <StyledFieldWithHint>
            <TextField
              label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFields')}
              placeholder={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyFieldsPlaceholder')}
              value={mergedInputs.uncertaintyFieldsText}
              onChangeText={(value) => updateInput({ uncertaintyFieldsText: value })}
              testID="assessment-uncertainty-fields"
            />
            <Text variant="caption" color="text.tertiary">
              {t('ventilation.assessment.oxygenAbgVentilator.uncertaintyHint')}
            </Text>
          </StyledFieldWithHint>
        </StyledFieldGridFull>
        <StyledFieldGridFull>
          <TextArea
            label={t('ventilation.assessment.oxygenAbgVentilator.uncertaintyReason')}
            value={mergedInputs.uncertaintyReason}
            onChangeText={(value) => updateInput({ uncertaintyReason: value })}
            minHeight={76}
            testID="assessment-uncertainty-reason"
          />
        </StyledFieldGridFull>
      </StyledFieldGrid>
    </StyledFieldGroup>
  );

  const renderRecommendation = () => {
    const hasRecommendation = recommendationSettings && Object.keys(recommendationSettings).length > 0;

    return (
      <StyledMissingTests data-testid={testIds.recommendation} role="region" aria-label={t('ventilation.assessment.saveReview.recommendationTitle')}>
        <StyledMissingTestsTitle>
          {t('ventilation.assessment.saveReview.recommendationTitle')}
        </StyledMissingTestsTitle>
        {isGeneratingRecommendation ? (
          <>
            <LoadingSpinner
              size="large"
              accessibilityLabel={t('ventilation.assessment.saveReview.recommendationGenerating')}
              testID="assessment-recommendation-loading"
            />
            <StyledMissingTestsHint>
              {t('ventilation.assessment.saveReview.recommendationGenerating')}
            </StyledMissingTestsHint>
          </>
        ) : hasRecommendation ? (
          <>
            <StyledMissingTestsHint>
              {t('ventilation.assessment.saveReview.recommendationConfidence', { confidence: t(`ventilation.recommendation.confidence.${recommendationConfidence}`) })}
            </StyledMissingTestsHint>
            <StyledMissingTestsHint>
              {t('ventilation.assessment.saveReview.suggestedSettingsHint')}
            </StyledMissingTestsHint>
            <StyledFieldGrid>
              <Select
                label={t('ventilation.assessment.saveReview.ventilatorMode')}
                placeholder={t('ventilation.assessment.saveReview.modePlaceholder')}
                options={ventilatorModeOptions}
                value={suggestedVentilatorInputs.ventilatorMode}
                onValueChange={(value) => updateInput({ ventilatorMode: value })}
                {...getFieldErrorProps('ventilatorMode')}
                testID="assessment-suggested-ventilator-mode"
              />
              <TextField
                label={t('ventilation.assessment.saveReview.tidalVolumeMl')}
                type="number"
                value={suggestedVentilatorInputs.tidalVolumeMl != null ? String(suggestedVentilatorInputs.tidalVolumeMl) : ''}
                onChangeText={(value) => updateInput({ tidalVolumeMl: parseNum(value) })}
                {...getFieldErrorProps('tidalVolumeMl')}
                testID="assessment-suggested-tidal-volume"
              />
              <TextField
                label={t('ventilation.assessment.saveReview.respiratoryRateSet')}
                type="number"
                value={suggestedVentilatorInputs.respiratoryRateSet != null ? String(suggestedVentilatorInputs.respiratoryRateSet) : ''}
                onChangeText={(value) => updateInput({ respiratoryRateSet: parseNum(value) })}
                {...getFieldErrorProps('respiratoryRateSet')}
                testID="assessment-suggested-respiratory-rate-set"
              />
              <TextField
                label={t('ventilation.assessment.saveReview.ventilatorFio2')}
                type="number"
                value={suggestedVentilatorInputs.ventilatorFio2 != null ? String(suggestedVentilatorInputs.ventilatorFio2) : ''}
                onChangeText={(value) => updateInput({ ventilatorFio2: parseNum(value) })}
                {...getFieldErrorProps('ventilatorFio2')}
                testID="assessment-suggested-ventilator-fio2"
              />
              <TextField
                label={t('ventilation.assessment.saveReview.peep')}
                type="number"
                value={suggestedVentilatorInputs.peep != null ? String(suggestedVentilatorInputs.peep) : ''}
                onChangeText={(value) => updateInput({ peep: parseNum(value) })}
                {...getFieldErrorProps('peep')}
                testID="assessment-suggested-peep"
              />
              <TextField
                label={t('ventilation.assessment.saveReview.ieRatio')}
                value={suggestedVentilatorInputs.ieRatio}
                onChangeText={(value) => updateInput({ ieRatio: value })}
                testID="assessment-suggested-ie-ratio"
              />
            </StyledFieldGrid>
          </>
        ) : (
          <StyledMissingTestsHint>
            {recommendationErrorCode
              ? t('ventilation.assessment.saveReview.recommendationError')
              : t('ventilation.assessment.saveReview.recommendationEmpty')}
          </StyledMissingTestsHint>
        )}
        {recommendationMissingInputs.length > 0 ? (
          <StyledMissingTestsHint>
            {t('ventilation.recommendation.decisionSupport.missingData')}: {recommendationMissingInputs.join(', ')}
          </StyledMissingTestsHint>
        ) : null}
      </StyledMissingTests>
    );
  };

  const renderReadiness = () => (
    <StyledMissingTests data-testid={testIds.readiness} role="region" aria-label={t('ventilation.assessment.saveReview.readiness')}>
      <StyledMissingTestsTitle>
        {readiness.isReadyToSave
          ? t('ventilation.assessment.saveReview.ready')
          : t('ventilation.assessment.saveReview.needsCorrection')}
      </StyledMissingTestsTitle>
      <StyledMissingTestsHint data-testid={testIds.syncStatus}>
        {t('ventilation.assessment.saveReview.syncStatus', { status: syncStatus })}
      </StyledMissingTestsHint>
      {(readiness.warnings || []).map((warning, index) => (
        <StyledMissingTestsHint key={`${warning.code}-${warning.field}-${index}`}>
          {warning.message}
        </StyledMissingTestsHint>
      ))}
      {(readiness.blockers || []).map((blocker, index) => (
        <StyledMissingTestsHint key={`${blocker.code}-${blocker.field}-${index}`}>
          {blocker.message}
        </StyledMissingTestsHint>
      ))}
      {errorMessage ? <StyledMissingTestsHint>{errorMessage}</StyledMissingTestsHint> : null}
    </StyledMissingTests>
  );

  const renderSaveReviewStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.saveReview.description')}</StyledStepDescription>
      {renderRecommendation()}
      {renderReadiness()}
      {renderValidationMessages()}
      <Checkbox
        checked={mergedInputs.clinicianConfirmed}
        onChange={toggleClinicianConfirmed}
        label={t('ventilation.assessment.saveReview.clinicianConfirmed')}
        testID="assessment-clinician-confirmed"
      />
      {(readiness.blockers || []).length > 0 && (
        <TextArea
          label={t('ventilation.assessment.saveReview.overrideReason')}
          value={mergedInputs.overrideReason}
          onChangeText={(value) => updateInput({ overrideReason: value })}
          {...getFieldErrorProps('overrideReason')}
          minHeight={76}
          required
          testID="assessment-override-reason"
        />
      )}
      <TextArea
        label={t('ventilation.assessment.saveReview.reviewNote')}
        value={mergedInputs.reviewNote}
        onChangeText={(value) => updateInput({ reviewNote: value })}
        minHeight={76}
        testID="assessment-review-note"
      />
    </StyledFieldGroup>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.PATIENT_REASON:
        return renderPatientReasonStep();
      case STEPS.OXYGEN_ABG_VENTILATOR:
        return renderOxygenAbgVentilatorStep();
      case STEPS.SAVE_REVIEW:
        return renderSaveReviewStep();
      default:
        return null;
    }
  };

  if (isHydrating) {
    return (
      <StyledContainer aria-label={t('ventilation.assessment.accessibilityLabel')} data-testid={testIds.screen} testID={testIds.screen}>
        <StyledLoadingPane aria-live="polite">
          <LoadingSpinner
            size="large"
            accessibilityLabel={t('ventilation.assessment.states.loading')}
            testID="assessment-loading-spinner"
          />
          <StyledLoadingTitle>{t('ventilation.assessment.title')}</StyledLoadingTitle>
          <StyledLoadingMessage>{t('ventilation.assessment.states.loading')}</StyledLoadingMessage>
        </StyledLoadingPane>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer aria-label={t('ventilation.assessment.accessibilityLabel')} data-testid={testIds.screen} testID={testIds.screen} role="main">
      {renderLoadError()}
      <StyledProgressSection>
        <ProgressBar
          value={progressPercent}
          testID={testIds.progressBar}
          aria-label={t('common.progress', { value: Math.round(progressPercent) })}
        />
      </StyledProgressSection>
      <StyledWizardPane>
        <StyledWizardCard>
          <StyledStepHeader>
            <StyledStepTitle>{stepLabel}</StyledStepTitle>
            <StyledStepIndicator>{stepIndicator}</StyledStepIndicator>
          </StyledStepHeader>
          <StyledStepContent data-testid={testIds.stepContent}>{renderStepContent()}</StyledStepContent>
        </StyledWizardCard>
        <StyledActionsRow>
          <Button
            variant="outline"
            onPress={goBackOrExit}
            testID={testIds.backButton}
            accessibilityLabel={t('ventilation.assessment.actions.back')}
          >
            {t('ventilation.assessment.actions.back')}
          </Button>
          {currentStep < STEPS.SAVE_REVIEW ? (
            <Button
              variant="primary"
              onPress={goNext}
              disabled={isSaving || !canProceedFromStep(currentStep)}
              loading={isSaving}
              testID={testIds.nextButton}
              accessibilityLabel={t('ventilation.assessment.actions.next')}
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={saveAdmission}
              disabled={isSaving || !canProceedFromStep(currentStep)}
              loading={isSaving}
              testID={testIds.generateButton}
              accessibilityLabel={t('ventilation.assessment.actions.saveAdmission')}
            >
              {t('ventilation.assessment.actions.saveAdmission')}
            </Button>
          )}
        </StyledActionsRow>
      </StyledWizardPane>
      {renderSummary()}
    </StyledContainer>
  );
};

export default AssessmentScreenWeb;
