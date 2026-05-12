/**
 * Case Detail Route
 * (main)/session/case/[case-id] - 11.S.6 Case detail
 */
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CaseDetailScreen } from '@platform/screens';

export default function CaseDetailRoute() {
  const { 'case-id': caseId } = useLocalSearchParams();
  return <CaseDetailScreen caseId={caseId} />;
}
