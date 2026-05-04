/**
 * AuthFrame Component Tests
 * File: AuthFrame.test.js
 */

import React from 'react';
import { Text } from 'react-native';
import AuthFrame from '@platform/layouts/AuthFrame';
import { renderWithProviders } from '../../helpers/test-utils';

const renderWithTheme = (component) => {
  return renderWithProviders(component, {
    initialState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
    },
  });
};

describe('AuthFrame Component', () => {
  it('should render children', () => {
    const { getByText } = renderWithTheme(
      <AuthFrame>
        <Text>Auth Content</Text>
      </AuthFrame>
    );
    expect(getByText('Auth Content')).toBeTruthy();
  });

  it('should render header, footer, and banner', () => {
    const { getByText } = renderWithTheme(
      <AuthFrame header={<Text>Brand</Text>} footer={<Text>Help</Text>} banner={<Text>Banner</Text>} notices={<Text>Notices</Text>}>
        <Text>Auth Content</Text>
      </AuthFrame>
    );
    expect(getByText('Brand')).toBeTruthy();
    expect(getByText('Help')).toBeTruthy();
    expect(getByText('Banner')).toBeTruthy();
    expect(getByText('Notices')).toBeTruthy();
    expect(getByText('Auth Content')).toBeTruthy();
  });

  it('should render overlay when provided', () => {
    const { getByText } = renderWithTheme(
      <AuthFrame overlay={<Text>Overlay</Text>}>
        <Text>Auth Content</Text>
      </AuthFrame>
    );
    expect(getByText('Overlay')).toBeTruthy();
    expect(getByText('Auth Content')).toBeTruthy();
  });

  describe('Platform-specific rendering', () => {
    it('should render Android AuthFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const AuthFrameAndroid = require('@platform/layouts/AuthFrame/AuthFrame.android').default;
      const { getByText } = renderWithTheme(
        <AuthFrameAndroid
          header={<Text>Android Header</Text>}
          footer={<Text>Android Footer</Text>}
          banner={<Text>Android Banner</Text>}
          overlay={<Text>Android Overlay</Text>}
          notices={<Text>Android Notices</Text>}
        >
          <Text>Android Auth</Text>
        </AuthFrameAndroid>
      );
      expect(getByText('Android Auth')).toBeTruthy();
      expect(getByText('Android Header')).toBeTruthy();
      expect(getByText('Android Footer')).toBeTruthy();
      expect(getByText('Android Banner')).toBeTruthy();
      expect(getByText('Android Overlay')).toBeTruthy();
      expect(getByText('Android Notices')).toBeTruthy();
    });

    it('should render iOS AuthFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const AuthFrameIOS = require('@platform/layouts/AuthFrame/AuthFrame.ios').default;
      const { getByText } = renderWithTheme(
        <AuthFrameIOS
          header={<Text>iOS Header</Text>}
          footer={<Text>iOS Footer</Text>}
          banner={<Text>iOS Banner</Text>}
          overlay={<Text>iOS Overlay</Text>}
          notices={<Text>iOS Notices</Text>}
        >
          <Text>iOS Auth</Text>
        </AuthFrameIOS>
      );
      expect(getByText('iOS Auth')).toBeTruthy();
      expect(getByText('iOS Header')).toBeTruthy();
      expect(getByText('iOS Footer')).toBeTruthy();
      expect(getByText('iOS Banner')).toBeTruthy();
      expect(getByText('iOS Overlay')).toBeTruthy();
      expect(getByText('iOS Notices')).toBeTruthy();
    });

    it('should render Web AuthFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const AuthFrameWeb = require('@platform/layouts/AuthFrame/AuthFrame.web').default;
      const { getByText } = renderWithTheme(
        <AuthFrameWeb
          header={<Text>Web Header</Text>}
          footer={<Text>Web Footer</Text>}
          banner={<Text>Web Banner</Text>}
          overlay={<Text>Web Overlay</Text>}
          notices={<Text>Web Notices</Text>}
        >
          <Text>Web Auth</Text>
        </AuthFrameWeb>
      );
      expect(getByText('Web Auth')).toBeTruthy();
      expect(getByText('Web Header')).toBeTruthy();
      expect(getByText('Web Footer')).toBeTruthy();
      expect(getByText('Web Banner')).toBeTruthy();
      expect(getByText('Web Overlay')).toBeTruthy();
      expect(getByText('Web Notices')).toBeTruthy();
    });
  });

  describe('Module exports', () => {
    it('should export AuthFrame from index', () => {
      // eslint-disable-next-line import/no-unresolved
      const AuthFrameIndex = require('@platform/layouts/AuthFrame');
      expect(AuthFrameIndex.default).toBeDefined();
    });

    it('should export FRAME_SLOTS from types.js', () => {
      // eslint-disable-next-line import/no-unresolved
      const { FRAME_SLOTS } = require('@platform/layouts/AuthFrame/types');
      expect(FRAME_SLOTS).toBeDefined();
      expect(FRAME_SLOTS.HEADER).toBe('header');
      expect(FRAME_SLOTS.BANNER).toBe('banner');
      expect(FRAME_SLOTS.NOTICES).toBe('notices');
      expect(FRAME_SLOTS.CONTENT).toBe('content');
    });
  });
});
