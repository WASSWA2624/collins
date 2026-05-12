/**
 * SystemBanner Component Tests
 * File: SystemBanner.test.js
 */
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import SystemBannerWeb from '@platform/components/feedback/SystemBanner/SystemBanner.web';
import SystemBannerAndroid from '@platform/components/feedback/SystemBanner/SystemBanner.android';
import SystemBannerIOS from '@platform/components/feedback/SystemBanner/SystemBanner.ios';
import { VARIANTS } from '@platform/components/feedback/SystemBanner';
import lightTheme from '@theme/light.theme';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

describe('SystemBanner Component', () => {
  it('renders web banner when visible', () => {
    const { getByLabelText } = render(
      <WebThemeProvider theme={lightTheme}>
        <SystemBannerWeb visible title="Status" message="All good" />
      </WebThemeProvider>
    );

    expect(getByLabelText('Status All good')).toBeTruthy();
  });

  it('does not render when invisible', () => {
    const { queryByText } = render(
      <WebThemeProvider theme={lightTheme}>
        <SystemBannerWeb visible={false} title="Hidden" message="Nope" />
      </WebThemeProvider>
    );

    expect(queryByText('Hidden')).toBeNull();
  });

  it('fires action on Android', () => {
    const onAction = jest.fn();
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <SystemBannerAndroid
          variant={VARIANTS.OFFLINE}
          title="Offline"
          message="Reconnect"
          actionLabel="Retry"
          onAction={onAction}
        />
      </NativeThemeProvider>
    );

    fireEvent.press(getByLabelText('Retry'));
    expect(onAction).toHaveBeenCalled();
  });

  it('fires dismiss on iOS', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <SystemBannerIOS
          variant={VARIANTS.MAINTENANCE}
          title="Maintenance"
          message="Please wait"
          dismissLabel="Close"
          onDismiss={onDismiss}
        />
      </NativeThemeProvider>
    );

    fireEvent.press(getByLabelText('Close'));
    expect(onDismiss).toHaveBeenCalled();
  });
});
