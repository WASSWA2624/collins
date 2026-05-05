/**
 * ReviewQueueScreen Component Tests
 * File: ReviewQueueScreen.test.js
 */

const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');

const mockHandleAction = jest.fn();
const mockRefresh = jest.fn();

jest.mock('@platform/screens/review/ReviewQueueScreen/useReviewQueueScreen', () => jest.fn());

const useReviewQueueScreen = require('@platform/screens/review/ReviewQueueScreen/useReviewQueueScreen').default;
const ReviewQueueScreenAndroid = require('@platform/screens/review/ReviewQueueScreen/ReviewQueueScreen.android').default;
const ReviewQueueScreenIOS = require('@platform/screens/review/ReviewQueueScreen/ReviewQueueScreen.ios').default;
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const baseHookState = {
  t: (key) => ({
    'reviewQueue.title': 'Review Queue',
    'reviewQueue.subtitle': 'Validate submitted records',
    'reviewQueue.accessibilityLabel': 'Validation review queue',
    'reviewQueue.commentPlaceholder': 'Reviewer note',
    'reviewQueue.forbidden.title': 'Review access required',
    'reviewQueue.forbidden.message': 'Reviewer role required',
    'reviewQueue.summary.total': 'Total',
    'reviewQueue.summary.urgent': 'Urgent',
    'reviewQueue.summary.conflicts': 'Conflicts',
    'reviewQueue.summary.datasetReady': 'Dataset ready',
    'reviewQueue.filters.all': 'All',
    'reviewQueue.entityTypes.admission': 'Admission',
    'reviewQueue.entityTypes.sync-conflict': 'Sync conflict',
    'reviewQueue.fields.type': 'Type',
    'reviewQueue.fields.status': 'Status',
    'reviewQueue.fields.priority': 'Priority',
    'reviewQueue.fields.validation': 'Validation',
    'reviewQueue.fields.conflict': 'Conflict',
    'reviewQueue.actions.refresh': 'Refresh',
    'reviewQueue.actions.approve': 'Approve',
    'reviewQueue.actions.requestCorrection': 'Request correction',
    'reviewQueue.actions.exclude': 'Exclude',
    'reviewQueue.actions.defer': 'Defer',
    'reviewQueue.states.loading': 'Loading',
    'reviewQueue.states.error': 'Error',
    'reviewQueue.states.empty': 'No records need review.',
  }[key] || key),
  testIds: {
    screen: 'review-queue-screen',
    forbidden: 'review-queue-forbidden',
    filters: 'review-queue-filters',
    summary: 'review-queue-summary',
    loading: 'review-queue-loading',
    error: 'review-queue-error',
    empty: 'review-queue-empty',
    list: 'review-queue-list',
    item: 'review-queue-item',
    comment: 'review-queue-comment',
    approve: 'review-queue-approve',
    correction: 'review-queue-correction',
    exclude: 'review-queue-exclude',
    defer: 'review-queue-defer',
    refresh: 'review-queue-refresh',
  },
  canReview: true,
  items: [],
  summary: { total: 0, urgent: 0, conflicts: 0, datasetReady: 0 },
  filterOptions: [{ value: '', label: 'All' }],
  selectedEntityType: '',
  setSelectedEntityType: jest.fn(),
  commentsById: {},
  setComment: jest.fn(),
  isLoading: false,
  actionLoadingById: {},
  errorCode: null,
  refresh: mockRefresh,
  actions: {
    APPROVE: 'approve',
    REQUEST_CORRECTION: 'request_correction',
    EXCLUDE: 'exclude',
    TRIAGE: 'triage',
  },
  handleAction: mockHandleAction,
};

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('ReviewQueueScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReviewQueueScreen.mockReturnValue(baseHookState);
  });

  it('renders forbidden state for non-reviewers', () => {
    useReviewQueueScreen.mockReturnValue({ ...baseHookState, canReview: false });
    const { getByTestId, getByText } = renderWithTheme(<ReviewQueueScreenAndroid />);
    expect(getByTestId('review-queue-forbidden')).toBeDefined();
    expect(getByText('Review access required')).toBeDefined();
  });

  it('renders empty queue on Android and iOS', () => {
    expect(renderWithTheme(<ReviewQueueScreenAndroid />).getByTestId('review-queue-empty')).toBeDefined();
    expect(renderWithTheme(<ReviewQueueScreenIOS />).getByTestId('review-queue-empty')).toBeDefined();
  });

  it('renders conflict item and dispatches approve action', () => {
    const item = {
      entityType: 'sync-conflict',
      entityId: 'sync-1',
      title: 'Sync save_admission_review_step',
      reviewStatus: 'CONFLICT',
      triage: {
        priority: 'urgent',
        validationStatus: null,
        missingData: [],
        uncertainty: null,
        syncConflict: { resolution: 'keep_server_record_and_route_client_payload_for_review' },
        needsOverrideReason: false,
      },
      datasetReadiness: null,
    };
    useReviewQueueScreen.mockReturnValue({
      ...baseHookState,
      items: [item],
      summary: { total: 1, urgent: 1, conflicts: 1, datasetReady: 0 },
    });

    const { getByTestId } = renderWithTheme(<ReviewQueueScreenAndroid />);
    expect(getByTestId('review-queue-item-sync-1')).toBeDefined();
    fireEvent.press(getByTestId('review-queue-approve-sync-1'));
    expect(mockHandleAction).toHaveBeenCalledWith(item, 'approve');
  });
});
