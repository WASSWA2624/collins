/**
 * GlobalHeader Component Tests
 * Tests for GlobalHeader component across all platforms
 * File: GlobalHeader.test.js
 */
import React from 'react';
import { Text } from 'react-native';
import { renderWithProviders } from '../../../helpers/test-utils';
import GlobalHeaderModule, {
  ACTION_PLACEMENTS,
  ACTION_VARIANTS,
} from '@platform/components/navigation/GlobalHeader';

const GlobalHeader = GlobalHeaderModule.default || GlobalHeaderModule;

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 12,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

describe('GlobalHeader Component', () => {
  const actions = [
    {
      key: 'export',
      label: 'Export',
      onPress: jest.fn(),
      roles: ['admin'],
      variant: ACTION_VARIANTS.PRIMARY,
    },
    {
      key: 'refresh',
      label: 'Refresh',
      onPress: jest.fn(),
      roles: ['user'],
    },
    {
      key: 'filter',
      label: 'Filter',
      onPress: jest.fn(),
      placement: ACTION_PLACEMENTS.SECONDARY,
      icon: <Text>+</Text>,
    },
  ];

  it('should render title and subtitle', () => {
    const { getByText } = renderWithProviders(
      <GlobalHeader title="Dashboard" subtitle="Today" testID="global-header" />
    );
    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('Today')).toBeTruthy();
  });

  it('should render custom title node', () => {
    const { getByText } = renderWithProviders(
      <GlobalHeader title={<Text>Custom Title</Text>} testID="global-header" />
    );
    expect(getByText('Custom Title')).toBeTruthy();
  });

  it('should filter actions by current role', () => {
    const { getByTestId, queryByTestId } = renderWithProviders(
      <GlobalHeader actions={actions} currentRole="admin" testID="global-header" />
    );
    expect(getByTestId('global-header-action-export')).toBeTruthy();
    expect(getByTestId('global-header-action-filter')).toBeTruthy();
    expect(queryByTestId('global-header-action-refresh')).toBeNull();
  });

  it('should render action without label safely', () => {
    const labelLessActions = [
      { key: 'icon-only', onPress: jest.fn(), icon: <Text>*</Text> },
    ];
    const { getByTestId } = renderWithProviders(
      <GlobalHeader actions={labelLessActions} testID="global-header" />
    );
    expect(getByTestId('global-header-action-icon-only')).toBeTruthy();
  });

  it('should render utility slot content', () => {
    const { getByText } = renderWithProviders(
      <GlobalHeader
        title="Dashboard"
        utilitySlot={<Text>Theme Controls</Text>}
        testID="global-header"
      />
    );
    expect(getByText('Theme Controls')).toBeTruthy();
  });

  it('should render breadcrumbs when provided', () => {
    const { getByTestId } = renderWithProviders(
      <GlobalHeader
        title="Dashboard"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        testID="global-header"
      />
    );
    expect(getByTestId('global-header-breadcrumbs')).toBeTruthy();
  });

  describe('Platform-specific rendering', () => {
    it('should render Android variant', () => {
      // eslint-disable-next-line import/no-unresolved
      const GlobalHeaderAndroid = require('@platform/components/navigation/GlobalHeader/GlobalHeader.android').default;
      const { getByTestId } = renderWithProviders(
        <GlobalHeaderAndroid title="Android" testID="global-header-android" />
      );
      expect(getByTestId('global-header-android')).toBeTruthy();
    });

    it('should render iOS variant', () => {
      // eslint-disable-next-line import/no-unresolved
      const GlobalHeaderIOS = require('@platform/components/navigation/GlobalHeader/GlobalHeader.ios').default;
      const { getByTestId } = renderWithProviders(
        <GlobalHeaderIOS title="iOS" testID="global-header-ios" />
      );
      expect(getByTestId('global-header-ios')).toBeTruthy();
    });

    it('should render Web variant', () => {
      // eslint-disable-next-line import/no-unresolved
      const GlobalHeaderWeb = require('@platform/components/navigation/GlobalHeader/GlobalHeader.web').default;
      const { getByTestId } = renderWithProviders(
        <GlobalHeaderWeb title="Web" testID="global-header-web" />
      );
      expect(getByTestId('global-header-web')).toBeTruthy();
    });
  });
});
