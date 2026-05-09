/**
 * HomeScreen types/constants
 * File: types.js
 */
const HOME_TEST_IDS = {
  screen: 'home-screen',
  title: 'home-title',
  message: 'home-message',
  actions: 'home-actions',
  status: 'home-status',
  notices: 'home-notices',
  facilities: 'home-facilities',
  error: 'home-error',
};

const HOME_ACTION_IDS = {
  ADMIT: 'admit',
  TRACKING: 'tracking',
  ABG_VENT_UPDATE: 'abgVentUpdate',
  DATASET_CAPTURE: 'datasetCapture',
  REVIEW_QUEUE: 'reviewQueue',
  DASHBOARD: 'dashboard',
  USER_MANAGEMENT: 'userManagement',
  SETTINGS: 'settings',
};

const HOME_STATUS_IDS = {
  FACILITY: 'facility',
  NETWORK: 'network',
  ACTIVE_ADMISSIONS: 'activeAdmissions',
  DRAFTS: 'drafts',
  SYNC_ATTENTION: 'syncAttention',
  REVIEW_NEEDS: 'reviewNeeds',
};

export { HOME_ACTION_IDS, HOME_STATUS_IDS, HOME_TEST_IDS };
