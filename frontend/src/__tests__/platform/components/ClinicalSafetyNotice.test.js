const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');

const ClinicalSafetyNoticeAndroid = require('@platform/components/feedback/ClinicalSafetyNotice/ClinicalSafetyNotice.android').default;
const ClinicalSafetyNoticeWeb = require('@platform/components/feedback/ClinicalSafetyNotice/ClinicalSafetyNotice.web').default;
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (node) => render(<ThemeProvider theme={lightTheme}>{node}</ThemeProvider>);

describe('ClinicalSafetyNotice', () => {
  it('renders native advisory text', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <ClinicalSafetyNoticeAndroid title="Clinical safety" message="Advisory only" />
    );

    expect(getByTestId('clinical-safety-notice')).toBeTruthy();
    expect(getByText('Advisory only')).toBeTruthy();
  });

  it('renders web advisory text', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <ClinicalSafetyNoticeWeb title="Clinical safety" message="Advisory only" />
    );

    expect(getByTestId('clinical-safety-notice')).toBeTruthy();
    expect(getByText('Clinical safety')).toBeTruthy();
  });
});

