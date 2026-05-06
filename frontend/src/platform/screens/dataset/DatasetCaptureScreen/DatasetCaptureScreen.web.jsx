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
  StyledSection,
  StyledSectionHeader,
  StyledSummaryGrid,
  StyledSummaryItem,
  StyledWideFieldShell,
} from './DatasetCaptureScreen.web.styles';
import useDatasetCaptureScreen from './useDatasetCaptureScreen';

const DatasetCaptureScreenWeb = () => {
  const { t } = useI18n();
  const { testIds, sections, capture } = useDatasetCaptureScreen();

  const getFieldState = (path) => (capture.missingFields.includes(path) ? 'missing' : 'default');
  const getHelperText = (field) => (
    capture.missingFields.includes(field.path)
      ? t('ventilation.datasetCapture.fields.required')
      : field.placeholder || (field.required ? t('ventilation.datasetCapture.fields.required') : t('ventilation.datasetCapture.fields.optional'))
  );

  const renderField = (field) => {
    const value = capture.fieldValues[field.path] ?? '';
    const state = getFieldState(field.path);
    const Shell = field.type === 'textarea' ? StyledWideFieldShell : StyledFieldShell;
    const commonProps = {
      label: field.label,
      helperText: getHelperText(field),
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
            onValueChange={(nextValue) => capture.onFieldChange(field.path, nextValue)}
          />
        ) : field.type === 'textarea' ? (
          <TextArea
            {...commonProps}
            value={value}
            onChangeText={(nextValue) => capture.onFieldChange(field.path, nextValue)}
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
          />
        )}
      </Shell>
    );
  };

  const statusKey = capture.submitMessage
    ? `ventilation.datasetCapture.status.${capture.submitMessage}`
    : 'ventilation.datasetCapture.status.ready';

  return (
    <StyledContainer aria-label={t('ventilation.datasetCapture.accessibilityLabel')} data-testid={testIds.screen} testID={testIds.screen}>
      <StyledContent data-testid={testIds.content} testID={testIds.content}>
        <StyledHeader>
          <Text as="h1" variant="h1" data-testid={testIds.title} testID={testIds.title}>
            {t('ventilation.datasetCapture.title')}
          </Text>
          <Text variant="body">{t('ventilation.datasetCapture.subtitle')}</Text>
        </StyledHeader>

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

        {sections.map((section, sectionIndex) => (
          <StyledSection
            key={section.id}
            data-testid={`${testIds.section}-${section.id}`}
            testID={`${testIds.section}-${section.id}`}
          >
            <StyledSectionHeader>
              <Text
                as="h2"
                variant="h3"
                data-testid={`${testIds.sectionTitle}-${section.id}`}
                testID={`${testIds.sectionTitle}-${section.id}`}
              >
                {`${sectionIndex + 1}. ${section.title}`}
              </Text>
              <Text variant="body">{section.description}</Text>
            </StyledSectionHeader>
            <StyledFieldGrid>{section.fields.map(renderField)}</StyledFieldGrid>
          </StyledSection>
        ))}

        <StyledSection>
          <Stack spacing="sm">
            <Text as="h2" variant="h3">{t('ventilation.datasetCapture.missing.title')}</Text>
            <StyledNotice data-testid={testIds.missingList} testID={testIds.missingList}>
              {capture.missingFields.length > 0 ? (
                <StyledMissingList>
                  {capture.missingFields.map((field) => (
                    <li key={field}>
                      <Text variant="caption">{field}</Text>
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
              text={t('ventilation.datasetCapture.actions.submit')}
              onPress={capture.onSubmitForReview}
              disabled={capture.submitDisabled}
              loading={capture.submitStatus === 'loading'}
              testID={testIds.submitButton}
            />
          </StyledActionGroup>
        </StyledActionBar>
      </StyledContent>
    </StyledContainer>
  );
};

export default DatasetCaptureScreenWeb;
