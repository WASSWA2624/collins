/**
 * GlobalFooter Component Tests
 * Tests for GlobalFooter component across all platforms
 * File: GlobalFooter.test.js
 */
import React from 'react';
import { Text } from 'react-native';
import { renderWithProviders } from '../../../helpers/test-utils';
import GlobalFooterModule, {
  ACTION_VARIANTS,
  FOOTER_VARIANTS,
} from '@platform/components/navigation/GlobalFooter';

const GlobalFooter = GlobalFooterModule.default || GlobalFooterModule;

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 16,
    left: 0,
    right: 0,
  }),
}));

describe('GlobalFooter Component', () => {
  it('should render default status for main variant', () => {
    const { getByText } = renderWithProviders(
      <GlobalFooter variant={FOOTER_VARIANTS.MAIN} testID="global-footer" />
    );
    expect(getByText('navigation.footer.status.main')).toBeTruthy();
  });

  it('should render custom status node', () => {
    const { getByText } = renderWithProviders(
      <GlobalFooter status={<Text>Custom Status</Text>} testID="global-footer" />
    );
    expect(getByText('Custom Status')).toBeTruthy();
  });

  it('should filter legal links and quick actions by role', () => {
    const legalLinks = [
      { key: 'terms', label: 'Terms', roles: ['admin'], onPress: jest.fn() },
      { key: 'privacy', label: 'Privacy', roles: ['user'], onPress: jest.fn() },
    ];
    const quickActions = [
      {
        key: 'support',
        label: 'Support',
        roles: ['admin'],
        onPress: jest.fn(),
        variant: ACTION_VARIANTS.PRIMARY,
      },
      {
        key: 'feedback',
        label: 'Feedback',
        roles: ['user'],
        onPress: jest.fn(),
      },
    ];

    const { getByTestId, queryByTestId } = renderWithProviders(
      <GlobalFooter
        legalLinks={legalLinks}
        quickActions={quickActions}
        currentRole="admin"
        testID="global-footer"
      />
    );

    expect(getByTestId('global-footer-legal-terms')).toBeTruthy();
    expect(queryByTestId('global-footer-legal-privacy')).toBeNull();
    expect(getByTestId('global-footer-action-support')).toBeTruthy();
    expect(queryByTestId('global-footer-action-feedback')).toBeNull();
  });

  it('should render quick actions slot when provided', () => {
    const { getByText } = renderWithProviders(
      <GlobalFooter quickActionsSlot={<Text>Footer Slot</Text>} testID="global-footer" />
    );
    expect(getByText('Footer Slot')).toBeTruthy();
  });

  describe('Platform-specific rendering', () => {
    it('should render Android variant', () => {
      // eslint-disable-next-line import/no-unresolved
      const GlobalFooterAndroid = require('@platform/components/navigation/GlobalFooter/GlobalFooter.android').default;
      const { getByTestId } = renderWithProviders(
        <GlobalFooterAndroid variant={FOOTER_VARIANTS.MAIN} testID="global-footer-android" />
      );
      expect(getByTestId('global-footer-android')).toBeTruthy();
    });

    it('should render iOS variant', () => {
      // eslint-disable-next-line import/no-unresolved
      const GlobalFooterIOS = require('@platform/components/navigation/GlobalFooter/GlobalFooter.ios').default;
      const { getByTestId } = renderWithProviders(
        <GlobalFooterIOS variant={FOOTER_VARIANTS.MAIN} testID="global-footer-ios" />
      );
      expect(getByTestId('global-footer-ios')).toBeTruthy();
    });

    it('should render Web variant', () => {
      // eslint-disable-next-line import/no-unresolved
      const GlobalFooterWeb = require('@platform/components/navigation/GlobalFooter/GlobalFooter.web').default;
      const { getByTestId } = renderWithProviders(
        <GlobalFooterWeb variant={FOOTER_VARIANTS.MAIN} testID="global-footer-web" />
      );
      expect(getByTestId('global-footer-web')).toBeTruthy();
    });
  });
});
