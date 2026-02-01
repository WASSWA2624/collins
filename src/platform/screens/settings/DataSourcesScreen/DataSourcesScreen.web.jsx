/**
 * DataSourcesScreen Component - Web
 * File: DataSourcesScreen.web.jsx
 */
import React from 'react';
import { Text, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledSection,
  StyledMetaRow,
  StyledSourceItem,
} from './DataSourcesScreen.web.styles';
import useDataSourcesScreen from './useDataSourcesScreen';

const DataSourcesScreenWeb = () => {
  const { t } = useI18n();
  const { testIds, meta, sources, hasSources } = useDataSourcesScreen();

  return (
    <StyledContainer aria-label={t('settings.dataSources.screen.label')} data-testid={testIds.screen}>
      <StyledContent data-testid={testIds.content}>
        <Text as="h1" variant="h1" data-testid={testIds.title}>
          {t('settings.dataSources.title')}
        </Text>
        <Stack spacing="lg">
          <StyledSection data-testid={testIds.meta}>
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
          <StyledSection data-testid={testIds.sourcesList}>
            <Text as="h2" variant="h3">
              {t('settings.dataSources.citations')}
            </Text>
            {hasSources
              ? sources.map((src, idx) => (
                  <StyledSourceItem key={src?.id ?? idx} data-testid={`${testIds.sourceItem}-${idx}`}>
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
        </Stack>
      </StyledContent>
    </StyledContainer>
  );
};

export default DataSourcesScreenWeb;
