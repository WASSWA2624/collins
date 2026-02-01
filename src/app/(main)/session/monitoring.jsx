/**
 * Monitoring Route (Placeholder)
 * (main)/session/monitoring - Full implementation in 11.S.4
 */
import React from 'react';
import { Text } from '@platform/components';
import { useI18n } from '@hooks';

export default function MonitoringRoute() {
  const { t } = useI18n();
  return <Text>{t('ventilation.recommendation.actions.startMonitoring')} — placeholder for 11.S.4</Text>;
}
