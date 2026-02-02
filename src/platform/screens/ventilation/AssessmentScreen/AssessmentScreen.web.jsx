/**
 * AssessmentScreen Component - Web
 * File: AssessmentScreen.web.jsx
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  ProgressBar,
  Radio,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { actions as uiActions } from '@store/slices/ui.slice';
import useAssessmentScreen from './useAssessmentScreen';
import {
  StyledActionsRow,
  StyledContainer,
  StyledExpandButton,
  StyledFieldGroup,
  StyledFieldGrid,
  StyledFieldGridFull,
  StyledFieldWithHint,
  StyledMissingTests,
  StyledMissingTestsHint,
  StyledMissingTestsTitle,
  StyledModelRow,
  StyledObservationRow,
  StyledProgressSection,
  StyledRecommendationSource,
  StyledRecommendationSourceTitle,
  StyledSourceOption,
  StyledSourceOptionContent,
  StyledSourceOptionDesc,
  StyledSourceOptionsList,
  StyledSourceOptionLabel,
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
import { CONDITION_OPTIONS, GENDER_OPTIONS, STEPS } from './types';

const conditionOptions = (t) => CONDITION_OPTIONS.map((o) => ({ value: o.value, label: t(`ventilation.assessment.conditions.${o.labelKey}`) }));
const genderOptions = (t) => GENDER_OPTIONS.map((o) => ({ value: o.value, label: t(`ventilation.assessment.patientProfile.${o.labelKey}`) }));

const parseNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

const AssessmentScreenWeb = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
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
    normalRanges,
    canProceedFromStep,
    goNext,
    goBack,
    goBackOrExit,
    generateRecommendation,
    isGenerating,
    isHydrating,
    testIds,
    stepKey,
    addObservation,
    updateObservation,
    removeObservation,
    recommendationSource,
    setRecommendationSource,
    aiModelId,
    modelOptions,
  } = useAssessmentScreen();

  const stepLabel = t(`ventilation.assessment.steps.${stepKey}`);
  const stepIndicator = `Step ${currentStep + 1} of 5`;
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
      <StyledSummaryWrap>
        <StyledSummaryPane aria-label={t('ventilation.assessment.summary.accessibilityLabel')} data-testid={testIds.summary}>
          <StyledSummaryHeader>
          <StyledSummaryTitle>
            <Text variant="label">{t('ventilation.assessment.summary.title')}</Text>
          </StyledSummaryTitle>
          <StyledExpandButton
            type="button"
            onClick={() => setSummaryExpanded((e) => !e)}
            aria-expanded={summaryExpanded}
            data-testid={testIds.summaryExpand}
            aria-label={summaryExpanded ? t('ventilation.assessment.summary.collapse') : t('ventilation.assessment.summary.expand')}
          >
            {summaryExpanded ? '−' : '+'}
          </StyledExpandButton>
        </StyledSummaryHeader>
        {(summaryExpanded || !isEmpty) && (
          <StyledSummaryBody>
            {isEmpty ? (
              <Text variant="body" color="text.tertiary">{t('ventilation.assessment.summary.empty')}</Text>
            ) : (
              filled.map(({ key, label, value, unit }) => (
                <StyledSummaryRow key={key}>
                  <StyledSummaryLabel>{label}</StyledSummaryLabel>
                  <StyledSummaryValue>{value}{unit ? ` ${unit}` : ''}</StyledSummaryValue>
                </StyledSummaryRow>
              ))
            )}
          </StyledSummaryBody>
        )}
        </StyledSummaryPane>
      </StyledSummaryWrap>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.PATIENT_PROFILE:
        return (
          <StyledFieldGrid>
            <StyledFieldGridFull>
              <Select
                label={t('ventilation.assessment.patientProfile.condition')}
                placeholder={t('ventilation.assessment.patientProfile.conditionPlaceholder')}
                options={conditionOptions(t)}
                value={mergedInputs.condition}
                onValueChange={(v) => updateInput({ condition: v })}
                required
                accessibilityHint={t('ventilation.assessment.patientProfile.conditionHint')}
                testID="assessment-condition"
              />
            </StyledFieldGridFull>
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
            <StyledFieldGridFull>
              <TextField
                label={t('ventilation.assessment.patientProfile.comorbidities')}
                placeholder={t('ventilation.assessment.patientProfile.comorbiditiesPlaceholder')}
                value={mergedInputs.comorbiditiesText}
                onChangeText={(v) => updateInput({ comorbiditiesText: v, comorbidities: parseComorbidities(v) })}
                accessibilityHint={t('ventilation.assessment.patientProfile.comorbiditiesHint')}
                testID="assessment-comorbidities"
              />
            </StyledFieldGridFull>
          </StyledFieldGrid>
        );
      case STEPS.CLINICAL_PARAMS:
        return (
          <StyledFieldGrid>
            <StyledFieldWithHint>
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
              <Text variant="caption" color="text.tertiary">{t('ventilation.assessment.clinicalParams.normalRangeTemplate', { range: normalRanges.spo2 })}</Text>
            </StyledFieldWithHint>
            <StyledFieldWithHint>
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
              <Text variant="caption" color="text.tertiary">{t('ventilation.assessment.clinicalParams.normalRangeTemplate', { range: normalRanges.respiratoryRate })}</Text>
            </StyledFieldWithHint>
            <StyledFieldWithHint>
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
              <Text variant="caption" color="text.tertiary">{t('ventilation.assessment.clinicalParams.heartRateNormalRange')}</Text>
            </StyledFieldWithHint>
            <StyledFieldWithHint>
              <TextField
                label={`${t('ventilation.assessment.clinicalParams.pao2')} (${units?.pao2 ?? 'mmHg'})`}
                placeholder={t('ventilation.assessment.clinicalParams.pao2Placeholder')}
                type="number"
                value={mergedInputs.pao2 != null ? String(mergedInputs.pao2) : ''}
                onChangeText={(v) => updateInput({ pao2: parseNum(v) })}
                accessibilityHint={t('ventilation.assessment.clinicalParams.pao2Hint')}
                testID="assessment-pao2"
              />
              <Text variant="caption" color="text.tertiary">{t('ventilation.assessment.clinicalParams.normalRangeTemplate', { range: normalRanges.pao2 })}</Text>
            </StyledFieldWithHint>
            <StyledFieldWithHint>
              <TextField
                label={`${t('ventilation.assessment.clinicalParams.paco2')} (${units?.paco2 ?? 'mmHg'})`}
                placeholder={t('ventilation.assessment.clinicalParams.paco2Placeholder')}
                type="number"
                value={mergedInputs.paco2 != null ? String(mergedInputs.paco2) : ''}
                onChangeText={(v) => updateInput({ paco2: parseNum(v) })}
                accessibilityHint={t('ventilation.assessment.clinicalParams.paco2Hint')}
                testID="assessment-paco2"
              />
              <Text variant="caption" color="text.tertiary">{t('ventilation.assessment.clinicalParams.normalRangeTemplate', { range: normalRanges.paco2 })}</Text>
            </StyledFieldWithHint>
            <StyledFieldWithHint>
              <TextField
                label={`${t('ventilation.assessment.clinicalParams.ph')} (${units?.ph ?? 'unitless'})`}
                placeholder={t('ventilation.assessment.clinicalParams.phPlaceholder')}
                type="number"
                value={mergedInputs.ph != null ? String(mergedInputs.ph) : ''}
                onChangeText={(v) => updateInput({ ph: parseNum(v) })}
                accessibilityHint={t('ventilation.assessment.clinicalParams.phHint')}
                testID="assessment-ph"
              />
              <Text variant="caption" color="text.tertiary">{t('ventilation.assessment.clinicalParams.phNormalRange')}</Text>
            </StyledFieldWithHint>
            <StyledFieldGridFull>
              <StyledFieldWithHint>
                <TextField
                  label={t('ventilation.assessment.clinicalParams.bloodPressure')}
                  placeholder={t('ventilation.assessment.clinicalParams.bloodPressurePlaceholder')}
                  value={mergedInputs.bloodPressure}
                  onChangeText={(v) => updateInput({ bloodPressure: v })}
                  accessibilityHint={t('ventilation.assessment.clinicalParams.bloodPressureHint')}
                  testID="assessment-bp"
                />
                <Text variant="caption" color="text.tertiary">{t('ventilation.assessment.clinicalParams.normalRangeTemplate', { range: normalRanges.bloodPressure })}</Text>
              </StyledFieldWithHint>
            </StyledFieldGridFull>
          </StyledFieldGrid>
        );
      case STEPS.OBSERVATIONS:
        return (
          <StyledFieldGroup>
            <Text variant="body">{t('ventilation.assessment.observations.title')} ({t('ventilation.assessment.observations.optional')})</Text>
            <StyledStepDescription>{t('ventilation.assessment.observations.description')}</StyledStepDescription>
            {(mergedInputs.observations || []).map((obs, i) => (
              <StyledObservationRow key={i}>
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
                <TextField
                  label={t('ventilation.assessment.observations.unit')}
                  value={obs.unit ?? ''}
                  onChangeText={(v) => updateObservation(i, { unit: v })}
                  testID={`assessment-obs-unit-${i}`}
                />
                <Button variant="ghost" onPress={() => removeObservation(i)} testID={`assessment-obs-remove-${i}`}>
                  {t('common.remove')}
                </Button>
              </StyledObservationRow>
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
            <StyledStepDescription>{t('ventilation.assessment.timeSeries.description')}</StyledStepDescription>
          </StyledFieldGroup>
        );
      case STEPS.REVIEW:
        return (
          <StyledFieldGroup>
            <Text variant="body">{t('ventilation.assessment.summary.title')}</Text>
            <StyledRecommendationSource role="region" aria-label={t('ventilation.assessment.recommendationSource.label')}>
              <StyledRecommendationSourceTitle>{t('ventilation.assessment.recommendationSource.label')}</StyledRecommendationSourceTitle>
              <StyledSourceOptionsList>
                <StyledSourceOption
                  onClick={() => setRecommendationSource('local')}
                  data-selected={recommendationSource === 'local'}
                >
                  <Radio
                    selected={recommendationSource === 'local'}
                    onChange={() => setRecommendationSource('local')}
                    value="local"
                    label={t('ventilation.assessment.recommendationSource.local')}
                    testID="assessment-source-local"
                  />
                  <StyledSourceOptionContent>
                    <StyledSourceOptionLabel>{t('ventilation.assessment.recommendationSource.local')}</StyledSourceOptionLabel>
                    <StyledSourceOptionDesc>{t('ventilation.assessment.recommendationSource.localDescription')}</StyledSourceOptionDesc>
                  </StyledSourceOptionContent>
                </StyledSourceOption>
                <StyledSourceOption
                  onClick={() => setRecommendationSource('online_ai')}
                  data-selected={recommendationSource === 'online_ai'}
                >
                  <Radio
                    selected={recommendationSource === 'online_ai'}
                    onChange={() => setRecommendationSource('online_ai')}
                    value="online_ai"
                    label={t('ventilation.assessment.recommendationSource.onlineAi')}
                    testID="assessment-source-online-ai"
                  />
                  <StyledSourceOptionContent>
                    <StyledSourceOptionLabel>{t('ventilation.assessment.recommendationSource.onlineAi')}</StyledSourceOptionLabel>
                    <StyledSourceOptionDesc>{t('ventilation.assessment.recommendationSource.onlineAiDescription')}</StyledSourceOptionDesc>
                  </StyledSourceOptionContent>
                </StyledSourceOption>
              </StyledSourceOptionsList>
              {recommendationSource === 'online_ai' && (
                <StyledModelRow>
                  <Select
                    label={t('ventilation.assessment.recommendationSource.modelLabel')}
                    options={modelOptions}
                    value={modelOptions.find((o) => o.value === aiModelId)?.value ?? modelOptions[0]?.value}
                    onValueChange={(v) => dispatch(uiActions.setAiModelId(v))}
                    accessibilityHint={t('ventilation.assessment.recommendationSource.modelHint')}
                    testID="assessment-model-select"
                  />
                </StyledModelRow>
              )}
            </StyledRecommendationSource>
          </StyledFieldGroup>
        );
      default:
        return null;
    }
  };

  const parseComorbidities = (val) => {
    if (typeof val !== 'string' || !val.trim()) return [];
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  };

  if (isHydrating) {
    return (
      <StyledContainer aria-label={t('ventilation.assessment.accessibilityLabel')} data-testid={testIds.screen}>
        <Text>{t('ventilation.assessment.states.loading')}</Text>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer aria-label={t('ventilation.assessment.accessibilityLabel')} data-testid={testIds.screen} role="main">
      <StyledProgressSection>
        <ProgressBar value={progressPercent} testID={testIds.progressBar} aria-label={t('common.progress', { value: Math.round(progressPercent) })} />
      </StyledProgressSection>
      <StyledWizardPane>
        <StyledWizardCard>
          <StyledStepHeader>
            <StyledStepTitle>{stepLabel}</StyledStepTitle>
            <StyledStepIndicator>{stepIndicator}</StyledStepIndicator>
          </StyledStepHeader>
          <StyledStepContent data-testid={testIds.stepContent}>
            {renderStepContent()}
          </StyledStepContent>
          {hasMissingTests && currentStep === STEPS.REVIEW && (
            <StyledMissingTests data-testid={testIds.missingTests} role="region" aria-label={t('ventilation.assessment.missingTests.title')}>
              <StyledMissingTestsTitle>{t('ventilation.assessment.missingTests.title')}</StyledMissingTestsTitle>
              <StyledMissingTestsHint>{t('ventilation.assessment.missingTests.abgPanel')}</StyledMissingTestsHint>
              <StyledMissingTestsHint>{t('ventilation.assessment.missingTests.abgHint')}</StyledMissingTestsHint>
            </StyledMissingTests>
          )}
        </StyledWizardCard>
        <StyledActionsRow>
          <Button variant="outline" onPress={goBackOrExit} testID={testIds.backButton} accessibilityLabel={t('ventilation.assessment.actions.back')}>
            {t('ventilation.assessment.actions.back')}
          </Button>
          {currentStep < STEPS.REVIEW ? (
            <Button
              variant="primary"
              onPress={goNext}
              disabled={!canProceedFromStep(currentStep)}
              testID={testIds.nextButton}
              accessibilityLabel={t('ventilation.assessment.actions.next')}
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={generateRecommendation}
              disabled={isGenerating || !canProceedFromStep(currentStep)}
              testID={testIds.generateButton}
              accessibilityLabel={t('ventilation.assessment.actions.generateHint')}
            >
              {isGenerating ? t('common.loading') : t('ventilation.assessment.actions.generate')}
            </Button>
          )}
        </StyledActionsRow>
      </StyledWizardPane>
      {renderSummary()}
    </StyledContainer>
  );
};

export default AssessmentScreenWeb;
