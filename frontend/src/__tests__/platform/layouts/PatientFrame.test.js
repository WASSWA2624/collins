/**
 * PatientFrame Component Tests
 * File: PatientFrame.test.js
 */

import React from 'react';
import { Text } from 'react-native';
import PatientFrame from '@platform/layouts/PatientFrame';
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

describe('PatientFrame Component', () => {
  it('should render children', () => {
    const { getByText } = renderWithTheme(
      <PatientFrame>
        <Text>Patient Content</Text>
      </PatientFrame>
    );
    expect(getByText('Patient Content')).toBeTruthy();
  });

  it('should render header, footer, breadcrumbs, banner, and overlay', () => {
    const { getByText } = renderWithTheme(
      <PatientFrame
        header={<Text>Header</Text>}
        footer={<Text>Footer</Text>}
        breadcrumbs={<Text>Breadcrumbs</Text>}
        banner={<Text>Banner</Text>}
        overlay={<Text>Overlay</Text>}
        notices={<Text>Notices</Text>}
      >
        <Text>Patient Content</Text>
      </PatientFrame>
    );
    expect(getByText('Header')).toBeTruthy();
    expect(getByText('Footer')).toBeTruthy();
    expect(getByText('Breadcrumbs')).toBeTruthy();
    expect(getByText('Banner')).toBeTruthy();
    expect(getByText('Overlay')).toBeTruthy();
    expect(getByText('Notices')).toBeTruthy();
    expect(getByText('Patient Content')).toBeTruthy();
  });

  it('should accept accessibility label', () => {
    const { getByLabelText } = renderWithTheme(
      <PatientFrame accessibilityLabel="Patient Area">
        <Text>Content</Text>
      </PatientFrame>
    );
    expect(getByLabelText('Patient Area')).toBeTruthy();
  });

  describe('Platform-specific rendering', () => {
    it('should render Android PatientFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const PatientFrameAndroid = require('@platform/layouts/PatientFrame/PatientFrame.android').default;
      const { getByText } = renderWithTheme(
        <PatientFrameAndroid
          header={<Text>Android Header</Text>}
          footer={<Text>Android Footer</Text>}
          sidebar={<Text>Android Sidebar</Text>}
          breadcrumbs={<Text>Android Breadcrumbs</Text>}
          banner={<Text>Android Banner</Text>}
          overlay={<Text>Android Overlay</Text>}
          notices={<Text>Android Notices</Text>}
        >
          <Text>Android Patient</Text>
        </PatientFrameAndroid>
      );
      expect(getByText('Android Patient')).toBeTruthy();
      expect(getByText('Android Header')).toBeTruthy();
      expect(getByText('Android Footer')).toBeTruthy();
      expect(getByText('Android Breadcrumbs')).toBeTruthy();
      expect(getByText('Android Banner')).toBeTruthy();
      expect(getByText('Android Overlay')).toBeTruthy();
      expect(getByText('Android Notices')).toBeTruthy();
    });

    it('should render iOS PatientFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const PatientFrameIOS = require('@platform/layouts/PatientFrame/PatientFrame.ios').default;
      const { getByText } = renderWithTheme(
        <PatientFrameIOS
          header={<Text>iOS Header</Text>}
          footer={<Text>iOS Footer</Text>}
          sidebar={<Text>iOS Sidebar</Text>}
          breadcrumbs={<Text>iOS Breadcrumbs</Text>}
          banner={<Text>iOS Banner</Text>}
          overlay={<Text>iOS Overlay</Text>}
          notices={<Text>iOS Notices</Text>}
        >
          <Text>iOS Patient</Text>
        </PatientFrameIOS>
      );
      expect(getByText('iOS Patient')).toBeTruthy();
      expect(getByText('iOS Header')).toBeTruthy();
      expect(getByText('iOS Footer')).toBeTruthy();
      expect(getByText('iOS Breadcrumbs')).toBeTruthy();
      expect(getByText('iOS Banner')).toBeTruthy();
      expect(getByText('iOS Overlay')).toBeTruthy();
      expect(getByText('iOS Notices')).toBeTruthy();
    });

    it('should render Web PatientFrame', () => {
      // eslint-disable-next-line import/no-unresolved
      const PatientFrameWeb = require('@platform/layouts/PatientFrame/PatientFrame.web').default;
      const { getByText } = renderWithTheme(
        <PatientFrameWeb
          header={<Text>Web Header</Text>}
          footer={<Text>Web Footer</Text>}
          sidebar={<Text>Web Sidebar</Text>}
          breadcrumbs={<Text>Web Breadcrumbs</Text>}
          banner={<Text>Web Banner</Text>}
          overlay={<Text>Web Overlay</Text>}
          notices={<Text>Web Notices</Text>}
        >
          <Text>Web Patient</Text>
        </PatientFrameWeb>
      );
      expect(getByText('Web Patient')).toBeTruthy();
      expect(getByText('Web Header')).toBeTruthy();
      expect(getByText('Web Footer')).toBeTruthy();
      expect(getByText('Web Breadcrumbs')).toBeTruthy();
      expect(getByText('Web Banner')).toBeTruthy();
      expect(getByText('Web Overlay')).toBeTruthy();
      expect(getByText('Web Notices')).toBeTruthy();
    });
  });

  describe('Module exports', () => {
    it('should export PatientFrame from index', () => {
      // eslint-disable-next-line import/no-unresolved
      const PatientFrameIndex = require('@platform/layouts/PatientFrame');
      expect(PatientFrameIndex.default).toBeDefined();
    });

    it('should export FRAME_SLOTS from types.js', () => {
      // eslint-disable-next-line import/no-unresolved
      const { FRAME_SLOTS } = require('@platform/layouts/PatientFrame/types');
      expect(FRAME_SLOTS).toBeDefined();
      expect(FRAME_SLOTS.HEADER).toBe('header');
      expect(FRAME_SLOTS.BANNER).toBe('banner');
      expect(FRAME_SLOTS.NOTICES).toBe('notices');
      expect(FRAME_SLOTS.CONTENT).toBe('content');
    });
  });
});
