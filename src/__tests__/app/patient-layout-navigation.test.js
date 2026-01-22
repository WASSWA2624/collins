/**
 * Patient Layout Navigation Tests
 *
 * Tests for patient layout navigation integration:
 * - Navigation components render correctly across platforms
 * - Slot renders for child routes
 * - Accessibility props are wired
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import PatientRouteLayoutWeb from '@platform/layouts/route-layouts/PatientRouteLayout/PatientRouteLayout.web';
import PatientRouteLayoutAndroid from '@platform/layouts/route-layouts/PatientRouteLayout/PatientRouteLayout.android';
import PatientRouteLayoutIOS from '@platform/layouts/route-layouts/PatientRouteLayout/PatientRouteLayout.ios';
import { useAuth } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { GlobalHeader, TabBar, Sidebar } from '@platform/components';

const mockEnTranslations = require('@i18n/locales/en.json');

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
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
  usePrimaryNavigation: () => ({
    mainItems: [
      { id: 'home', label: 'Home', href: '/home' },
    ],
    patientItems: [
      { id: 'home', label: 'Home', href: '/' },
    ],
    isItemVisible: jest.fn(() => true),
  }),
  useShellBanners: () => [],
  useUiState: () => ({ isLoading: false }),
}));

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
}));

jest.mock('@platform/components', () => ({
  GlobalHeader: jest.fn(({ accessibilityLabel, testID, ...props }) => (
    <div data-testid={testID} aria-label={accessibilityLabel} {...props}>
      Mock GlobalHeader
    </div>
  )),
  LanguageControls: jest.fn(({ testID, ...props }) => (
    <div data-testid={testID} {...props}>
      Mock LanguageControls
    </div>
  )),
  ThemeControls: jest.fn(({ testID, ...props }) => (
    <div data-testid={testID} {...props}>
      Mock ThemeControls
    </div>
  )),
  TabBar: jest.fn(({ accessibilityLabel, testID, ...props }) => (
    <div data-testid={testID} aria-label={accessibilityLabel} {...props}>
      Mock TabBar
    </div>
  )),
  Sidebar: jest.fn(({ accessibilityLabel, testID, ...props }) => (
    <div data-testid={testID} aria-label={accessibilityLabel} {...props}>
      Mock Sidebar
    </div>
  )),
  ShellBanners: jest.fn(({ testID, ...props }) => (
    <div data-testid={testID} {...props}>
      Mock ShellBanners
    </div>
  )),
  LoadingOverlay: jest.fn(({ testID, ...props }) => (
    <div data-testid={testID} {...props}>
      Mock LoadingOverlay
    </div>
  )),
  NoticeSurface: jest.fn(({ testID, ...props }) => (
    <div data-testid={testID} {...props}>
      Mock NoticeSurface
    </div>
  )),
}));

jest.mock('@platform/layouts', () => {
  const React = require('react');
  return {
    PatientFrame: jest.fn(({ children, header, footer, sidebar, ...props }) => (
      <div data-testid="patient-frame" {...props}>
        {header}
        {sidebar}
        {children}
        {footer}
      </div>
    )),
  };
});

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  Slot: ({ children, testID }) => (
    <div data-testid={testID || 'slot'} testID={testID || 'slot'}>
      {children || 'Mock Slot'}
    </div>
  ),
}));

describe('PatientLayout with Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn() });
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: 'patient-1', role: 'patient' },
    });
  });

  it('renders Sidebar and GlobalHeader on web', () => {
    const { getByTestId } = render(<PatientRouteLayoutWeb />);
    expect(Sidebar).toHaveBeenCalled();
    expect(GlobalHeader).toHaveBeenCalled();
    expect(getByTestId('slot')).toBeDefined();
  });

  it('passes logout action when authenticated on web', () => {
    render(<PatientRouteLayoutWeb />);
    const headerCall = GlobalHeader.mock.calls[0];
    const actionIds = headerCall[0].actions.map((action) => action.id);
    expect(actionIds).toContain('logout');
    expect(actionIds).not.toContain('login');
    expect(actionIds).not.toContain('register');
  });

  it('renders TabBar and GlobalHeader on Android', () => {
    const { getByTestId } = render(<PatientRouteLayoutAndroid />);
    expect(TabBar).toHaveBeenCalled();
    expect(GlobalHeader).toHaveBeenCalled();
    expect(getByTestId('slot')).toBeDefined();
  });

  it('passes logout action when authenticated on Android', () => {
    render(<PatientRouteLayoutAndroid />);
    const headerCall = GlobalHeader.mock.calls[0];
    const actionIds = headerCall[0].actions.map((action) => action.id);
    expect(actionIds).toContain('logout');
    expect(actionIds).not.toContain('login');
    expect(actionIds).not.toContain('register');
  });

  it('renders TabBar and GlobalHeader on iOS', () => {
    const { getByTestId } = render(<PatientRouteLayoutIOS />);
    expect(TabBar).toHaveBeenCalled();
    expect(GlobalHeader).toHaveBeenCalled();
    expect(getByTestId('slot')).toBeDefined();
  });

  it('passes logout action when authenticated on iOS', () => {
    render(<PatientRouteLayoutIOS />);
    const headerCall = GlobalHeader.mock.calls[0];
    const actionIds = headerCall[0].actions.map((action) => action.id);
    expect(actionIds).toContain('logout');
    expect(actionIds).not.toContain('login');
    expect(actionIds).not.toContain('register');
  });

  it('passes accessibility labels to header and sidebar', () => {
    render(<PatientRouteLayoutWeb />);
    const headerCall = GlobalHeader.mock.calls[0];
    const sidebarCall = Sidebar.mock.calls[0];
    expect(headerCall[0]).toMatchObject({
      accessibilityLabel: mockEnTranslations.navigation.header.title,
      testID: 'patient-header',
    });
    expect(sidebarCall[0]).toMatchObject({
      accessibilityLabel: mockEnTranslations.navigation.sidebar.title,
      testID: 'patient-sidebar',
    });
  });

  it('calls useAuthGuard for patient routes', () => {
    render(<PatientRouteLayoutIOS />);
    expect(useAuthGuard).toHaveBeenCalled();
  });
});
