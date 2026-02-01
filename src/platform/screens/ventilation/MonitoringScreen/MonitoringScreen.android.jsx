/**
 * MonitoringScreen Component - Android
 * File: MonitoringScreen.android.jsx
 */
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  List,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useMonitoringScreen from './useMonitoringScreen';
import {
  StyledAlertItem,
  StyledContainer,
  StyledOfflineBanner,
  StyledQuickEntryRow,
  StyledSection,
  StyledSectionHeader,
  StyledTrendItem,
} from './MonitoringScreen.android.styles';
import { MONITORING_TEST_IDS } from './types';

const TREND_DIRECTION_KEYS = {
  up: 'directionUp',
  down: 'directionDown',
  flat: 'directionFlat',
  'insufficient-data': 'insufficientData',
  unknown: 'directionUnknown',
};

const MonitoringScreenAndroid = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    addPoint,
    trends,
    alerts,
    pointsForHistory,
    isHydrating,
    errorCode,
    isOffline,
    monitoringPointNames,
  } = useMonitoringScreen();

  const [quickName, setQuickName] = useState('');
  const [quickValue, setQuickValue] = useState('');
  const [quickUnit, setQuickUnit] = useState('');

  const handleBack = () => router.push('/session/recommendation');
  const handleAddPoint = () => {
    addPoint(quickName || (monitoringPointNames[0] ?? 'Vitals'), quickUnit, quickValue);
    setQuickValue('');
  };

  if (isHydrating) {
    return (
      <StyledContainer testID={MONITORING_TEST_IDS.screen}>
        <Text>{t('ventilation.monitoring.states.loading')}</Text>
      </StyledContainer>
    );
  }

  if (errorCode) {
    return (
      <StyledContainer testID={MONITORING_TEST_IDS.screen}>
        <Text variant="body">{t('ventilation.monitoring.states.error')}</Text>
        <Button variant="outline" onPress={handleBack}>
          {t('ventilation.monitoring.actions.backToRecommendation')}
        </Button>
      </StyledContainer>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} accessibilityLabel={t('ventilation.monitoring.accessibilityLabel')}>
      <StyledContainer testID={MONITORING_TEST_IDS.screen}>
        {isOffline && (
          <StyledOfflineBanner testID={MONITORING_TEST_IDS.offlineBanner}>
            <Text variant="caption">{t('ventilation.monitoring.states.offline')}</Text>
          </StyledOfflineBanner>
        )}

        <StyledSection testID={MONITORING_TEST_IDS.quickEntry}>
          <StyledSectionHeader>
            <Text variant="label">{t('ventilation.monitoring.sections.quickEntry')}</Text>
          </StyledSectionHeader>
          <StyledQuickEntryRow>
            <TextField
              label={t('ventilation.monitoring.quickEntry.namePlaceholder')}
              value={quickName}
              onChangeText={setQuickName}
              placeholder={t('ventilation.monitoring.quickEntry.namePlaceholder')}
              accessibilityLabel={t('ventilation.monitoring.quickEntry.namePlaceholder')}
            />
            <TextField
              label={t('ventilation.monitoring.quickEntry.valuePlaceholder')}
              value={quickValue}
              onChangeText={setQuickValue}
              placeholder={t('ventilation.monitoring.quickEntry.valuePlaceholder')}
              accessibilityLabel={t('ventilation.monitoring.quickEntry.valuePlaceholder')}
            />
            <TextField
              label={t('ventilation.monitoring.quickEntry.unitPlaceholder')}
              value={quickUnit}
              onChangeText={setQuickUnit}
              placeholder={t('ventilation.monitoring.quickEntry.unitPlaceholder')}
              accessibilityLabel={t('ventilation.monitoring.quickEntry.unitPlaceholder')}
            />
            <Button
              variant="primary"
              onPress={handleAddPoint}
              testID={MONITORING_TEST_IDS.addPoint}
              accessibilityLabel={t('ventilation.monitoring.quickEntry.addPoint')}
              accessibilityHint={t('ventilation.monitoring.quickEntry.addPointHint')}
            >
              {t('ventilation.monitoring.quickEntry.addPoint')}
            </Button>
          </StyledQuickEntryRow>
        </StyledSection>

        <StyledSection testID={MONITORING_TEST_IDS.trend}>
          <StyledSectionHeader>
            <Text variant="label">{t('ventilation.monitoring.sections.trend')}</Text>
          </StyledSectionHeader>
          {trends.length === 0 ? (
            <Text variant="caption">{t('ventilation.monitoring.states.empty')}</Text>
          ) : (
            trends.map((tr) => (
              <StyledTrendItem key={tr.name}>
                <Text variant="body">
                  {tr.name} ({tr.unit})
                </Text>
                <Text variant="caption">
                  {t(`ventilation.monitoring.trend.${TREND_DIRECTION_KEYS[tr.direction] ?? 'directionUnknown'}`)}
                  {tr.delta != null ? ` Δ${tr.delta}` : ''}
                </Text>
              </StyledTrendItem>
            ))
          )}
        </StyledSection>

        <StyledSection testID={MONITORING_TEST_IDS.alerts}>
          <StyledSectionHeader>
            <Text variant="label">{t('ventilation.monitoring.sections.alerts')}</Text>
          </StyledSectionHeader>
          {alerts.length === 0 ? (
            <Text variant="caption">{t('ventilation.monitoring.alerts.empty')}</Text>
          ) : (
            <List
              data={alerts}
              renderItem={({ item }) => (
                <StyledAlertItem>
                  <Text variant="label">
                    {item.seriesName}: {item.value} {item.unit}
                  </Text>
                  <Text variant="caption">
                    {t(`ventilation.monitoring.alerts.severity${item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}`)}
                  </Text>
                  {item.whyKey && (
                    <Text variant="caption">
                      {t('ventilation.monitoring.alerts.why')}: {t(`ventilation.monitoring.alerts.${item.whyKey}`)}
                    </Text>
                  )}
                  <Text variant="caption">
                    {t('ventilation.monitoring.alerts.suggestedAction')}: {t(`ventilation.monitoring.alerts.${item.suggestedActionKey}`)}
                  </Text>
                </StyledAlertItem>
              )}
              testID={MONITORING_TEST_IDS.alerts}
              accessibilityLabel={t('ventilation.monitoring.sections.alerts')}
            />
          )}
        </StyledSection>

        {pointsForHistory.length > 0 && (
          <StyledSection testID={MONITORING_TEST_IDS.pointsHistory}>
            <StyledSectionHeader>
              <Text variant="label">{t('ventilation.monitoring.sections.trend')}</Text>
            </StyledSectionHeader>
            <List
              data={pointsForHistory}
              renderItem={({ item }) => (
                <StyledTrendItem>
                  <Text variant="body">
                    {item.seriesName} {item.value} {item.unit}
                  </Text>
                  <Text variant="caption">{new Date(item.timestamp).toLocaleString()}</Text>
                </StyledTrendItem>
              )}
              testID={MONITORING_TEST_IDS.pointsHistory}
              accessibilityLabel={t('ventilation.monitoring.sections.trend')}
            />
          </StyledSection>
        )}

        <Button variant="outline" onPress={handleBack}>
          {t('ventilation.monitoring.actions.backToRecommendation')}
        </Button>
      </StyledContainer>
    </ScrollView>
  );
};

export default MonitoringScreenAndroid;
