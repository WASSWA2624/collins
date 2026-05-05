/**
 * useDashboardScreen
 * Shared dashboard loading and role-aware presentation logic.
 * File: useDashboardScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getActiveFacilityContext } from '@config/accessControl';
import { useAuth } from '@hooks';
import {
  DASHBOARD_TYPES,
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

export default function useDashboardScreen() {
  const { user, roles } = useAuth();
  const activeFacility = useMemo(() => getActiveFacilityContext(user), [user]);
  const roleKeys = useMemo(() => {
    const authRoles = Array.isArray(roles) ? roles : [];
    const facilityRoles = Array.isArray(activeFacility?.roles) ? activeFacility.roles : [];
    return normalizeRoles([...authRoles, ...facilityRoles]);
  }, [activeFacility?.roles, roles]);
  const capabilities = useMemo(() => getDashboardCapabilities(roleKeys), [roleKeys]);
  const visibleTypes = useMemo(() => getVisibleTypes(capabilities), [capabilities]);
  const defaultType = useMemo(() => getDashboardTypeForRoles(roleKeys), [roleKeys]);
  const [activeType, setActiveType] = useState(defaultType);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!visibleTypes.includes(activeType)) {
      setActiveType(visibleTypes[0] || defaultType);
    }
  }, [activeType, defaultType, visibleTypes]);

  const loadDashboard = useCallback(async () => {
    if (!visibleTypes.includes(activeType)) {
      setDashboard(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const facilityId = activeFacility?.facilityId || activeFacility?.id || undefined;
      const data = await loadDashboardUseCase(activeType, {
        days: 14,
        ...(facilityId ? { facilityId } : {}),
      });
      setDashboard(data);
    } catch (error) {
      setDashboard(null);
      setErrorMessage(error?.message || 'Unable to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [activeFacility?.facilityId, activeFacility?.id, activeType, visibleTypes]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => getMetricsForDashboard(activeType, dashboard), [activeType, dashboard]);
  const sections = useMemo(() => getSectionsForDashboard(activeType, dashboard), [activeType, dashboard]);
  const tabs = useMemo(() => visibleTypes.map((type) => ({
    id: type,
    label: DASHBOARD_LABELS[type],
  })), [visibleTypes]);
  const scopeLabel = dashboard?.scope?.facility?.name || activeFacility?.name || (
    dashboard?.scope?.scope === 'platform' ? 'Platform scope' : 'No active facility'
  );

  return {
    activeFacility,
    activeType,
    dashboard,
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
