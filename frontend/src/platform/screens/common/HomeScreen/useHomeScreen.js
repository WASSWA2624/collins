/**
 * useHomeScreen
 * Shared Home workflow logic.
 * File: useHomeScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import useAsyncState from '@hooks/useAsyncState';
import useNetwork from '@hooks/useNetwork';
import { loadHomeSummaryUseCase } from '@features/home';
import { HOME_ACTION_IDS, HOME_STATUS_IDS, HOME_TEST_IDS } from './types';

const ROUTES = Object.freeze({
  [HOME_ACTION_IDS.NEW_PATIENT]: '/new-patient',
  [HOME_ACTION_IDS.TRACKING]: '/tracking',
  [HOME_ACTION_IDS.CURRENT_READINGS]: '/current-readings',
  [HOME_ACTION_IDS.DATASET_CAPTURE]: '/dataset-capture',
  [HOME_ACTION_IDS.REVIEW_QUEUE]: '/review-queue',
  [HOME_ACTION_IDS.DASHBOARD]: '/dashboard',
  [HOME_ACTION_IDS.USER_MANAGEMENT]: '/user-management',
  [HOME_ACTION_IDS.SETTINGS]: '/settings',
});

const WORKFLOW_PENDING_IDS = new Set();

const numberOrZero = (value) => (Number.isFinite(value) ? value : 0);
const countOrNull = (value) => (Number.isFinite(value) ? value : null);

const getCounts = (summary) => summary?.counts ?? null;
const getNavigation = (summary) => summary?.navigation ?? {};

const buildDisabledReason = ({ canUse, path, navigationStatus }) => {
  if (!canUse) {
    return navigationStatus === 'needs_facility_selection'
      ? 'facilityRequired'
      : 'roleRestricted';
  }
  if (!path) return 'workflowPending';
  return null;
};

const makeAction = ({ id, path, visible = true, canUse = true, count = null, emphasis = 'normal', navigationStatus }) => {
  const enabled = Boolean(visible && canUse && path);
  return {
    id,
    path,
    visible: Boolean(visible),
    enabled,
    count,
    emphasis,
    disabledReason: enabled
      ? null
      : buildDisabledReason({ canUse, path, navigationStatus }),
    routePending: WORKFLOW_PENDING_IDS.has(id),
  };
};

const buildHomeActions = (summary) => {
  const navigation = getNavigation(summary);
  const counts = getCounts(summary);
  const canOpenAdmissions = navigation.canOpenAdmissions === true;
  const canCreateAdmission = navigation.canCreateAdmission === true;
  const canOpenReviewQueue = navigation.canOpenReviewQueue === true;
  const canOpenDashboard = canOpenAdmissions || navigation.canManageFacility === true || canOpenReviewQueue;
  const canUseDatasetCapture = canCreateAdmission || canOpenReviewQueue;
  const navigationStatus = navigation.status || 'needs_facility_selection';

  return [
    makeAction({
      id: HOME_ACTION_IDS.NEW_PATIENT,
      path: ROUTES[HOME_ACTION_IDS.NEW_PATIENT],
      canUse: canCreateAdmission,
      emphasis: 'primary',
      navigationStatus,
    }),
    makeAction({
      id: HOME_ACTION_IDS.TRACKING,
      path: ROUTES[HOME_ACTION_IDS.TRACKING],
      canUse: canOpenAdmissions,
      count: countOrNull(counts?.patientActivity?.activeAdmissions),
      navigationStatus,
    }),
    makeAction({
      id: HOME_ACTION_IDS.CURRENT_READINGS,
      path: ROUTES[HOME_ACTION_IDS.CURRENT_READINGS],
      canUse: canOpenAdmissions,
      navigationStatus,
    }),
    makeAction({
      id: HOME_ACTION_IDS.DATASET_CAPTURE,
      path: ROUTES[HOME_ACTION_IDS.DATASET_CAPTURE],
      visible: canUseDatasetCapture,
      canUse: canUseDatasetCapture,
      count: countOrNull(counts?.dataset?.submitted),
      navigationStatus,
    }),
    makeAction({
      id: HOME_ACTION_IDS.REVIEW_QUEUE,
      path: ROUTES[HOME_ACTION_IDS.REVIEW_QUEUE],
      visible: canOpenReviewQueue,
      canUse: canOpenReviewQueue,
      count: countOrNull(counts?.review?.pendingTotal),
      navigationStatus,
    }),
    makeAction({
      id: HOME_ACTION_IDS.DASHBOARD,
      path: ROUTES[HOME_ACTION_IDS.DASHBOARD],
      visible: canOpenDashboard,
      canUse: canOpenDashboard,
      navigationStatus,
    }),
    makeAction({
      id: HOME_ACTION_IDS.USER_MANAGEMENT,
      path: ROUTES[HOME_ACTION_IDS.USER_MANAGEMENT],
      visible: navigation.canManageFacility === true,
      canUse: navigation.canManageFacility === true,
      navigationStatus,
    }),
    makeAction({
      id: HOME_ACTION_IDS.SETTINGS,
      path: ROUTES[HOME_ACTION_IDS.SETTINGS],
      canUse: true,
      navigationStatus,
    }),
  ].filter((action) => action.visible);
};

const buildHomeStatusItems = (summary, network = {}) => {
  const counts = getCounts(summary);
  const activeFacility = summary?.activeFacility ?? null;
  const reviewVisible = counts?.review?.visible === true;
  const networkStatus = network.isSyncing
    ? 'syncing'
    : network.isOffline
      ? 'offline'
      : network.isLowQuality
        ? 'unstable'
        : 'online';

  const items = [
    {
      id: HOME_STATUS_IDS.FACILITY,
      value: activeFacility?.name || null,
      fallbackKey: activeFacility ? null : 'home.status.facility.empty',
      detail: activeFacility?.district || activeFacility?.region || null,
      tone: activeFacility ? 'success' : 'warning',
    },
    {
      id: HOME_STATUS_IDS.NETWORK,
      valueKey: `home.status.network.values.${networkStatus}`,
      detail: network.networkQuality || null,
      tone: networkStatus === 'online' ? 'success' : networkStatus === 'syncing' ? 'primary' : 'warning',
    },
    {
      id: HOME_STATUS_IDS.ACTIVE_ADMISSIONS,
      value: numberOrZero(counts?.patientActivity?.activeAdmissions),
      detailValue: numberOrZero(counts?.patientActivity?.activePatients),
      detailKey: 'home.status.activeAdmissions.detail',
      tone: 'primary',
    },
    {
      id: HOME_STATUS_IDS.DRAFTS,
      value: numberOrZero(counts?.drafts?.localDrafts),
      detailValue: numberOrZero(counts?.drafts?.waitingToSync),
      detailKey: 'home.status.drafts.detail',
      tone: numberOrZero(counts?.drafts?.localDrafts) > 0 ? 'warning' : 'success',
    },
    {
      id: HOME_STATUS_IDS.SYNC_ATTENTION,
      value: numberOrZero(counts?.sync?.attentionTotal),
      detailValue: numberOrZero(counts?.sync?.conflicts),
      detailKey: 'home.status.syncAttention.detail',
      tone: numberOrZero(counts?.sync?.attentionTotal) > 0 ? 'error' : 'success',
    },
  ];

  if (reviewVisible) {
    items.push({
      id: HOME_STATUS_IDS.REVIEW_NEEDS,
      value: numberOrZero(counts?.review?.pendingTotal),
      detailValue: numberOrZero(counts?.review?.correctionRequestedTotal),
      detailKey: 'home.status.reviewNeeds.detail',
      tone: numberOrZero(counts?.review?.pendingTotal) > 0 ? 'warning' : 'success',
    });
  }

  return items;
};

const buildHomeNotices = (summary, network = {}) => {
  const notices = [...(summary?.navigation?.notices || [])];
  if (network.isOffline) {
    notices.unshift({
      code: 'OFFLINE',
      severity: 'warning',
      message: 'Offline mode is active. Local drafts can continue and sync when connectivity returns.',
    });
  }
  return notices;
};

export default function useHomeScreen() {
  const network = useNetwork();
  const { data, errorCode, fail, isLoading, start, succeed } = useAsyncState();
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);

  const loadSummary = useCallback(async (facilityId) => {
    start();
    try {
      const summary = await loadHomeSummaryUseCase({ facilityId });
      succeed(summary);
    } catch (error) {
      fail(error?.code || 'HOME_SUMMARY_LOAD_FAILED');
    }
  }, [fail, start, succeed]);

  useEffect(() => {
    let isActive = true;
    const run = async () => {
      start();
      try {
        const summary = await loadHomeSummaryUseCase({ facilityId: selectedFacilityId });
        if (isActive) succeed(summary);
      } catch (error) {
        if (isActive) fail(error?.code || 'HOME_SUMMARY_LOAD_FAILED');
      }
    };
    run();
    return () => {
      isActive = false;
    };
  }, [fail, selectedFacilityId, start, succeed]);

  const selectFacility = useCallback((facilityId) => {
    setSelectedFacilityId(facilityId || null);
  }, []);

  return useMemo(() => {
    const summary = data || null;
    return {
      testIds: HOME_TEST_IDS,
      summary,
      selectedFacilityId,
      isLoading,
      errorCode,
      network,
      activeFacility: summary?.activeFacility ?? null,
      availableFacilities: summary?.availableFacilities ?? [],
      actions: buildHomeActions(summary),
      statusItems: buildHomeStatusItems(summary, network),
      notices: buildHomeNotices(summary, network),
      selectFacility,
      refresh: () => loadSummary(selectedFacilityId),
    };
  }, [data, errorCode, isLoading, loadSummary, network, selectFacility, selectedFacilityId]);
}

export { buildHomeActions, buildHomeNotices, buildHomeStatusItems };
