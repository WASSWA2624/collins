/**
 * DataSourcesScreen Component - Android
 * File: DataSourcesScreen.android.jsx
 */
import React from 'react';
import { Text, Stack } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledContentWrap,
  StyledSection,
  StyledMetaRow,
  StyledSourceItem,
} from './DataSourcesScreen.android.styles';
import useDataSourcesScreen from './useDataSourcesScreen';

const DataSourcesScreenAndroid = () => {
  const { t } = useI18n();
  const { testIds, meta, sources, hasSources } = useDataSourcesScreen();

  return (
    <StyledContainer accessibilityLabel={t('settings.dataSources.screen.label')} testID={testIds.screen}>
      <StyledContentWrap>
        <StyledContent testID={testIds.content}>
          <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
            {t('settings.dataSources.title')}
          </Text>
          <Stack spacing="lg">
            <StyledSection testID={testIds.meta}>
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
            <StyledSection testID={testIds.sourcesList}>
              <Text variant="h3" accessibilityRole="header">
                {t('settings.dataSources.citations')}
              </Text>
              {hasSources
                ? sources.map((src, idx) => (
                    <StyledSourceItem key={src?.id ?? idx} testID={`${testIds.sourceItem}-${idx}`}>
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
      </StyledContentWrap>
    </StyledContainer>
  );
};

export default DataSourcesScreenAndroid;
