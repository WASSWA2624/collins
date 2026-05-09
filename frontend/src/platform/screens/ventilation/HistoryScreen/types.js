/**
 * HistoryScreen Types
 * File: types.js
 */

const HISTORY_TEST_IDS = Object.freeze({
  screen: 'history-screen',
  list: 'history-list',
  empty: 'history-empty',
  draftBanner: 'tracking-draft-banner',
  admittedBanner: 'tracking-admitted-banner',
  corruptBanner: 'history-corrupt-banner',
  errorBanner: 'history-error-banner',
  item: 'history-item',
  search: 'tracking-search',
  searchEmpty: 'tracking-search-empty',
  refresh: 'tracking-refresh',
  facility: 'tracking-facility',
  status: 'tracking-status',
  risk: 'tracking-risk',
  missingData: 'tracking-missing-data',
  sync: 'tracking-sync',
  review: 'tracking-review',
  resume: 'history-resume',
  viewDetails: 'history-view-details',
  updateValues: 'tracking-update-values',
  detailPanel: 'tracking-detail-panel',
  detailClose: 'tracking-detail-close',
  detailTimeline: 'tracking-detail-timeline',
  delete: 'history-delete',
  deleteConfirm: 'history-delete-confirm',
  deleteConfirmCancel: 'history-delete-confirm-cancel',
});

const TRACKING_TEST_IDS = HISTORY_TEST_IDS;

export { HISTORY_TEST_IDS, TRACKING_TEST_IDS };
