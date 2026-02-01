/**
 * Case Detail Route (Placeholder)
 * (main)/session/case/[case-id] - Full implementation in 11.S.6
 */
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@platform/components';
import { useI18n } from '@hooks';

export default function CaseDetailRoute() {
  const { t } = useI18n();
  const { 'case-id': caseId } = useLocalSearchParams();
  return <Text>Case {caseId ?? '—'} — placeholder for 11.S.6</Text>;
}
