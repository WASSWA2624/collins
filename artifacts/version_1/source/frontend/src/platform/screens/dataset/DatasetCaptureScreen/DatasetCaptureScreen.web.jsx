/**
 * DatasetCaptureScreen Component - Web
 */
import React from 'react';
import { Button, Select, Stack, Text, TextArea, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActionBar,
  StyledActionGroup,
  StyledContainer,
  StyledContent,
  StyledFieldGrid,
  StyledFieldShell,
  StyledHeader,
  StyledMissingList,
  StyledNotice,
  StyledProgressFill,
  StyledProgressHeader,
  StyledProgressSection,
  StyledProgressTrack,
  StyledSection,
  StyledSectionHeader,
  StyledStepItem,
  StyledStepList,
  StyledSummaryGrid,
  StyledSummaryItem,
  StyledWideFieldShell,
} from './DatasetCaptureScreen.web.styles';
import useDatasetCaptureScreen from './useDatasetCaptureScreen';

const DatasetCaptureScreenWeb = () => {
  const { t } = useI18n();
  const {
    activeSection,
    activeStepIndex,
    canGoNext,
    canGoPrevious,
    progressPercent,
    sectionProgress,
    stepCount,
    testIds,
    capture,
  } = useDatasetCaptureScreen();

  const getFieldState = (path) => (capture.fieldErrors?.[path] ? 'missing' : 'default');
  const getFieldLabel = (field) => (
    field.required
      ? field.label
      : `${field.label} (${t('ventilation.datasetCapture.fields.optional')})`
  );
  const getHelperText = (field) => {
    if (capture.fieldErrors?.[field.path]) return capture.fieldErrors[field.path];
    const requirement = field.required
      ? t('ventilation.datasetCapture.fields.required')
      : t('ventilation.datasetCapture.fields.optional');
    const guidance = field.helperText || field.placeholder;
    return guidance ? `${requirement}. ${guidance}` : requirement;
  };
  const getStepStatusText = (step) => {
    if (step.invalidFields.length > 0) return 'Validation issue';
    if (step.missingFields.length > 0) return 'Missing required';
    if (step.complete) return 'Complete';
    if (step.enteredTotal > 0) return 'In progress';
    return 'Not started';
  };

  const renderField = (field) => {
    const value = capture.fieldValues[field.path] ?? '';
    const state = getFieldState(field.path);
    const Shell = field.type === 'textarea' ? StyledWideFieldShell : StyledFieldShell;
    const commonProps = {
      label: getFieldLabel(field),
      helperText: getHelperText(field),
      required: Boolean(field.required),
      validationState: state === 'missing' ? 'error' : undefined,
      testID: `${testIds.fieldInput}-${field.path}`,
    };

    return (
      <Shell key={field.path} $state={state}>
        {field.type === 'select' ? (
          <Select
            {...commonProps}
            placeholder={t('common.selectPlaceholder')}
            options={field.options || []}
            value={value || undefined}
            searchable={field.searchable !== false}
            searchPlaceholder={field.searchPlaceholder}
            allowCustomValue={Boolean(field.allowCustomValue)}
            onValueChange={(nextValue) => capture.onFieldChange(field.path, nextValue)}
          />
        ) : field.type === 'textarea' ? (
          <TextArea
            {...commonProps}
            value={value}
            onChangeText={(nextValue) => capture.onFieldChange(field.path, nextValue)}
            debounceMs={0}
            minHeight={96}
            maxLength={1000}
          />
        ) : (
          <TextField
            {...commonProps}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(nextValue) => capture.onFieldChange(field.path, nextValue)}
            type={field.type === 'number' ? 'number' : 'text'}
            inputMode={field.type === 'number' ? 'decimal' : undefined}
            debounceMs={0}
          />
        )}
      </Shell>
    );
  };

  const readinessItems = capture.validationErrorDetails?.length
    ? capture.validationErrorDetails
    : capture.missingFields.map((field) => ({ path: field, label: field, section: '' }));
  const getStatusKey = () => {
    if (capture.draftStatus === 'loading') return 'ventilation.datasetCapture.status.loadingDraft';
    if (capture.submitMessage === 'stepMissing') return 'ventilation.datasetCapture.status.stepInvalid';
    if (capture.submitMessage) return `ventilation.datasetCapture.status.${capture.submitMessage}`;
    if (capture.draftStatus === 'saving') return 'ventilation.datasetCapture.status.savingDraft';
    if (capture.draftStatus === 'saved') return 'ventilation.datasetCapture.status.draftSaved';
    if (capture.draftStatus === 'error') return 'ventilation.datasetCapture.status.draftError';
    return capture.submitDisabled
      ? 'ventilation.datasetCapture.status.needsInput'
      : 'ventilation.datasetCapture.status.ready';
  };
  const statusKey = getStatusKey();

  return (
    <StyledContainer aria-label={t('ventilation.datasetCapture.accessibilityLabel')} data-testid={testIds.screen} testID={testIds.screen}>
      <StyledContent data-testid={testIds.content} testID={testIds.content}>
        <StyledHeader>
          <Text as="h1" variant="h1" data-testid={testIds.title} testID={testIds.title}>
            {t('ventilation.datasetCapture.title')}
          </Text>
          <Text variant="body">{t('ventilation.datasetCapture.subtitle')}</Text>
        </StyledHeader>

        <StyledProgressSection
          aria-label={t('ventilation.datasetCapture.progress.label')}
          data-testid={testIds.progress}
          testID={testIds.progress}
        >
          <StyledProgressHeader>
            <Text variant="label">
              {t('ventilation.datasetCapture.progress.stepCounter', {
                current: activeStepIndex + 1,
                total: stepCount,
              })}
            </Text>
            <Text variant="caption">{activeSection?.title || ''}</Text>
          </StyledProgressHeader>
          <StyledProgressTrack>
            <StyledProgressFill
              $percent={progressPercent}
              data-testid={testIds.progressFill}
              testID={testIds.progressFill}
            />
          </StyledProgressTrack>
          <StyledStepList>
            {sectionProgress.map((step, index) => (
              <StyledStepItem
                key={step.id}
                type="button"
                $active={step.active}
                $complete={step.complete}
                $status={step.status}
                aria-current={step.active ? 'step' : undefined}
                onClick={() => capture.onGoToStep(index)}
                data-testid={`${testIds.stepItem}-${step.id}`}
                testID={`${testIds.stepItem}-${step.id}`}
              >
                <Text variant="caption">
                  {t('ventilation.datasetCapture.progress.stepLabel', { step: step.stepNumber })}
                </Text>
                <Text variant="label">{step.title}</Text>
                <Text variant="caption">
                  {step.requiredTotal > 0
                    ? `${step.requiredComplete}/${step.requiredTotal}`
                    : `${step.enteredTotal}/${step.totalFields}`}
                </Text>
                <Text variant="caption">{getStepStatusText(step)}</Text>
              </StyledStepItem>
            ))}
          </StyledStepList>
        </StyledProgressSection>

        <StyledSummaryGrid data-testid={testIds.summary} testID={testIds.summary}>
          <StyledSummaryItem $tone={capture.facilityId ? 'success' : 'error'}>
            <Text variant="label">{t('ventilation.datasetCapture.summary.facility')}</Text>
            <Text variant="body">
              {capture.facilityId
                ? t('ventilation.datasetCapture.summary.facilityReady')
                : t('ventilation.datasetCapture.summary.facilityMissing')}
            </Text>
          </StyledSummaryItem>
          <StyledSummaryItem $tone={capture.missingFields.length === 0 ? 'success' : 'warning'}>
            <Text variant="label">{t('ventilation.datasetCapture.summary.required')}</Text>
            <Text variant="body">
              {t('ventilation.datasetCapture.summary.requiredProgress', {
                complete: capture.completeness.requiredComplete,
                total: capture.completeness.requiredTotal,
              })}
            </Text>
          </StyledSummaryItem>
          <StyledSummaryItem $tone="primary">
            <Text variant="label">{t('ventilation.datasetCapture.summary.entered')}</Text>
            <Text variant="body">
              {t('ventilation.datasetCapture.summary.enteredProgress', {
                entered: capture.completeness.enteredTotal,
                total: capture.completeness.totalFields,
              })}
            </Text>
          </StyledSummaryItem>
          <StyledSummaryItem $tone={capture.isOffline ? 'warning' : 'success'}>
            <Text variant="label">{t('ventilation.datasetCapture.summary.sync')}</Text>
            <Text variant="body">
              {capture.isOffline
                ? t('ventilation.datasetCapture.summary.offline')
                : t('ventilation.datasetCapture.summary.online')}
            </Text>
          </StyledSummaryItem>
        </StyledSummaryGrid>

        {!capture.captureAllowed ? (
          <StyledNotice data-testid={testIds.roleNotice} testID={testIds.roleNotice}>
            <Text variant="body">{t('ventilation.datasetCapture.notices.roleBlocked')}</Text>
          </StyledNotice>
        ) : null}
        {capture.isOffline ? (
          <StyledNotice data-testid={testIds.offlineNotice} testID={testIds.offlineNotice}>
            <Text variant="body">{t('ventilation.datasetCapture.notices.offline')}</Text>
          </StyledNotice>
        ) : null}
        {capture.navigationIssue ? (
          <StyledNotice>
            <Text variant="body">
              {`Step ${capture.navigationIssue.stepNumber} has missing required fields: ${capture.navigationIssue.title}`}
            </Text>
          </StyledNotice>
        ) : null}

        {activeSection ? (
          <StyledSection
            key={activeSection.id}
            data-testid={`${testIds.section}-${activeSection.id}`}
            testID={`${testIds.section}-${activeSection.id}`}
          >
            <StyledSectionHeader>
              <Text
                as="h2"
                variant="h3"
                data-testid={`${testIds.sectionTitle}-${activeSection.id}`}
                testID={`${testIds.sectionTitle}-${activeSection.id}`}
              >
                {`${activeStepIndex + 1}. ${activeSection.title}`}
              </Text>
              <Text variant="body">{activeSection.description}</Text>
            </StyledSectionHeader>
            <StyledFieldGrid>{activeSection.fields.map(renderField)}</StyledFieldGrid>
          </StyledSection>
        ) : null}

        <StyledSection>
          <Stack spacing="sm">
            <Text as="h2" variant="h3">{t('ventilation.datasetCapture.missing.title')}</Text>
            <StyledNotice data-testid={testIds.missingList} testID={testIds.missingList}>
              {readinessItems.length > 0 ? (
                <StyledMissingList>
                  {readinessItems.map((field) => (
                    <li key={field.path}>
                      <Text variant="caption">
                        {field.section ? `${field.section}: ${field.label} - ${field.message || ''}` : field.label}
                      </Text>
                    </li>
                  ))}
                </StyledMissingList>
              ) : (
                <Text variant="body">{t('ventilation.datasetCapture.missing.none')}</Text>
              )}
            </StyledNotice>
          </Stack>
        </StyledSection>

        <StyledActionBar>
          <Text variant="caption" data-testid={testIds.status} testID={testIds.status}>
            {t(statusKey)}
          </Text>
          <StyledActionGroup>
            <Button
              text={t('ventilation.datasetCapture.actions.reset')}
              variant="outline"
              onPress={capture.onReset}
              disabled={!capture.hasEnteredValues && capture.submitStatus !== 'error'}
              testID={testIds.resetButton}
            />
            <Button
              text={t('ventilation.datasetCapture.actions.previous')}
              variant="outline"
              onPress={capture.onPreviousStep}
              disabled={!canGoPrevious}
              testID={testIds.previousButton}
            />
            {canGoNext ? (
              <Button
                text={t('ventilation.datasetCapture.actions.next')}
                onPress={capture.onNextStep}
                testID={testIds.nextButton}
              />
            ) : (
              <Button
                text={t('ventilation.datasetCapture.actions.submit')}
                onPress={capture.onSubmitForReview}
                disabled={capture.submitDisabled}
                loading={capture.submitStatus === 'loading'}
                testID={testIds.submitButton}
              />
            )}
          </StyledActionGroup>
        </StyledActionBar>
      </StyledContent>
    </StyledContainer>
  );
};

export default DatasetCaptureScreenWeb;
