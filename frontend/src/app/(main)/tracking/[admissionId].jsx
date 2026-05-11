/**
 * Direct tracking detail route.
 * Opens a single admitted patient's tracking detail by admission id.
 */
import React from 'react';
import { HistoryScreen } from '@platform/screens';

export default function TrackingDetailRoute() {
  return <HistoryScreen detailMode />;
}
