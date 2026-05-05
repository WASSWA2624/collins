/**
 * DataSourcesScreen Component Tests (P011 11.S.12)
 * File: DataSourcesScreen.test.js
 */
const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useAuth, useI18n, useNetwork } = require('@hooks');

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
}));
jest.mock('@features/ventilation/ventilation.model', () => ({
  getDefaultVentilationDataset: () => ({
    datasetVersion: '1.1',
    datasetSchemaVersion: '1.1',
    lastUpdated: '2026-01-31',
    totalCases: 100,
    sources: [{ id: 'SRC_1', citation: 'Test citation', doi: '10.1234/test' }],
  }),
  getVentilationDatasetMeta: (ds) => ({
    version: ds?.datasetVersion,
    schemaVersion: ds?.datasetSchemaVersion,
    lastUpdated: ds?.lastUpdated,
    totalCases: ds?.totalCases,
  }),
  getVentilationDatasetSources: (ds) => ds?.sources ?? [],
}));

jest.mock('@platform/components', () => {
  const MockReact = require('react');
  const RN = require('react-native');
  return {
    Button: ({ text, children, testID, onPress, disabled }) =>
      MockReact.createElement(
        RN.Pressable,
        { testID, onPress, disabled },
        MockReact.createElement(RN.Text, null, text || children)
      ),
    Stack: ({ children }) => MockReact.createElement(RN.View, null, children),
    Text: ({ children, testID }) => MockReact.createElement(RN.Text, { testID }, children),
    TextArea: ({ testID, value, onChangeText }) =>
      MockReact.createElement(RN.TextInput, { testID, value, onChangeText, multiline: true }),
    TextField: ({ testID, value, onChangeText, label }) =>
      MockReact.createElement(
        RN.View,
        null,
        MockReact.createElement(RN.Text, null, label),
        MockReact.createElement(RN.TextInput, { testID, value, onChangeText })
      ),
  };
});

const DataSourcesScreenAndroid = require('@platform/screens/settings/DataSourcesScreen/DataSourcesScreen.android').default;
const DataSourcesScreenIOS = require('@platform/screens/settings/DataSourcesScreen/DataSourcesScreen.ios').default;
const DataSourcesScreenWeb = require('@platform/screens/settings/DataSourcesScreen/DataSourcesScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('DataSourcesScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'settings.dataSources.screen.label': 'Data sources screen',
      'settings.dataSources.title': 'Data sources',
      'settings.dataSources.datasetVersion': 'Dataset version',
      'settings.dataSources.schemaVersion': 'Schema version',
      'settings.dataSources.lastUpdated': 'Last updated',
      'settings.dataSources.totalCases': 'Total cases',
      'settings.dataSources.citations': 'Citations',
      'settings.dataSources.doi': 'DOI',
      'settings.dataSources.states.empty': 'No sources available',
      'settings.dataSources.capture.title': 'Dataset capture',
      'settings.dataSources.capture.governanceNotice': 'Candidates require review',
      'settings.dataSources.capture.roleBlocked': 'Capture blocked',
      'settings.dataSources.capture.offlineNotice': 'Queued offline',
      'settings.dataSources.capture.noteLabel': 'Paste ICU note',
      'settings.dataSources.capture.notePlaceholder': 'Paste note',
      'settings.dataSources.capture.parse': 'Parse preview',
      'settings.dataSources.capture.facilityReady': 'Facility ready',
      'settings.dataSources.capture.facilityMissing': 'Facility missing',
      'settings.dataSources.capture.noteRequired': 'Note required',
      'settings.dataSources.capture.identifierWarning': 'Identifier warning',
      'settings.dataSources.capture.previewTitle': 'Structured candidate preview',
      'settings.dataSources.capture.missingFields': 'Missing values',
      'settings.dataSources.capture.uncertainFields': 'Uncertainty highlights',
      'settings.dataSources.capture.none': 'None',
      'settings.dataSources.capture.submitForReview': 'Submit for review',
      'settings.dataSources.capture.trainingApprovalAvailable': 'Training approval controls remain governed',
      'settings.dataSources.capture.status.ready': 'Ready',
      'settings.dataSources.capture.status.submitted': 'Submitted',
      'settings.dataSources.capture.status.queued': 'Queued',
      'settings.dataSources.capture.status.error': 'Error',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useAuth.mockReturnValue({
      user: {
        activeFacility: { facilityId: 'facility-1' },
        memberships: [{ facilityId: 'facility-1', role: 'CLINICIAN', status: 'APPROVED' }],
      },
      roles: ['clinician'],
    });
    useNetwork.mockReturnValue({ isOffline: false });
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<DataSourcesScreenAndroid />);
    expect(getByTestId('data-sources-screen')).toBeTruthy();
    expect(getByTestId('data-sources-title')).toBeTruthy();
    expect(getByTestId('data-sources-content')).toBeTruthy();
    expect(getByTestId('data-sources-list')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<DataSourcesScreenIOS />);
    expect(getByTestId('data-sources-screen')).toBeTruthy();
    expect(getByTestId('data-sources-title')).toBeTruthy();
    expect(getByTestId('data-sources-list')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<DataSourcesScreenWeb />);
    expect(getByTestId('data-sources-screen')).toBeTruthy();
    expect(getByTestId('data-sources-title')).toBeTruthy();
    expect(getByTestId('data-sources-list')).toBeTruthy();
  });

  it('renders capture controls without clinician training approval controls', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(<DataSourcesScreenAndroid />);
    expect(getByTestId('dataset-capture-section')).toBeTruthy();
    expect(getByTestId('dataset-capture-note-input')).toBeTruthy();
    expect(getByTestId('dataset-capture-parse-button')).toBeTruthy();
    expect(queryByTestId('dataset-capture-training-approval-controls')).toBeNull();
  });

  it('creates an editable preview from pasted note text', () => {
    const { getByTestId } = renderWithTheme(<DataSourcesScreenAndroid />);
    fireEvent.changeText(
      getByTestId('dataset-capture-note-input'),
      'Age 54 female SpO2 93 FiO2 50% RR 24 pH 7.34 PEEP 8'
    );
    fireEvent.press(getByTestId('dataset-capture-parse-button'));

    expect(getByTestId('dataset-capture-preview')).toBeTruthy();
    expect(getByTestId('dataset-capture-field-input-patient.ageYears').props.value).toBe('54');
    expect(getByTestId('dataset-capture-field-input-clinicalSnapshot.fio2').props.value).toBe('0.5');
    expect(getByTestId('dataset-capture-missing-list')).toBeTruthy();
  });
});
