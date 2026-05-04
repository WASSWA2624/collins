/**
 * AppFrame Component Tests
 * File: AppFrame.test.js
 */

import React from 'react';
import { Text } from 'react-native';
import AppFrame from '@platform/layouts/AppFrame';
import { renderWithProviders } from '../../helpers/test-utils';

const mockEnTranslations = require('@i18n/locales/en.json');
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => {
      const keys = key.split('.');
      let value = mockEnTranslations;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key;
      }
      return value || key;
    },
    locale: 'en',
  }),
}));

const renderWithTheme = (component) => {
  return renderWithProviders(component, {
    initialState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
    },
  });
};

describe('AppFrame Component', () => {
  it('should render children', () => {
    const { getByText } = renderWithTheme(
      <AppFrame>
        <Text>Main Content</Text>
      </AppFrame>
    );
    expect(getByText('Main Content')).toBeTruthy();
  });

  it('should render header, footer, sidebar, breadcrumbs, banner, and overlay', () => {
    const { getByText } = renderWithTheme(
      <AppFrame
        header={<Text>Header Content</Text>}
        footer={<Text>Footer Content</Text>}
        sidebar={<Text>Sidebar Content</Text>}
        breadcrumbs={<Text>Breadcrumbs</Text>}
        banner={<Text>Banner Content</Text>}
        overlay={<Text>Overlay Content</Text>}
        notices={<Text>Notices Content</Text>}
      >
        <Text>Main Content</Text>
      </AppFrame>
    );
    expect(getByText('Header Content')).toBeTruthy();
    expect(getByText('Footer Content')).toBeTruthy();
    expect(getByText('Breadcrumbs')).toBeTruthy();
    expect(getByText('Banner Content')).toBeTruthy();
    expect(getByText('Overlay Content')).toBeTruthy();
    expect(getByText('Notices Content')).toBeTruthy();
    expect(getByText('Main Content')).toBeTruthy();
  });

  it('should accept accessibility label', () => {
    const { getByLabelText } = renderWithTheme(
      <AppFrame accessibilityLabel="AppFrame Main">
        <Text>Content</Text>
      </AppFrame>
    );
    expect(getByLabelText('AppFrame Main')).toBeTruthy();
  });

  it('should render with overlay only when provided', () => {
    const { getByText, queryByText } = renderWithTheme(
      <AppFrame overlay={<Text>Overlay</Text>}>
        <Text>Content</Text>
      </AppFrame>
    );
    expect(getByText('Overlay')).toBeTruthy();
    expect(getByText('Content')).toBeTruthy();
    expect(queryByText('Missing Overlay')).toBeNull();
  });

  describe('Platform-specific rendering', () => {
    it('should render Android AppFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const AppFrameAndroid = require('@platform/layouts/AppFrame/AppFrame.android').default;
      const { getByText } = renderWithTheme(
        <AppFrameAndroid
          testID="android-app-frame"
          header={<Text>Android Header</Text>}
          footer={<Text>Android Footer</Text>}
          sidebar={<Text>Android Sidebar</Text>}
          breadcrumbs={<Text>Android Breadcrumbs</Text>}
          banner={<Text>Android Banner</Text>}
          overlay={<Text>Android Overlay</Text>}
          notices={<Text>Android Notices</Text>}
        >
          <Text>Android Content</Text>
        </AppFrameAndroid>
      );
      expect(getByText('Android Content')).toBeTruthy();
      expect(getByText('Android Header')).toBeTruthy();
      expect(getByText('Android Footer')).toBeTruthy();
      expect(getByText('Android Breadcrumbs')).toBeTruthy();
      expect(getByText('Android Banner')).toBeTruthy();
      expect(getByText('Android Overlay')).toBeTruthy();
      expect(getByText('Android Notices')).toBeTruthy();
    });

    it('should render iOS AppFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const AppFrameIOS = require('@platform/layouts/AppFrame/AppFrame.ios').default;
      const { getByText } = renderWithTheme(
        <AppFrameIOS
          testID="ios-app-frame"
          header={<Text>iOS Header</Text>}
          footer={<Text>iOS Footer</Text>}
          sidebar={<Text>iOS Sidebar</Text>}
          breadcrumbs={<Text>iOS Breadcrumbs</Text>}
          banner={<Text>iOS Banner</Text>}
          overlay={<Text>iOS Overlay</Text>}
          notices={<Text>iOS Notices</Text>}
        >
          <Text>iOS Content</Text>
        </AppFrameIOS>
      );
      expect(getByText('iOS Content')).toBeTruthy();
      expect(getByText('iOS Header')).toBeTruthy();
      expect(getByText('iOS Footer')).toBeTruthy();
      expect(getByText('iOS Breadcrumbs')).toBeTruthy();
      expect(getByText('iOS Banner')).toBeTruthy();
      expect(getByText('iOS Overlay')).toBeTruthy();
      expect(getByText('iOS Notices')).toBeTruthy();
    });

    it('should render Web AppFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const AppFrameWeb = require('@platform/layouts/AppFrame/AppFrame.web').default;
      const { getByText } = renderWithTheme(
        <AppFrameWeb
          testID="web-app-frame"
          header={<Text>Web Header</Text>}
          footer={<Text>Web Footer</Text>}
          sidebar={<Text>Web Sidebar</Text>}
          breadcrumbs={<Text>Web Breadcrumbs</Text>}
          banner={<Text>Web Banner</Text>}
          overlay={<Text>Web Overlay</Text>}
          notices={<Text>Web Notices</Text>}
        >
          <Text>Web Content</Text>
        </AppFrameWeb>
      );
      expect(getByText('Web Content')).toBeTruthy();
      expect(getByText('Web Header')).toBeTruthy();
      expect(getByText('Web Footer')).toBeTruthy();
      expect(getByText('Web Breadcrumbs')).toBeTruthy();
      expect(getByText('Web Banner')).toBeTruthy();
      expect(getByText('Web Overlay')).toBeTruthy();
      expect(getByText('Web Notices')).toBeTruthy();
    });
  });

  describe('Module exports', () => {
    it('should export AppFrame from index', () => {
      // eslint-disable-next-line import/no-unresolved
      const AppFrameIndex = require('@platform/layouts/AppFrame');
      expect(AppFrameIndex.default).toBeDefined();
    });

    it('should export FRAME_SLOTS from types.js', () => {
      // eslint-disable-next-line import/no-unresolved
      const { FRAME_SLOTS } = require('@platform/layouts/AppFrame/types');
      expect(FRAME_SLOTS).toBeDefined();
      expect(FRAME_SLOTS.HEADER).toBe('header');
      expect(FRAME_SLOTS.BANNER).toBe('banner');
      expect(FRAME_SLOTS.NOTICES).toBe('notices');
      expect(FRAME_SLOTS.CONTENT).toBe('content');
    });
  });

  describe('Style files', () => {
    it('should export Android styles', () => {
      // eslint-disable-next-line import/no-unresolved
      const styles = require('@platform/layouts/AppFrame/AppFrame.android.styles');
      expect(styles).toBeDefined();
      expect(styles.StyledContainer).toBeDefined();
      expect(styles.StyledHeader).toBeDefined();
      expect(styles.StyledBanner).toBeDefined();
      expect(styles.StyledContent).toBeDefined();
    });

    it('should export iOS styles', () => {
      // eslint-disable-next-line import/no-unresolved
      const styles = require('@platform/layouts/AppFrame/AppFrame.ios.styles');
      expect(styles).toBeDefined();
      expect(styles.StyledContainer).toBeDefined();
      expect(styles.StyledHeader).toBeDefined();
      expect(styles.StyledBanner).toBeDefined();
      expect(styles.StyledContent).toBeDefined();
    });

    it('should export Web styles', () => {
      // eslint-disable-next-line import/no-unresolved
      const styles = require('@platform/layouts/AppFrame/AppFrame.web.styles');
      expect(styles).toBeDefined();
      expect(styles.StyledContainer).toBeDefined();
      expect(styles.StyledHeader).toBeDefined();
      expect(styles.StyledBanner).toBeDefined();
      expect(styles.StyledContent).toBeDefined();
    });
  });
});
