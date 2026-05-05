/**
 * DataSourcesScreen Component - Web
 * File: DataSourcesScreen.web.jsx
 */
import React from 'react';
import { Button, Text, TextArea, TextField, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActionRow,
  StyledCaptureGrid,
  StyledContainer,
  StyledContent,
  StyledFieldShell,
  StyledInlineNotice,
  StyledList,
  StyledSection,
  StyledMetaRow,
  StyledSourceItem,
} from './DataSourcesScreen.web.styles';
import useDataSourcesScreen from './useDataSourcesScreen';

const DataSourcesScreenWeb = () => {
  const { t } = useI18n();
  const { testIds, meta, sources, hasSources, capture } = useDataSourcesScreen();
  const getFieldState = (path) => {
    if (capture.missingFields.includes(path)) return 'missing';
    if (capture.uncertaintyFields.includes(path)) return 'uncertain';
    return 'default';
  };

  return (
    <StyledContainer aria-label={t('settings.dataSources.screen.label')} data-testid={testIds.screen} testID={testIds.screen}>
      <StyledContent data-testid={testIds.content} testID={testIds.content}>
        <Text as="h1" variant="h1" data-testid={testIds.title} testID={testIds.title}>
          {t('settings.dataSources.title')}
        </Text>
        <Stack spacing="lg">
          <StyledSection data-testid={testIds.meta} testID={testIds.meta}>
            <StyledMetaRow>
              <Stack direction="horizontal" spacing="xs">
                <Text variant="label">{t('settings.dataSources.datasetVersion')}: </Text>
                <Text variant="body">{meta?.version ?? '—'}</Text>
              </Stack>
            </StyledMetaRow>
            <StyledMetaRow>
              <Stack direction="horizontal" spacing="xs">
                <Text variant="label">{t('settings.dataSources.schemaVersion')}: </Text>
                <Text variant="body">{meta?.schemaVersion ?? '—'}</Text>
              </Stack>
            </StyledMetaRow>
            <StyledMetaRow>
              <Stack direction="horizontal" spacing="xs">
                <Text variant="label">{t('settings.dataSources.lastUpdated')}: </Text>
                <Text variant="body">{meta?.lastUpdated ?? '—'}</Text>
              </Stack>
            </StyledMetaRow>
            <StyledMetaRow>
              <Stack direction="horizontal" spacing="xs">
                <Text variant="label">{t('settings.dataSources.totalCases')}: </Text>
                <Text variant="body">{meta?.totalCases ?? '—'}</Text>
              </Stack>
            </StyledMetaRow>
          </StyledSection>
          <StyledSection data-testid={testIds.sourcesList} testID={testIds.sourcesList}>
            <Text as="h2" variant="h3">
              {t('settings.dataSources.citations')}
            </Text>
            {hasSources
              ? sources.map((src, idx) => (
                  <StyledSourceItem key={src?.id ?? idx} data-testid={`${testIds.sourceItem}-${idx}`} testID={`${testIds.sourceItem}-${idx}`}>
                    <Text variant="body">{src?.citation ?? ''}</Text>
                    {src?.doi ? (
                      <Text variant="caption">
                        {t('settings.dataSources.doi')}: {src.doi}
                      </Text>
                    ) : null}
                  </StyledSourceItem>
                ))
              : (
                  <Text variant="body">{t('settings.dataSources.states.empty')}</Text>
                )}
          </StyledSection>
          <StyledSection data-testid={testIds.captureSection} testID={testIds.captureSection}>
            <Stack spacing="md">
              <Text as="h2" variant="h3">
                {t('settings.dataSources.capture.title')}
              </Text>
              <StyledInlineNotice>
                <Text variant="body">{t('settings.dataSources.capture.governanceNotice')}</Text>
              </StyledInlineNotice>
              {!capture.captureAllowed ? (
                <StyledInlineNotice>
                  <Text variant="body">{t('settings.dataSources.capture.roleBlocked')}</Text>
                </StyledInlineNotice>
              ) : null}
              {capture.isOffline ? (
                <StyledInlineNotice>
                  <Text variant="body">{t('settings.dataSources.capture.offlineNotice')}</Text>
                </StyledInlineNotice>
              ) : null}
              <TextArea
                label={t('settings.dataSources.capture.noteLabel')}
                placeholder={t('settings.dataSources.capture.notePlaceholder')}
                value={capture.noteText}
                onChangeText={capture.onNoteTextChange}
                minHeight={140}
                maxLength={10000}
                showCharacterCounter
                testID={testIds.noteInput}
              />
              <StyledActionRow>
                <Button
                  text={t('settings.dataSources.capture.parse')}
                  onPress={capture.onParseNote}
                  disabled={!capture.captureAllowed}
                  testID={testIds.parseButton}
                />
                <Text variant="caption">
                  {capture.facilityId
                    ? t('settings.dataSources.capture.facilityReady')
                    : t('settings.dataSources.capture.facilityMissing')}
                </Text>
              </StyledActionRow>
              {capture.parseStatus === 'empty' ? (
                <Text variant="caption">{t('settings.dataSources.capture.noteRequired')}</Text>
              ) : null}
              {capture.hasIdentifierWarnings ? (
                <StyledInlineNotice data-testid={testIds.identifierWarning} testID={testIds.identifierWarning}>
                  <Text variant="body">{t('settings.dataSources.capture.identifierWarning')}</Text>
                </StyledInlineNotice>
              ) : null}
              {capture.previewCreated ? (
                <StyledSection data-testid={testIds.preview} testID={testIds.preview}>
                  <Stack spacing="md">
                    <Text as="h3" variant="h3">
                      {t('settings.dataSources.capture.previewTitle')}
                    </Text>
                    <StyledCaptureGrid>
                      {capture.fields.map((field) => (
                        <StyledFieldShell key={field.path} $state={getFieldState(field.path)}>
                          <TextField
                            label={field.label}
                            value={capture.fieldValues[field.path] ?? ''}
                            onChangeText={(value) => capture.onFieldChange(field.path, value)}
                            type={field.type === 'number' ? 'number' : 'text'}
                            helperText={field.section}
                            testID={`${testIds.fieldInput}-${field.path}`}
                          />
                        </StyledFieldShell>
                      ))}
                    </StyledCaptureGrid>
                    <StyledInlineNotice data-testid={testIds.missingList} testID={testIds.missingList}>
                      <Text variant="label">{t('settings.dataSources.capture.missingFields')}</Text>
                      <StyledList>
                        {capture.missingFields.length > 0
                          ? capture.missingFields.map((field) => (
                              <li key={field}>
                                <Text variant="caption">{field}</Text>
                              </li>
                            ))
                          : (
                              <li>
                                <Text variant="caption">{t('settings.dataSources.capture.none')}</Text>
                              </li>
                            )}
                      </StyledList>
                    </StyledInlineNotice>
                    <StyledInlineNotice data-testid={testIds.uncertaintyList} testID={testIds.uncertaintyList}>
                      <Text variant="label">{t('settings.dataSources.capture.uncertainFields')}</Text>
                      <StyledList>
                        {capture.uncertaintyFields.length > 0
                          ? capture.uncertaintyFields.map((field) => (
                              <li key={field}>
                                <Text variant="caption">{field}</Text>
                              </li>
                            ))
                          : (
                              <li>
                                <Text variant="caption">{t('settings.dataSources.capture.none')}</Text>
                              </li>
                            )}
                      </StyledList>
                    </StyledInlineNotice>
                    <StyledActionRow>
                      <Button
                        text={t('settings.dataSources.capture.submitForReview')}
                        onPress={capture.onSubmitForReview}
                        disabled={capture.submitDisabled}
                        loading={capture.submitStatus === 'loading'}
                        testID={testIds.submitButton}
                      />
                      <Text variant="caption" data-testid={testIds.status} testID={testIds.status}>
                        {capture.submitMessage
                          ? t(`settings.dataSources.capture.status.${capture.submitMessage}`)
                          : t('settings.dataSources.capture.status.ready')}
                      </Text>
                    </StyledActionRow>
                  </Stack>
                </StyledSection>
              ) : null}
              {capture.trainingApprovalAllowed ? (
                <StyledInlineNotice data-testid={testIds.approvalControls} testID={testIds.approvalControls}>
                  <Text variant="body">{t('settings.dataSources.capture.trainingApprovalAvailable')}</Text>
                </StyledInlineNotice>
              ) : null}
            </Stack>
          </StyledSection>
        </Stack>
      </StyledContent>
    </StyledContainer>
  );
};

export default DataSourcesScreenWeb;
