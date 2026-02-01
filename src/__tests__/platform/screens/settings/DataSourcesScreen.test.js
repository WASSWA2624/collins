/**
 * DataSourcesScreen Component Tests (P011 11.S.12)
 * File: DataSourcesScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({ useI18n: jest.fn() }));
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
  const RN = require('react-native');
  return {
    Text: ({ children, testID }) => React.createElement(RN.Text, { testID }, children),
    Stack: ({ children }) => React.createElement(RN.View, null, children),
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
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
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
});
