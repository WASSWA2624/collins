/**
 * useHomeScreen Hook Tests
 * File: useHomeScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');

jest.mock('@hooks/useNetwork', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isOnline: true,
    isOffline: false,
    isSyncing: false,
    networkQuality: 'good',
    isLowQuality: false,
  })),
}));

jest.mock('@features/home', () => ({
  loadHomeSummaryUseCase: jest.fn(() => new Promise(() => {})),
}));

const {
  buildHomeActions,
  buildHomeNotices,
  buildHomeStatusItems,
  default: useHomeScreen,
} = require('@platform/screens/common/HomeScreen/useHomeScreen');

const act = TestRenderer.act;
const renderHook = (hook) => {
  const result = {};
  const HookHarness = () => {
    Object.assign(result, hook());
    return null;
  };
  let renderer;
  act(() => {
    renderer = TestRenderer.create(React.createElement(HookHarness));
  });
  return { result: { current: result }, unmount: () => renderer.unmount() };
};

const readySummary = {
  activeFacility: {
    id: 'facility-1',
    name: 'City ICU',
    district: 'Central',
    verificationStatus: 'VERIFIED',
  },
  availableFacilities: [],
  counts: {
    patientActivity: {
      activePatients: 3,
      activeAdmissions: 4,
    },
    drafts: {
      localDrafts: 1,
      waitingToSync: 2,
    },
    sync: {
      waitingToSync: 2,
      conflicts: 1,
      failedValidation: 0,
      needsReview: 0,
      failed: 0,
      attentionTotal: 1,
    },
    review: {
      visible: true,
      pendingTotal: 5,
      correctionRequestedTotal: 2,
    },
    dataset: {
      visible: true,
      submitted: 7,
    },
  },
  navigation: {
    status: 'ready',
    canOpenAdmissions: true,
    canCreateAdmission: true,
    canOpenReviewQueue: true,
    canManageFacility: false,
    canResolveSyncConflicts: true,
    notices: [],
  },
};

describe('useHomeScreen', () => {
  it('returns testIds and operational collections', () => {
    const { result } = renderHook(() => useHomeScreen());
    expect(result.current.testIds.screen).toBe('home-screen');
    expect(Array.isArray(result.current.actions)).toBe(true);
    expect(Array.isArray(result.current.statusItems)).toBe(true);
  });

  it('builds role-aware Home actions', () => {
    const actions = buildHomeActions(readySummary);
    expect(actions.map((action) => action.id)).toEqual([
      'admit',
      'tracking',
      'abgVentUpdate',
      'datasetCapture',
      'reviewQueue',
      'dashboard',
      'settings',
    ]);
    expect(actions.find((action) => action.id === 'admit').enabled).toBe(true);
    expect(actions.find((action) => action.id === 'tracking').count).toBe(4);
    expect(actions.find((action) => action.id === 'abgVentUpdate').path).toBe('/abg-ventilator-updates');
    expect(actions.find((action) => action.id === 'reviewQueue').count).toBe(5);
    expect(actions.find((action) => action.id === 'reviewQueue').enabled).toBe(true);
    expect(actions.find((action) => action.id === 'dashboard').path).toBe('/dashboard');
    expect(actions.some((action) => action.id === 'trainingHelp')).toBe(false);
  });

  it('adds the Admin shortcut for facility managers', () => {
    const actions = buildHomeActions({
      ...readySummary,
      navigation: {
        ...readySummary.navigation,
        canManageFacility: true,
      },
    });
    const adminAction = actions.find((action) => action.id === 'userManagement');
    expect(adminAction).toMatchObject({
      enabled: true,
      path: '/user-management',
    });
  });

  it('hides reviewer actions for non-review roles', () => {
    const actions = buildHomeActions({
      ...readySummary,
      counts: {
        ...readySummary.counts,
        review: { visible: false, pendingTotal: null, correctionRequestedTotal: null },
      },
      navigation: {
        ...readySummary.navigation,
        canOpenReviewQueue: false,
      },
    });
    expect(actions.some((action) => action.id === 'reviewQueue')).toBe(false);
  });

  it('builds status items without decision-support outputs', () => {
    const items = buildHomeStatusItems(readySummary, {
      isOffline: false,
      isSyncing: false,
      isLowQuality: false,
      networkQuality: 'good',
    });
    expect(items.map((item) => item.id)).toEqual([
      'facility',
      'network',
      'activeAdmissions',
      'drafts',
      'syncAttention',
      'reviewNeeds',
    ]);
    expect(items.find((item) => item.id === 'syncAttention').value).toBe(1);
    expect(JSON.stringify(items)).not.toMatch(/recommendation|decision|risk/i);
  });

  it('adds an offline notice from local network state', () => {
    const notices = buildHomeNotices(readySummary, { isOffline: true });
    expect(notices[0].code).toBe('OFFLINE');
  });
});
