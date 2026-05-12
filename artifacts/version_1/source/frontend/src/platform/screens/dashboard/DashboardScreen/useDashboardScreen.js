/**
 * useDashboardScreen
 * Shared dashboard loading and role-aware presentation logic.
 * File: useDashboardScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getActiveFacilityContext } from '@config/accessControl';
import { useAuth } from '@hooks';
import {
  DASHBOARD_TYPES,
  MEMBERSHIP_ROLES,
  getDashboardCapabilities,
  getDashboardTypeForRoles,
  loadDashboardUseCase,
  normalizeRoles,
} from '@features/dashboard';
import { DASHBOARD_SCREEN_TEST_IDS } from './types';

const DASHBOARD_LABELS = Object.freeze({
  [DASHBOARD_TYPES.CLINICAL]: 'Clinical workload',
  [DASHBOARD_TYPES.OPERATIONAL]: 'Operations',
  [DASHBOARD_TYPES.GOVERNANCE]: 'Governance',
});

const EMPTY_ROWS = Object.freeze([]);
const CONNECTION_ERROR_CODES = new Set([
  'BACKEND_HOST_UNREACHABLE',
  'BACKEND_UNAVAILABLE',
  'NETWORK_ERROR',
  'REQUEST_TIMEOUT',
  'SECURE_CONNECTION_FAILED',
]);

const numberOrZero = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

const sumCountMap = (value = {}) => Object.values(value || {}).reduce((total, item) => total + numberOrZero(item), 0);

const sumBacklog = (backlog = {}) => (
  sumCountMap(backlog.admissions) +
  sumCountMap(backlog.abgTests) +
  sumCountMap(backlog.ventilatorSettings) +
  sumCountMap(backlog.datasetCases)
);

const row = (label, value) => ({ label, value: numberOrZero(value) });

const rowsFromCountMap = (value = {}) => Object.entries(value || {})
  .filter(([, count]) => numberOrZero(count) > 0)
  .map(([label, count]) => ({ label: label.split('_').join(' '), value: numberOrZero(count) }));

const reviewBacklogRows = (backlog = {}) => [
  row('Admissions', sumCountMap(backlog.admissions)),
  row('ABG tests', sumCountMap(backlog.abgTests)),
  row('Ventilator updates', sumCountMap(backlog.ventilatorSettings)),
  row('Dataset cases', sumCountMap(backlog.datasetCases)),
];

const getClinicalMetrics = (dashboard) => {
  const counts = dashboard?.workload?.counts || {};
  return [
    row('Active admissions', counts.activeAdmissions),
    row('Daily reviews due', counts.pendingDailyReviews),
    row('Recent ABGs', counts.recentAbgTests),
    row('Vent updates', counts.recentVentilatorUpdates),
    row('Review backlog', sumBacklog(dashboard?.workload?.reviewBacklog)),
    row('Sync attention', dashboard?.syncConflicts?.total),
  ];
};

const getOperationalMetrics = (dashboard) => {
  const counts = dashboard?.counts || {};
  return [
    row('Active admissions', counts.activeAdmissions),
    row('Ventilated patients', counts.ventilatedPatients),
    row('Review queue', sumBacklog(dashboard?.reviewBacklog)),
    row('Sync attention', counts.syncAttention),
    row('Export eligible', dashboard?.datasetReadiness?.exportEligible),
    row('Audited overrides', dashboard?.overrides?.auditedOverrides),
  ];
};

const getGovernanceMetrics = (dashboard) => [
  row('Export eligible', dashboard?.datasetReadiness?.exportEligible),
  row('Missing governance', dashboard?.datasetReadiness?.missingGovernance),
  row('Range backlog', dashboard?.referenceGovernance?.verificationBacklog),
  row('Model metadata gaps', dashboard?.modelGovernance?.modelsMissingReadinessMetadata),
  row('Audit events', dashboard?.auditSummary?.total),
  row('Shadow outputs', dashboard?.modelGovernance?.shadowOutputs),
];

const getClinicalSections = (dashboard) => [
  {
    id: 'clinical-review',
    title: 'Review backlog',
    rows: reviewBacklogRows(dashboard?.workload?.reviewBacklog),
  },
  {
    id: 'clinical-sync',
    title: 'Sync conflicts',
    rows: [
      row('Attention total', dashboard?.syncConflicts?.total),
      ...rowsFromCountMap(dashboard?.syncConflicts?.byStatus),
    ],
  },
];

const getOperationalSections = (dashboard) => [
  {
    id: 'operational-review',
    title: 'Review backlog',
    rows: reviewBacklogRows(dashboard?.reviewBacklog),
  },
  {
    id: 'operational-dataset',
    title: 'Dataset readiness',
    rows: [
      row('Total cases', dashboard?.datasetReadiness?.total),
      row('Approved for training', dashboard?.datasetReadiness?.approvedForTraining),
      row('Export eligible', dashboard?.datasetReadiness?.exportEligible),
      row('Missing governance', dashboard?.datasetReadiness?.missingGovernance),
    ],
  },
  {
    id: 'operational-overrides',
    title: 'Overrides and audit',
    rows: [
      row('Audited overrides', dashboard?.overrides?.auditedOverrides),
      row('Correction requests', dashboard?.overrides?.correctionRequests),
      row('Exclusions', dashboard?.overrides?.exclusions),
      row('Audit events', dashboard?.auditSummary?.total),
    ],
  },
  {
    id: 'operational-governance',
    title: 'Governance checks',
    rows: [
      row('Range verification backlog', dashboard?.referenceGovernance?.verificationBacklog),
      row('Active range versions', dashboard?.referenceGovernance?.activeVersions),
      row('Retired range versions', dashboard?.referenceGovernance?.retiredVersions),
      row('Model metadata gaps', dashboard?.modelGovernance?.modelsMissingReadinessMetadata),
    ],
  },
];

const getGovernanceSections = (dashboard) => [
  {
    id: 'governance-dataset',
    title: 'Dataset readiness',
    rows: [
      row('Total cases', dashboard?.datasetReadiness?.total),
      row('Approved for training', dashboard?.datasetReadiness?.approvedForTraining),
      row('Export eligible', dashboard?.datasetReadiness?.exportEligible),
      row('Missing governance', dashboard?.datasetReadiness?.missingGovernance),
    ],
  },
  {
    id: 'governance-reference',
    title: 'Reference ranges',
    rows: [
      row('Verification backlog', dashboard?.referenceGovernance?.verificationBacklog),
      row('Active versions', dashboard?.referenceGovernance?.activeVersions),
      row('Retired versions', dashboard?.referenceGovernance?.retiredVersions),
    ],
  },
  {
    id: 'governance-models',
    title: 'Model governance',
    rows: [
      row('Shadow outputs', dashboard?.modelGovernance?.shadowOutputs),
      row('Outputs in window', dashboard?.modelGovernance?.outputsInWindow),
      row('Metadata gaps', dashboard?.modelGovernance?.modelsMissingReadinessMetadata),
    ],
  },
  {
    id: 'governance-audit',
    title: 'Audit and overrides',
    rows: [
      row('Audit events', dashboard?.auditSummary?.total),
      row('Audited overrides', dashboard?.overrides?.auditedOverrides),
      row('Correction requests', dashboard?.overrides?.correctionRequests),
      row('Sync attention', dashboard?.syncConflicts?.total),
    ],
  },
];

const getMetricsForDashboard = (type, dashboard) => {
  if (!dashboard) return EMPTY_ROWS;
  if (type === DASHBOARD_TYPES.OPERATIONAL) return getOperationalMetrics(dashboard);
  if (type === DASHBOARD_TYPES.GOVERNANCE) return getGovernanceMetrics(dashboard);
  return getClinicalMetrics(dashboard);
};

const getSectionsForDashboard = (type, dashboard) => {
  if (!dashboard) return EMPTY_ROWS;
  if (type === DASHBOARD_TYPES.OPERATIONAL) return getOperationalSections(dashboard);
  if (type === DASHBOARD_TYPES.GOVERNANCE) return getGovernanceSections(dashboard);
  return getClinicalSections(dashboard);
};

const getVisibleTypes = (capabilities) => [
  capabilities.canViewClinical ? DASHBOARD_TYPES.CLINICAL : null,
  capabilities.canViewOperational ? DASHBOARD_TYPES.OPERATIONAL : null,
  capabilities.canViewGovernance ? DASHBOARD_TYPES.GOVERNANCE : null,
].filter(Boolean);

const getDashboardErrorTitle = (type) =>
  `Unable to load ${(DASHBOARD_LABELS[type] || 'dashboard').toLowerCase()} dashboard`;

const getDashboardErrorMessage = (error) => {
  const code = String(error?.code || '').toUpperCase();
  if (CONNECTION_ERROR_CODES.has(code)) {
    return 'Unable to load dashboard data. Please check your connection and try again.';
  }
  if (code === 'FORBIDDEN') {
    return 'Dashboard access requires an approved facility role.';
  }
  if (code === 'UNAUTHORIZED' || code === 'SESSION_EXPIRED') {
    return 'Your session has expired. Please sign in again to load dashboard data.';
  }
  return 'Something went wrong while loading the dashboard. Please try again.';
};

export default function useDashboardScreen() {
  const { activeFacility: selectedActiveFacility, user, roles } = useAuth();
  const activeFacility = useMemo(
    () => selectedActiveFacility || getActiveFacilityContext(user),
    [selectedActiveFacility, user],
  );
  const roleKeys = useMemo(() => {
    const authRoles = Array.isArray(roles) ? roles : [];
    const facilityRoles = Array.isArray(activeFacility?.roles) ? activeFacility.roles : [];
    return normalizeRoles([...authRoles, ...facilityRoles]);
  }, [activeFacility?.roles, roles]);
  const isPlatformAdmin = roleKeys.includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN);
  const capabilities = useMemo(() => getDashboardCapabilities(roleKeys), [roleKeys]);
  const visibleTypes = useMemo(() => getVisibleTypes(capabilities), [capabilities]);
  const defaultType = useMemo(() => getDashboardTypeForRoles(roleKeys), [roleKeys]);
  const [activeType, setActiveType] = useState(defaultType);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!visibleTypes.includes(activeType)) {
      setActiveType(visibleTypes[0] || defaultType);
    }
  }, [activeType, defaultType, visibleTypes]);

  const dashboardParams = useMemo(() => {
    const facilityId = activeFacility?.facilityId || activeFacility?.id || undefined;
    return {
      days: 14,
      ...(facilityId && !isPlatformAdmin ? { facilityId } : {}),
    };
  }, [activeFacility?.facilityId, activeFacility?.id, isPlatformAdmin]);
  const requiresFacilityScope = visibleTypes.length > 0 && !isPlatformAdmin && !dashboardParams.facilityId;

  const loadDashboard = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!visibleTypes.includes(activeType) || requiresFacilityScope) {
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await loadDashboardUseCase(activeType, dashboardParams);
      if (requestIdRef.current === requestId) setDashboard(data);
    } catch (error) {
      if (requestIdRef.current === requestId) {
        setErrorMessage(getDashboardErrorMessage(error));
      }
    } finally {
      if (requestIdRef.current === requestId) setIsLoading(false);
    }
  }, [activeType, dashboardParams, requiresFacilityScope, visibleTypes]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const canDisplayDashboard = visibleTypes.includes(activeType) && !requiresFacilityScope;
  const activeDashboard = canDisplayDashboard && dashboard?.dashboard === activeType ? dashboard : null;
  const metrics = useMemo(() => getMetricsForDashboard(activeType, activeDashboard), [activeType, activeDashboard]);
  const sections = useMemo(() => getSectionsForDashboard(activeType, activeDashboard), [activeType, activeDashboard]);
  const tabs = useMemo(() => visibleTypes.map((type) => ({
    id: type,
    label: DASHBOARD_LABELS[type],
  })), [visibleTypes]);
  const scopeLabel = activeDashboard?.scope?.facility?.name || (
    activeDashboard?.scope?.scope === 'platform' || isPlatformAdmin
      ? 'Platform scope'
      : activeFacility?.name || 'No active facility'
  );
  const emptyMessage = requiresFacilityScope
    ? 'Select an active facility to view dashboard data.'
    : 'No dashboard data is available yet.';

  return {
    activeFacility,
    activeType,
    dashboard: activeDashboard,
    emptyMessage,
    errorTitle: errorMessage ? getDashboardErrorTitle(activeType) : null,
    errorMessage,
    isLoading,
    metrics,
    scopeLabel,
    sections,
    setActiveType,
    tabs,
    testIds: DASHBOARD_SCREEN_TEST_IDS,
    visibleTypes,
    refresh: loadDashboard,
  };
}
