/**
 * DatasetCaptureScreen tests
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useAuth, useI18n, useNetwork } = require('@hooks');

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
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
    Select: ({ label, testID, value }) =>
      MockReact.createElement(
        RN.View,
        null,
        MockReact.createElement(RN.Text, null, label),
        MockReact.createElement(RN.Text, { testID }, value || '')
      ),
    Stack: ({ children }) => MockReact.createElement(RN.View, null, children),
    Text: ({ children, testID }) => MockReact.createElement(RN.Text, { testID }, children),
    TextArea: ({ testID, value }) => MockReact.createElement(RN.TextInput, { testID, value, multiline: true }),
    TextField: ({ testID, value, label }) =>
      MockReact.createElement(
        RN.View,
        null,
        MockReact.createElement(RN.Text, null, label),
        MockReact.createElement(RN.TextInput, { testID, value })
      ),
  };
});

const DatasetCaptureScreenAndroid = require('@platform/screens/dataset/DatasetCaptureScreen/DatasetCaptureScreen.android').default;
const DatasetCaptureScreenIOS = require('@platform/screens/dataset/DatasetCaptureScreen/DatasetCaptureScreen.ios').default;
const DatasetCaptureScreenWeb = require('@platform/screens/dataset/DatasetCaptureScreen/DatasetCaptureScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('DatasetCaptureScreen', () => {
  const mockT = jest.fn((key, params) => {
    const translations = {
      'common.selectPlaceholder': 'Select...',
      'ventilation.datasetCapture.accessibilityLabel': 'Clinical data capture screen',
      'ventilation.datasetCapture.title': 'Clinical Data Capture',
      'ventilation.datasetCapture.subtitle': 'Capture structured clinical data',
      'ventilation.datasetCapture.summary.facility': 'Facility',
      'ventilation.datasetCapture.summary.facilityReady': 'Facility ready',
      'ventilation.datasetCapture.summary.facilityMissing': 'Facility missing',
      'ventilation.datasetCapture.summary.required': 'Required fields',
      'ventilation.datasetCapture.summary.requiredProgress': `${params?.complete}/${params?.total} complete`,
      'ventilation.datasetCapture.summary.entered': 'Entered fields',
      'ventilation.datasetCapture.summary.enteredProgress': `${params?.entered}/${params?.total} entered`,
      'ventilation.datasetCapture.summary.sync': 'Sync',
      'ventilation.datasetCapture.summary.online': 'Online',
      'ventilation.datasetCapture.summary.offline': 'Offline',
      'ventilation.datasetCapture.fields.required': 'Required',
      'ventilation.datasetCapture.fields.optional': 'Optional',
      'ventilation.datasetCapture.missing.title': 'Submission readiness',
      'ventilation.datasetCapture.missing.none': 'None',
      'ventilation.datasetCapture.actions.reset': 'Clear form',
      'ventilation.datasetCapture.actions.submit': 'Submit for review',
      'ventilation.datasetCapture.status.ready': 'Ready',
      'ventilation.datasetCapture.status.submitted': 'Submitted',
      'ventilation.datasetCapture.status.queued': 'Queued',
      'ventilation.datasetCapture.status.error': 'Error',
      'ventilation.datasetCapture.notices.roleBlocked': 'Blocked',
      'ventilation.datasetCapture.notices.offline': 'Offline notice',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useAuth.mockReturnValue({
      activeFacilityId: 'facility-1',
      user: { activeFacility: { facilityId: 'facility-1' } },
      roles: ['clinician'],
    });
    useNetwork.mockReturnValue({ isOffline: false });
  });

  it('renders the clinical capture page on Android without data-source framing', () => {
    const { getByTestId, queryByText } = renderWithTheme(<DatasetCaptureScreenAndroid />);

    expect(getByTestId('dataset-capture-screen')).toBeTruthy();
    expect(getByTestId('dataset-capture-title')).toBeTruthy();
    expect(getByTestId('dataset-capture-section-caseContext')).toBeTruthy();
    expect(getByTestId('dataset-capture-section-ventilatorSetting')).toBeTruthy();
    expect(queryByText('Citations')).toBeNull();
    expect(queryByText('Data sources')).toBeNull();
  });

  it('renders on iOS and Web', () => {
    expect(renderWithTheme(<DatasetCaptureScreenIOS />).getByTestId('dataset-capture-screen')).toBeTruthy();
    expect(renderWithTheme(<DatasetCaptureScreenWeb />).getByTestId('dataset-capture-screen')).toBeTruthy();
  });
});
