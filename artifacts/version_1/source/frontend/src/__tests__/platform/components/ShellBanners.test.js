/**
 * ShellBanners Component Tests
 * File: ShellBanners.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import ShellBannersWeb from '@platform/components/feedback/ShellBanners/ShellBanners.web';
import ShellBannersAndroid from '@platform/components/feedback/ShellBanners/ShellBanners.android';
import ShellBannersIOS from '@platform/components/feedback/ShellBanners/ShellBanners.ios';
import lightTheme from '@theme/light.theme';

const mockBanner = jest.fn(() => null);

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@platform/components/feedback/SystemBanner', () => ({
  __esModule: true,
  default: (props) => mockBanner(props),
}));

describe('ShellBanners Component', () => {
  beforeEach(() => {
    mockBanner.mockClear();
  });

  it('returns null when no banners are provided', () => {
    const { toJSON } = render(
      <WebThemeProvider theme={lightTheme}>
        <ShellBannersWeb banners={[]} />
      </WebThemeProvider>
    );
    expect(toJSON()).toBeNull();
  });

  it('renders banners on web', () => {
    render(
      <WebThemeProvider theme={lightTheme}>
        <ShellBannersWeb banners={[{ id: 'offline', title: 'Offline' }]} />
      </WebThemeProvider>
    );
    expect(mockBanner).toHaveBeenCalledWith(expect.objectContaining({ id: 'offline', title: 'Offline' }));
  });

  it('renders banners on Android', () => {
    render(
      <NativeThemeProvider theme={lightTheme}>
        <ShellBannersAndroid banners={[{ id: 'online', title: 'Online' }]} />
      </NativeThemeProvider>
    );
    expect(mockBanner).toHaveBeenCalledWith(expect.objectContaining({ id: 'online', title: 'Online' }));
  });

  it('renders banners on iOS', () => {
    render(
      <NativeThemeProvider theme={lightTheme}>
        <ShellBannersIOS banners={[{ id: 'maintenance', title: 'Maintenance' }]} />
      </NativeThemeProvider>
    );
    expect(mockBanner).toHaveBeenCalledWith(expect.objectContaining({ id: 'maintenance', title: 'Maintenance' }));
  });
});
