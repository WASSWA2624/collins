/**
 * MonitoringScreen Component - Web
 * File: MonitoringScreen.web.jsx
 */
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Button,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useMonitoringScreen from './useMonitoringScreen';
import {
  StyledAlertItem,
  StyledAlertsList,
  StyledContainer,
  StyledDecisionSupportBanner,
  StyledHistoryList,
  StyledOfflineBanner,
  StyledQuickEntryRow,
  StyledSection,
  StyledSectionHeader,
  StyledTrendItem,
} from './MonitoringScreen.web.styles';
import { MONITORING_TEST_IDS } from './types';

const TREND_DIRECTION_KEYS = {
  up: 'directionUp',
  down: 'directionDown',
  flat: 'directionFlat',
  'insufficient-data': 'insufficientData',
  unknown: 'directionUnknown',
};

const MonitoringScreenWeb = () => {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleAddPoint();
    }
  };

  if (isHydrating) {
    return (
      <StyledContainer aria-label={t('ventilation.monitoring.accessibilityLabel')} data-testid={MONITORING_TEST_IDS.screen}>
        <Text>{t('ventilation.monitoring.states.loading')}</Text>
      </StyledContainer>
    );
  }

  if (errorCode) {
    return (
      <StyledContainer aria-label={t('ventilation.monitoring.accessibilityLabel')} data-testid={MONITORING_TEST_IDS.screen}>
        <Text variant="body">{t('ventilation.monitoring.states.error')}</Text>
        <Button variant="outline" onPress={handleBack}>
          {t('ventilation.monitoring.actions.backToRecommendation')}
        </Button>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer aria-label={t('ventilation.monitoring.accessibilityLabel')} data-testid={MONITORING_TEST_IDS.screen}>
      <StyledDecisionSupportBanner data-testid={MONITORING_TEST_IDS.decisionSupportBanner} role="status" aria-live="polite">
        <Text variant="caption" color="status.warning.text">{t('ventilation.monitoring.decisionSupportOnly')}</Text>
      </StyledDecisionSupportBanner>
      {isOffline && (
        <StyledOfflineBanner data-testid={MONITORING_TEST_IDS.offlineBanner} role="status">
          <Text variant="caption" color="status.warning.text">{t('ventilation.monitoring.states.offline')}</Text>
        </StyledOfflineBanner>
      )}

      <StyledSection data-testid={MONITORING_TEST_IDS.quickEntry}>
        <StyledSectionHeader>
          <Text variant="label">{t('ventilation.monitoring.sections.quickEntry')}</Text>
        </StyledSectionHeader>
        <StyledQuickEntryRow onKeyDown={handleKeyDown} role="form" data-testid="monitoring-quick-entry-form">
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

      <StyledSection data-testid={MONITORING_TEST_IDS.trend}>
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

      <StyledSection data-testid={MONITORING_TEST_IDS.alerts}>
        <StyledSectionHeader>
          <Text variant="label">{t('ventilation.monitoring.sections.alerts')}</Text>
        </StyledSectionHeader>
        {alerts.length === 0 ? (
          <Text variant="caption">{t('ventilation.monitoring.alerts.empty')}</Text>
        ) : (
          <StyledAlertsList role="list" aria-label={t('ventilation.monitoring.sections.alerts')}>
            {alerts.map((item) => (
              <li key={item.id}>
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
              </li>
            ))}
          </StyledAlertsList>
        )}
      </StyledSection>

      {pointsForHistory.length > 0 && (
        <StyledSection data-testid={MONITORING_TEST_IDS.pointsHistory}>
          <StyledSectionHeader>
            <Text variant="label">{t('ventilation.monitoring.sections.trend')}</Text>
          </StyledSectionHeader>
          <StyledHistoryList role="list" aria-label={t('ventilation.monitoring.sections.trend')}>
            {pointsForHistory.map((item) => (
              <li key={item.id}>
                <StyledTrendItem>
                  <Text variant="body">
                    {item.seriesName} {item.value} {item.unit}
                  </Text>
                  <Text variant="caption">{new Date(item.timestamp).toLocaleString()}</Text>
                </StyledTrendItem>
              </li>
            ))}
          </StyledHistoryList>
        </StyledSection>
      )}

      <Button variant="outline" onPress={handleBack}>
        {t('ventilation.monitoring.actions.backToRecommendation')}
      </Button>
    </StyledContainer>
  );
};

export default MonitoringScreenWeb;
