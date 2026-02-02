/**
 * AssessmentScreen Component - iOS
 * File: AssessmentScreen.ios.jsx
 */
import React from 'react';
import { Pressable } from 'react-native';
import {
  Button,
  ProgressBar,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useAssessmentScreen from './useAssessmentScreen';
import {
  StyledActionsRow,
  StyledContainer,
  StyledContentWrap,
  StyledFieldGroup,
  StyledMissingTests,
  StyledStepContent,
  StyledStepHeader,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledWizardPane,
} from './AssessmentScreen.ios.styles';
import { CONDITION_OPTIONS, GENDER_OPTIONS, STEPS } from './types';

const conditionOptions = (t) => CONDITION_OPTIONS.map((o) => ({ value: o.value, label: t(`ventilation.assessment.conditions.${o.labelKey}`) }));
const genderOptions = (t) => GENDER_OPTIONS.map((o) => ({ value: o.value, label: t(`ventilation.assessment.patientProfile.${o.labelKey}`) }));

const parseNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

const parseComorbidities = (val) => {
  if (typeof val !== 'string' || !val.trim()) return [];
  return val.split(',').map((s) => s.trim()).filter(Boolean);
};

const AssessmentScreenIOS = () => {
  const { t } = useI18n();
  const {
    currentStep,
    progressPercent,
    mergedInputs,
    updateInput,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    additionalTestPrompts,
    units,
    canProceedFromStep,
    goNext,
    goBack,
    generateRecommendation,
    isGenerating,
    isHydrating,
    testIds,
    stepKey,
    addObservation,
    updateObservation,
    removeObservation,
  } = useAssessmentScreen();

  const stepLabel = t(`ventilation.assessment.steps.${stepKey}`);
  const hasMissingTests = additionalTestPrompts?.length > 0;

  const renderSummary = () => {
    const rows = [
      { key: 'condition', label: t('ventilation.assessment.summary.condition'), value: summaryData.condition },
      { key: 'spo2', label: t('ventilation.assessment.summary.spo2'), value: summaryData.spo2, unit: units?.spo2 },
      { key: 'rr', label: t('ventilation.assessment.summary.respiratoryRate'), value: summaryData.respiratoryRate, unit: units?.respiratoryRate },
      { key: 'hr', label: t('ventilation.assessment.summary.heartRate'), value: summaryData.heartRate, unit: units?.heartRate },
      { key: 'pao2', label: t('ventilation.assessment.summary.pao2'), value: summaryData.pao2, unit: units?.pao2 },
      { key: 'paco2', label: t('ventilation.assessment.summary.paco2'), value: summaryData.paco2, unit: units?.paco2 },
      { key: 'ph', label: t('ventilation.assessment.summary.ph'), value: summaryData.ph, unit: units?.ph },
    ];
    const filled = rows.filter((r) => r.value != null && r.value !== '');
    const isEmpty = filled.length === 0;

    return (
      <StyledSummaryPane accessibilityLabel={t('ventilation.assessment.summary.accessibilityLabel')} testID={testIds.summary}>
        <StyledSummaryHeader>
          <Text variant="label">{t('ventilation.assessment.summary.title')}</Text>
          <Pressable
            onPress={() => setSummaryExpanded((e) => !e)}
            accessibilityRole="button"
            accessibilityState={{ expanded: summaryExpanded }}
            accessibilityLabel={summaryExpanded ? t('ventilation.assessment.summary.collapse') : t('ventilation.assessment.summary.expand')}
            testID={testIds.summaryExpand}
          >
            <Text>{summaryExpanded ? '−' : '+'}</Text>
          </Pressable>
        </StyledSummaryHeader>
        {(summaryExpanded || !isEmpty) && (
          <StyledSummaryBody>
            {isEmpty ? (
              <Text variant="body" color="text.tertiary">{t('ventilation.assessment.summary.empty')}</Text>
            ) : (
              filled.map(({ key, label, value, unit }) => (
                <StyledSummaryRow key={key}>
                  <Text variant="body">{label}</Text>
                  <Text variant="body">{value}{unit ? ` ${unit}` : ''}</Text>
                </StyledSummaryRow>
              ))
            )}
          </StyledSummaryBody>
        )}
      </StyledSummaryPane>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.PATIENT_PROFILE:
        return (
          <StyledFieldGroup>
            <Select
              label={t('ventilation.assessment.patientProfile.condition')}
              placeholder={t('ventilation.assessment.patientProfile.conditionPlaceholder')}
              options={conditionOptions(t)}
              value={mergedInputs.condition}
              onValueChange={(v) => updateInput({ condition: v })}
              accessibilityHint={t('ventilation.assessment.patientProfile.conditionHint')}
              testID="assessment-condition"
            />
            <TextField
              label={t('ventilation.assessment.patientProfile.age')}
              placeholder={t('ventilation.assessment.patientProfile.agePlaceholder')}
              type="number"
              value={mergedInputs.age != null ? String(mergedInputs.age) : ''}
              onChangeText={(v) => updateInput({ age: parseNum(v) })}
              accessibilityHint={t('ventilation.assessment.patientProfile.ageHint')}
              testID="assessment-age"
            />
            <TextField
              label={t('ventilation.assessment.patientProfile.weight')}
              placeholder={t('ventilation.assessment.patientProfile.weightPlaceholder')}
              type="number"
              value={mergedInputs.weight != null ? String(mergedInputs.weight) : ''}
              onChangeText={(v) => updateInput({ weight: parseNum(v) })}
              accessibilityHint={t('ventilation.assessment.patientProfile.weightHint')}
              testID="assessment-weight"
            />
            <TextField
              label={t('ventilation.assessment.patientProfile.height')}
              placeholder={t('ventilation.assessment.patientProfile.heightPlaceholder')}
              type="number"
              value={mergedInputs.height != null ? String(mergedInputs.height) : ''}
              onChangeText={(v) => updateInput({ height: parseNum(v) })}
              accessibilityHint={t('ventilation.assessment.patientProfile.heightHint')}
              testID="assessment-height"
            />
            <Select
              label={t('ventilation.assessment.patientProfile.gender')}
              placeholder={t('ventilation.assessment.patientProfile.genderPlaceholder')}
              options={genderOptions(t)}
              value={mergedInputs.gender}
              onValueChange={(v) => updateInput({ gender: v })}
              accessibilityHint={t('ventilation.assessment.patientProfile.genderHint')}
              testID="assessment-gender"
            />
            <TextField
              label={t('ventilation.assessment.patientProfile.comorbidities')}
              placeholder={t('ventilation.assessment.patientProfile.comorbiditiesPlaceholder')}
              value={mergedInputs.comorbiditiesText}
              onChangeText={(v) => updateInput({ comorbiditiesText: v, comorbidities: parseComorbidities(v) })}
              accessibilityHint={t('ventilation.assessment.patientProfile.comorbiditiesHint')}
              testID="assessment-comorbidities"
            />
          </StyledFieldGroup>
        );
      case STEPS.CLINICAL_PARAMS:
        return (
          <StyledFieldGroup>
            <TextField
              label={`${t('ventilation.assessment.clinicalParams.spo2')} (${units?.spo2 ?? '%'})`}
              placeholder={t('ventilation.assessment.clinicalParams.spo2Placeholder')}
              type="number"
              value={mergedInputs.spo2 != null ? String(mergedInputs.spo2) : ''}
              onChangeText={(v) => updateInput({ spo2: parseNum(v) })}
              required
              accessibilityHint={t('ventilation.assessment.clinicalParams.spo2Hint')}
              testID="assessment-spo2"
            />
            <TextField
              label={`${t('ventilation.assessment.clinicalParams.respiratoryRate')} (${units?.respiratoryRate ?? 'breaths/min'})`}
              placeholder={t('ventilation.assessment.clinicalParams.respiratoryRatePlaceholder')}
              type="number"
              value={mergedInputs.respiratoryRate != null ? String(mergedInputs.respiratoryRate) : ''}
              onChangeText={(v) => updateInput({ respiratoryRate: parseNum(v) })}
              required
              accessibilityHint={t('ventilation.assessment.clinicalParams.respiratoryRateHint')}
              testID="assessment-rr"
            />
            <TextField
              label={`${t('ventilation.assessment.clinicalParams.heartRate')} (${units?.heartRate ?? 'bpm'})`}
              placeholder={t('ventilation.assessment.clinicalParams.heartRatePlaceholder')}
              type="number"
              value={mergedInputs.heartRate != null ? String(mergedInputs.heartRate) : ''}
              onChangeText={(v) => updateInput({ heartRate: parseNum(v) })}
              required
              accessibilityHint={t('ventilation.assessment.clinicalParams.heartRateHint')}
              testID="assessment-hr"
            />
            <TextField
              label={`${t('ventilation.assessment.clinicalParams.pao2')} (${units?.pao2 ?? 'mmHg'})`}
              placeholder={t('ventilation.assessment.clinicalParams.pao2Placeholder')}
              type="number"
              value={mergedInputs.pao2 != null ? String(mergedInputs.pao2) : ''}
              onChangeText={(v) => updateInput({ pao2: parseNum(v) })}
              accessibilityHint={t('ventilation.assessment.clinicalParams.pao2Hint')}
              testID="assessment-pao2"
            />
            <TextField
              label={`${t('ventilation.assessment.clinicalParams.paco2')} (${units?.paco2 ?? 'mmHg'})`}
              placeholder={t('ventilation.assessment.clinicalParams.paco2Placeholder')}
              type="number"
              value={mergedInputs.paco2 != null ? String(mergedInputs.paco2) : ''}
              onChangeText={(v) => updateInput({ paco2: parseNum(v) })}
              accessibilityHint={t('ventilation.assessment.clinicalParams.paco2Hint')}
              testID="assessment-paco2"
            />
            <TextField
              label={`${t('ventilation.assessment.clinicalParams.ph')} (${units?.ph ?? 'unitless'})`}
              placeholder={t('ventilation.assessment.clinicalParams.phPlaceholder')}
              type="number"
              value={mergedInputs.ph != null ? String(mergedInputs.ph) : ''}
              onChangeText={(v) => updateInput({ ph: parseNum(v) })}
              accessibilityHint={t('ventilation.assessment.clinicalParams.phHint')}
              testID="assessment-ph"
            />
            <TextField
              label={t('ventilation.assessment.clinicalParams.bloodPressure')}
              placeholder={t('ventilation.assessment.clinicalParams.bloodPressurePlaceholder')}
              value={mergedInputs.bloodPressure}
              onChangeText={(v) => updateInput({ bloodPressure: v })}
              accessibilityHint={t('ventilation.assessment.clinicalParams.bloodPressureHint')}
              testID="assessment-bp"
            />
          </StyledFieldGroup>
        );
      case STEPS.OBSERVATIONS:
        return (
          <StyledFieldGroup>
            <Text variant="body">{t('ventilation.assessment.observations.title')} ({t('ventilation.assessment.observations.optional')})</Text>
            {(mergedInputs.observations || []).map((obs, i) => (
              <StyledFieldGroup key={i}>
                <TextField
                  label={t('ventilation.assessment.observations.name')}
                  value={obs.name ?? ''}
                  onChangeText={(v) => updateObservation(i, { name: v })}
                  testID={`assessment-obs-name-${i}`}
                />
                <TextField
                  label={t('ventilation.assessment.observations.value')}
                  type="number"
                  value={obs.value != null ? String(obs.value) : ''}
                  onChangeText={(v) => updateObservation(i, { value: parseNum(v) })}
                  testID={`assessment-obs-value-${i}`}
                />
                <Button variant="ghost" onPress={() => removeObservation(i)} testID={`assessment-obs-remove-${i}`}>
                  {t('common.remove')}
                </Button>
              </StyledFieldGroup>
            ))}
            <Button variant="outline" onPress={addObservation} testID="assessment-add-observation">
              {t('ventilation.assessment.observations.add')}
            </Button>
          </StyledFieldGroup>
        );
      case STEPS.TIME_SERIES:
        return (
          <StyledFieldGroup>
            <Text variant="body">{t('ventilation.assessment.timeSeries.title')} ({t('ventilation.assessment.timeSeries.optional')})</Text>
          </StyledFieldGroup>
        );
      case STEPS.REVIEW:
        return (
          <StyledFieldGroup>
            <Text variant="body">{t('ventilation.assessment.summary.title')}</Text>
          </StyledFieldGroup>
        );
      default:
        return null;
    }
  };

  if (isHydrating) {
    return (
      <StyledContainer accessibilityLabel={t('ventilation.assessment.accessibilityLabel')} testID={testIds.screen}>
        <Text>{t('ventilation.assessment.states.loading')}</Text>
      </StyledContainer>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StyledContainer accessibilityLabel={t('ventilation.assessment.accessibilityLabel')} testID={testIds.screen}>
        <ProgressBar value={progressPercent} testID={testIds.progressBar} />
        <StyledWizardPane>
          <StyledStepHeader>
            <Text variant="h2">{stepLabel}</Text>
          </StyledStepHeader>
          <StyledStepContent testID={testIds.stepContent}>
            {renderStepContent()}
          </StyledStepContent>
          {hasMissingTests && currentStep === STEPS.REVIEW && (
            <StyledMissingTests testID={testIds.missingTests}>
              <Text variant="label" color="status.warning.text">{t('ventilation.assessment.missingTests.title')}</Text>
              <Text variant="body" color="status.warning.text">{t('ventilation.assessment.missingTests.abgPanel')}</Text>
            </StyledMissingTests>
          )}
          <StyledActionsRow>
            {currentStep > 0 && (
              <Button variant="outline" onPress={goBack} testID={testIds.backButton}>
                {t('ventilation.assessment.actions.back')}
              </Button>
            )}
            {currentStep < STEPS.REVIEW ? (
              <Button
                variant="primary"
                onPress={goNext}
                disabled={!canProceedFromStep(currentStep)}
                testID={testIds.nextButton}
              >
                {t('common.next')}
              </Button>
            ) : (
              <Button
                variant="primary"
                onPress={generateRecommendation}
                disabled={isGenerating || !canProceedFromStep(currentStep)}
                testID={testIds.generateButton}
              >
                {isGenerating ? t('common.loading') : t('ventilation.assessment.actions.generate')}
              </Button>
            )}
          </StyledActionsRow>
        </StyledWizardPane>
        {renderSummary()}
      </StyledContainer>
    </StyledContentWrap>
  );
};

export default AssessmentScreenIOS;
