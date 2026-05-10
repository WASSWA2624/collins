/**
 * AssessmentScreen Component - Web
 * File: AssessmentScreen.web.jsx
 */
import React from 'react';
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
  StyledContainer,
  StyledChoiceGrid,
  StyledChoiceHeader,
  StyledChoiceHint,
  StyledChoiceLabel,
  StyledChoiceMeta,
  StyledChoiceOption,
  StyledChoiceSection,
  StyledChoiceText,
  StyledExpandButton,
  StyledFieldGroup,
  StyledFieldGrid,
  StyledFieldGridFull,
  StyledFieldWithHint,
  StyledInlineError,
  StyledLoadingMessage,
  StyledLoadingPane,
  StyledLoadingTitle,
  StyledMissingTests,
  StyledMissingTestsHint,
  StyledMissingTestsTitle,
  StyledProgressSection,
  StyledStepper,
  StyledStepperConnector,
  StyledStepperItem,
  StyledStepperLabel,
  StyledStepperMarker,
  StyledStepperMeta,
  StyledStepContent,
  StyledStepDescription,
  StyledStepHeader,
  StyledStepIndicator,
  StyledStepTitle,
  StyledSummaryBody,
  StyledSummaryCard,
  StyledSummaryGrid,
  StyledSummaryGroup,
  StyledSummaryGroupTitle,
  StyledSummaryHeader,
  StyledSummaryLabel,
  StyledSummaryPane,
  StyledSummaryTitle,
  StyledSummaryValue,
  StyledSummaryWrap,
  StyledWizardCard,
  StyledWizardPane,
} from './AssessmentScreen.web.styles';
import {
  OXYGEN_SUPPORT_OPTIONS,
  PATIENT_AGE_GROUP_OPTIONS,
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

const FIELD_TEST_IDS = Object.freeze({
  patientPathway: 'assessment-age-group-options',
  reasonForSupport: 'assessment-reason',
  ageYears: 'assessment-age',
  actualWeightKg: 'assessment-weight',
  heightOrLengthCm: 'assessment-height',
  bmi: 'assessment-bmi',
  oxygenSupportType: 'assessment-oxygen-support',
  spo2: 'assessment-spo2',
  respiratoryRate: 'assessment-respiratory-rate',
  heartRate: 'assessment-heart-rate',
  ph: 'assessment-ph',
  pao2: 'assessment-pao2',
  paco2: 'assessment-paco2',
  ventilatorMode: 'assessment-suggested-ventilator-mode',
  tidalVolumeMl: 'assessment-suggested-tidal-volume',
  respiratoryRateSet: 'assessment-suggested-respiratory-rate-set',
  peep: 'assessment-suggested-peep',
  clinicianConfirmed: 'assessment-clinician-confirmed',
  overrideReason: 'assessment-override-reason',
});

const TextField = (props) => <PlatformTextField {...props} debounceMs={0} />;
const TextArea = (props) => <PlatformTextArea {...props} debounceMs={0} />;

const formatValue = (value, unit) => {
  if (value == null || value === '') return null;
  return unit ? `${value} ${unit}` : String(value);
};

const findOptionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label || value;

const AssessmentScreenWeb = () => {
  const { t } = useI18n();
  const {
    currentStep,
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
  const stepIndicator = t('ventilation.assessment.stepIndicator', {
    current: currentStep + 1,
    total: totalSteps,
  });

  const ageGroupOptions = mapOptions(
    PATIENT_AGE_GROUP_OPTIONS,
    t,
    'ventilation.assessment.patientReason.pathways'
  ).map((option) => ({
    ...option,
    rangeLabel: t(`ventilation.assessment.patientReason.ageGroupRanges.${option.rangeKey}`),
  }));
  const sexOptions = mapOptions(SEX_OPTIONS, t, 'ventilation.assessment.patientReason.sex');
  const reasonForSupportOptions = mapReasonOptions(
    REASON_FOR_SUPPORT_OPTIONS,
    t,
    'ventilation.assessment.patientReason.reasonOptions'
  );
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
  const helperTextFor = (field, fallback) =>
    [fallback, rangeSuggestions?.[field]].filter(Boolean).join(' ');
  const ageGroupError = getFieldErrorProps('patientPathway').errorMessage;
  const selectedAgeGroup = ageGroupOptions.find((option) => option.value === mergedInputs.patientPathway);
  const errorTranslationKey = errorCode ? `errors.codes.${errorCode}` : null;
  const translatedErrorMessage = errorTranslationKey ? t(errorTranslationKey) : null;
  const errorMessage =
    translatedErrorMessage && translatedErrorMessage !== errorTranslationKey
      ? translatedErrorMessage
      : errorCode
      ? t('errors.codes.UNKNOWN_ERROR')
      : null;
  const firstInvalidField = validation?.firstInvalidField;

  React.useEffect(() => {
    if (!firstInvalidField || typeof document === 'undefined') return;
    const testId = FIELD_TEST_IDS[firstInvalidField];
    if (!testId) return;
    const root = document.querySelector(`[data-testid="${testId}"]`);
    if (!root) return;
    const target = root.matches('button, input, textarea, [tabindex]')
      ? root
      : root.querySelector('button, input, textarea, [tabindex]');
    const scrollTarget = target || root;
    scrollTarget.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    target?.focus?.({ preventScroll: true });
  }, [currentStep, firstInvalidField]);

  const renderValidationMessages = () => {
    const messages = [...new Set([errorMessage, ...(validation?.messages || [])].filter(Boolean))];
    if (!messages.length) return null;
    return (
      <StyledMissingTests data-testid="assessment-validation" role="alert">
        <StyledMissingTestsTitle>{t('ventilation.assessment.validation.title')}</StyledMissingTestsTitle>
        {messages.map((message) => (
          <StyledMissingTestsHint key={message}>{message}</StyledMissingTestsHint>
        ))}
      </StyledMissingTests>
    );
  };

  const renderConflictWarning = () => {
    if (!conflictWarning) return null;
    return (
      <StyledMissingTests data-testid="assessment-conflict-warning" role="status" aria-live="polite">
        <StyledMissingTestsTitle>{t('ventilation.assessment.validation.conflictTitle')}</StyledMissingTestsTitle>
        <StyledMissingTestsHint>{t('ventilation.assessment.validation.conflictBody')}</StyledMissingTestsHint>
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
      <StyledMissingTests data-testid="assessment-load-error" role="alert">
        <StyledMissingTestsTitle>{t('ventilation.assessment.states.errorTitle')}</StyledMissingTestsTitle>
        <StyledMissingTestsHint>{t('ventilation.assessment.states.error')}</StyledMissingTestsHint>
        <Button variant="outline" onPress={retryLoadAdmissionForm}>
          {t('ventilation.assessment.states.retryLoad')}
        </Button>
      </StyledMissingTests>
    );
  };

  const renderStepper = () => (
    <StyledStepper data-testid={testIds.progressBar} aria-label={stepIndicator} role="list">
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
        const label = t(`ventilation.assessment.steps.${key}`);
        const metaLabel = hasStepError
          ? `${stepValidation.errorCount || 1} field${stepValidation.errorCount === 1 ? '' : 's'} need attention`
          : t('ventilation.assessment.stepIndicator', { current: index + 1, total: totalSteps });
        return (
          <StyledStepperItem
            key={key}
            role="listitem"
            data-status={status}
            aria-current={status === STEP_STATUS.CURRENT ? 'step' : undefined}
            aria-label={`${label}. ${metaLabel}`}
          >
            <StyledStepperMarker data-status={status} aria-hidden="true">
              {status === STEP_STATUS.ERROR ? '!' : status === STEP_STATUS.COMPLETE ? '\u2713' : index + 1}
            </StyledStepperMarker>
            <StyledStepperMeta>
              <StyledStepperLabel data-status={status}>{label}</StyledStepperLabel>
              <StyledStepIndicator data-status={status}>
                {metaLabel}
              </StyledStepIndicator>
            </StyledStepperMeta>
            {index < STEP_KEYS.length - 1 ? <StyledStepperConnector data-status={status} /> : null}
          </StyledStepperItem>
        );
      })}
    </StyledStepper>
  );

  const renderSummary = () => {
    const groups = [
      {
        key: 'patient',
        title: t('ventilation.assessment.summary.groups.patient'),
        rows: [
          { key: 'facility', label: t('ventilation.assessment.summary.facility'), value: summaryData.facilityLabel },
          {
            key: 'pathway',
            label: t('ventilation.assessment.summary.ageGroup'),
            value: findOptionLabel(ageGroupOptions, summaryData.pathway),
          },
          { key: 'reason', label: t('ventilation.assessment.summary.reason'), value: summaryData.reasonForSupport },
        ],
      },
      {
        key: 'oxygen',
        title: t('ventilation.assessment.summary.groups.oxygen'),
        rows: [
          { key: 'spo2', label: t('ventilation.assessment.summary.spo2'), value: formatValue(summaryData.spo2, '%') },
          { key: 'pao2', label: t('ventilation.assessment.summary.pao2'), value: formatValue(summaryData.pao2, 'mmHg') },
          { key: 'ph', label: t('ventilation.assessment.summary.ph'), value: summaryData.ph },
        ],
      },
      {
        key: 'ventilator',
        title: t('ventilation.assessment.summary.groups.ventilator'),
        rows: [
          { key: 'ventMode', label: t('ventilation.assessment.summary.ventilatorMode'), value: summaryData.ventilatorMode },
          { key: 'peep', label: t('ventilation.assessment.summary.peep'), value: formatValue(summaryData.peep, 'cmH2O') },
          { key: 'vt', label: t('ventilation.assessment.summary.tidalVolume'), value: formatValue(summaryData.tidalVolumeMl, 'mL') },
          { key: 'sync', label: t('ventilation.assessment.summary.syncStatus'), value: syncStatus },
        ],
      },
    ]
      .map((group) => ({
        ...group,
        rows: group.rows.filter((row) => row.value != null && row.value !== ''),
      }))
      .filter((group) => group.rows.length > 0);

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
              {groups.length === 0 ? (
                <Text variant="body" color="text.tertiary">
                  {t('ventilation.assessment.summary.empty')}
                </Text>
              ) : (
                groups.map((group) => (
                  <StyledSummaryGroup key={group.key}>
                    <StyledSummaryGroupTitle>{group.title}</StyledSummaryGroupTitle>
                    <StyledSummaryGrid>
                      {group.rows.map(({ key, label, value }) => (
                        <StyledSummaryCard key={key}>
                          <StyledSummaryLabel>{label}</StyledSummaryLabel>
                          <StyledSummaryValue>{value}</StyledSummaryValue>
                        </StyledSummaryCard>
                      ))}
                    </StyledSummaryGrid>
                  </StyledSummaryGroup>
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
      {renderConflictWarning()}
      {renderValidationMessages()}
      <StyledChoiceSection data-testid="assessment-patient-pathway">
        <StyledChoiceHeader>
          <StyledChoiceLabel>
            {t('ventilation.assessment.patientReason.ageGroup')}
            <span aria-hidden="true"> *</span>
          </StyledChoiceLabel>
          <StyledChoiceHint>
            {selectedAgeGroup
              ? t('ventilation.assessment.patientReason.selectedAgeRange', {
                  range: selectedAgeGroup.rangeLabel,
                })
              : t('ventilation.assessment.patientReason.ageGroupPlaceholder')}
          </StyledChoiceHint>
        </StyledChoiceHeader>
        <StyledChoiceGrid data-testid="assessment-age-group-options">
          {ageGroupOptions.map((option) => {
            const selected = mergedInputs.patientPathway === option.value;
            return (
              <StyledChoiceOption
                key={option.value}
                type="button"
                data-selected={selected}
                aria-pressed={selected}
                onClick={() => updateInput({ patientPathway: option.value })}
                data-testid={`assessment-age-group-${option.value.toLowerCase()}`}
              >
                <StyledChoiceText>{option.label}</StyledChoiceText>
                <StyledChoiceMeta>{option.rangeLabel}</StyledChoiceMeta>
              </StyledChoiceOption>
            );
          })}
        </StyledChoiceGrid>
        {ageGroupError ? <StyledInlineError>{ageGroupError}</StyledInlineError> : null}
      </StyledChoiceSection>
      <StyledFieldGrid>
        <StyledFieldGridFull>
          <Select
            label={t('ventilation.assessment.patientReason.reasonForSupport')}
            placeholder={t('ventilation.assessment.patientReason.reasonForSupportPlaceholder')}
            searchPlaceholder={t('ventilation.assessment.patientReason.reasonForSupportSearchPlaceholder')}
            options={reasonForSupportOptions}
            value={mergedInputs.reasonForSupport}
            onValueChange={(value) => updateInput({ reasonForSupport: value })}
            {...getFieldErrorProps('reasonForSupport')}
            allowCustomValue
            required
            testID="assessment-reason"
          />
        </StyledFieldGridFull>
        <TextField
          label={t('ventilation.assessment.patientReason.ageYears')}
          type="number"
          helperText={helperTextFor('ageYears', t('ventilation.assessment.patientReason.ageYearsHint'))}
          value={mergedInputs.ageYears != null ? String(mergedInputs.ageYears) : ''}
          onChangeText={(value) => updateInput({ ageYears: parseNum(value) })}
          {...getFieldErrorProps('ageYears')}
          required
          testID="assessment-age"
        />
        <TextField
          label={t('ventilation.assessment.patientReason.weightKg')}
          type="number"
          helperText={helperTextFor('actualWeightKg')}
          value={mergedInputs.actualWeightKg != null ? String(mergedInputs.actualWeightKg) : ''}
          onChangeText={(value) => updateBodyMetric('actualWeightKg', parseNum(value))}
          {...getFieldErrorProps('actualWeightKg')}
          required
          testID="assessment-weight"
        />
        <TextField
          label={t('ventilation.assessment.patientReason.heightCm')}
          type="number"
          helperText={helperTextFor('heightOrLengthCm')}
          value={mergedInputs.heightOrLengthCm != null ? String(mergedInputs.heightOrLengthCm) : ''}
          onChangeText={(value) => updateBodyMetric('heightOrLengthCm', parseNum(value))}
          {...getFieldErrorProps('heightOrLengthCm')}
          required
          testID="assessment-height"
        />
        <TextField
          label={t('ventilation.assessment.patientReason.bmi')}
          type="number"
          helperText={helperTextFor('bmi')}
          value={mergedInputs.bmi != null ? String(mergedInputs.bmi) : ''}
          onChangeText={(value) => updateBodyMetric('bmi', parseNum(value))}
          {...getFieldErrorProps('bmi')}
          testID="assessment-bmi"
        />
      </StyledFieldGrid>
      <StyledChoiceSection data-testid="assessment-sex-for-size">
        <StyledChoiceHeader>
          <StyledChoiceLabel>{t('ventilation.assessment.patientReason.sexForSize')}</StyledChoiceLabel>
        </StyledChoiceHeader>
        <StyledChoiceGrid data-density="compact" data-testid="assessment-sex-options">
          {sexOptions.map((option) => {
            const selected = mergedInputs.sexForSizeCalculations === option.value;
            return (
              <StyledChoiceOption
                key={option.value}
                type="button"
                data-selected={selected}
                data-density="compact"
                aria-pressed={selected}
                onClick={() => updateInput({ sexForSizeCalculations: option.value })}
                data-testid={`assessment-sex-${option.value.toLowerCase()}`}
              >
                <StyledChoiceText>{option.label}</StyledChoiceText>
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
      <StyledFieldGrid>
        <Select
          label={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportType')}
          placeholder={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportPlaceholder')}
          helperText={t('ventilation.assessment.oxygenAbgVentilator.oxygenSupportHint')}
          options={oxygenSupportOptions}
          value={mergedInputs.oxygenSupportType}
          onValueChange={(value) => updateInput({ oxygenSupportType: value })}
          {...getFieldErrorProps('oxygenSupportType')}
          required
          testID="assessment-oxygen-support"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.spo2')}
          type="number"
          helperText={helperTextFor('spo2')}
          value={mergedInputs.spo2 != null ? String(mergedInputs.spo2) : ''}
          onChangeText={(value) => updateInput({ spo2: parseNum(value) })}
          {...getFieldErrorProps('spo2')}
          required
          testID="assessment-spo2"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.respiratoryRate')}
          type="number"
          helperText={helperTextFor('respiratoryRate')}
          value={mergedInputs.respiratoryRate != null ? String(mergedInputs.respiratoryRate) : ''}
          onChangeText={(value) => updateInput({ respiratoryRate: parseNum(value) })}
          {...getFieldErrorProps('respiratoryRate')}
          required
          testID="assessment-respiratory-rate"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.heartRate')}
          type="number"
          helperText={helperTextFor('heartRate')}
          value={mergedInputs.heartRate != null ? String(mergedInputs.heartRate) : ''}
          onChangeText={(value) => updateInput({ heartRate: parseNum(value) })}
          {...getFieldErrorProps('heartRate')}
          required
          testID="assessment-heart-rate"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.ph')}
          type="number"
          inputMode="decimal"
          step="any"
          helperText={helperTextFor('ph')}
          value={mergedInputs.ph != null ? String(mergedInputs.ph) : ''}
          onChangeText={(value) => updateInput({ ph: parseNum(value) })}
          {...getFieldErrorProps('ph')}
          required
          testID="assessment-ph"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.pao2')}
          type="number"
          helperText={helperTextFor('pao2')}
          value={mergedInputs.pao2 != null ? String(mergedInputs.pao2) : ''}
          onChangeText={(value) => updateInput({ pao2: parseNum(value) })}
          {...getFieldErrorProps('pao2')}
          testID="assessment-pao2"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.paco2')}
          type="number"
          helperText={helperTextFor('paco2')}
          value={mergedInputs.paco2 != null ? String(mergedInputs.paco2) : ''}
          onChangeText={(value) => updateInput({ paco2: parseNum(value) })}
          {...getFieldErrorProps('paco2')}
          testID="assessment-paco2"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.hco3')}
          type="number"
          helperText={helperTextFor('hco3')}
          value={mergedInputs.hco3 != null ? String(mergedInputs.hco3) : ''}
          onChangeText={(value) => updateInput({ hco3: parseNum(value) })}
          {...getFieldErrorProps('hco3')}
          testID="assessment-hco3"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.baseExcess')}
          type="number"
          helperText={helperTextFor('baseExcess')}
          value={mergedInputs.baseExcess != null ? String(mergedInputs.baseExcess) : ''}
          onChangeText={(value) => updateInput({ baseExcess: parseNum(value) })}
          {...getFieldErrorProps('baseExcess')}
          testID="assessment-base-excess"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.lactate')}
          type="number"
          helperText={helperTextFor('lactate')}
          value={mergedInputs.lactate != null ? String(mergedInputs.lactate) : ''}
          onChangeText={(value) => updateInput({ lactate: parseNum(value) })}
          {...getFieldErrorProps('lactate')}
          testID="assessment-lactate"
        />
        <TextField
          label={t('ventilation.assessment.oxygenAbgVentilator.spo2AtSample')}
          type="number"
          helperText={helperTextFor('spo2AtSample')}
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
                helperText={helperTextFor('tidalVolumeMl')}
                value={suggestedVentilatorInputs.tidalVolumeMl != null ? String(suggestedVentilatorInputs.tidalVolumeMl) : ''}
                onChangeText={(value) => updateInput({ tidalVolumeMl: parseNum(value) })}
                {...getFieldErrorProps('tidalVolumeMl')}
                testID="assessment-suggested-tidal-volume"
              />
              <TextField
                label={t('ventilation.assessment.saveReview.respiratoryRateSet')}
                type="number"
                helperText={helperTextFor('respiratoryRateSet')}
                value={suggestedVentilatorInputs.respiratoryRateSet != null ? String(suggestedVentilatorInputs.respiratoryRateSet) : ''}
                onChangeText={(value) => updateInput({ respiratoryRateSet: parseNum(value) })}
                {...getFieldErrorProps('respiratoryRateSet')}
                testID="assessment-suggested-respiratory-rate-set"
              />
              <TextField
                label={t('ventilation.assessment.saveReview.peep')}
                type="number"
                helperText={helperTextFor('peep')}
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
    </StyledMissingTests>
  );

  const renderSaveReviewStep = () => (
    <StyledFieldGroup>
      <StyledStepDescription>{t('ventilation.assessment.saveReview.description')}</StyledStepDescription>
      {renderRecommendation()}
      {renderReadiness()}
      {renderConflictWarning()}
      {renderValidationMessages()}
      <Checkbox
        checked={mergedInputs.clinicianConfirmed}
        onChange={toggleClinicianConfirmed}
        label={t('ventilation.assessment.saveReview.clinicianConfirmed')}
        required
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
        {renderStepper()}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
