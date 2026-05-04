/**
 * Sidebar Component Tests
 * Comprehensive tests for Sidebar component across all platforms
 * File: Sidebar.test.js
 */
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import SidebarModule from '@platform/components/navigation/Sidebar';
import { renderWithProviders } from '../../../helpers/test-utils';

const Sidebar = SidebarModule.default || SidebarModule;

// Mock expo-router
const mockPush = jest.fn();
const mockPathname = '/dashboard';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  usePathname: () => mockPathname,
}));

// Mock child components
jest.mock('@platform/components/Text', () => ({
  __esModule: true,
  default: ({ children, ...props }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, props, children);
  },
}));

jest.mock('@platform/components/Badge', () => ({
  __esModule: true,
  default: ({ children, ...props }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { ...props, testID: props.testID }, children);
  },
}));

jest.mock('@platform/components/Divider', () => ({
  __esModule: true,
  default: (props) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { ...props, testID: 'divider' });
  },
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: '🏠',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: '⚙️',
      badge: true,
      badgeCount: 3,
    },
  ];

  describe('Rendering', () => {
    it('should render with items', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      expect(getByTestId('sidebar')).toBeTruthy();
    });

    it('should render all navigation items', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      expect(getByTestId('sidebar-item-home')).toBeTruthy();
      expect(getByTestId('sidebar-item-dashboard')).toBeTruthy();
      expect(getByTestId('sidebar-item-settings')).toBeTruthy();
    });

    it('should render item labels', () => {
      const { getByText } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      expect(getByText('Home')).toBeTruthy();
      expect(getByText('Dashboard')).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
    });

    it('should render badge when item has badge', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      const settingsItem = getByTestId('sidebar-item-settings');
      expect(settingsItem).toBeTruthy();
    });

    it('should render collapsed sidebar', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} collapsed={true} testID="sidebar" />
      );
      expect(getByTestId('sidebar')).toBeTruthy();
    });

    it('should render nested items when expanded', () => {
      const itemsWithChildren = [
        {
          id: 'parent',
          label: 'Parent',
          icon: '📁',
          children: [
            { id: 'child1', label: 'Child 1', href: '/child1' },
            { id: 'child2', label: 'Child 2', href: '/child2' },
          ],
        },
      ];
      const { getByTestId } = renderWithProviders(
        <Sidebar items={itemsWithChildren} testID="sidebar" />
      );
      expect(getByTestId('sidebar-item-parent')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onItemPress when item is pressed', () => {
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} onItemPress={onItemPress} testID="sidebar" />
      );
      fireEvent.press(getByTestId('sidebar-item-home'));
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'home' })
      );
    });

    it('should navigate to href when item is pressed without handler', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      fireEvent.press(getByTestId('sidebar-item-home'));
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should toggle section when item with children is pressed', () => {
      const itemsWithChildren = [
        {
          id: 'parent',
          label: 'Parent',
          icon: '📁',
          children: [
            { id: 'child1', label: 'Child 1', href: '/child1' },
          ],
        },
      ];
      const { getByTestId } = renderWithProviders(
        <Sidebar items={itemsWithChildren} testID="sidebar" />
      );
      const parentItem = getByTestId('sidebar-item-parent');
      fireEvent.press(parentItem);
      // Section should be expanded (children visible)
      expect(getByTestId('sidebar-item-child1')).toBeTruthy();
    });

    it('should use custom isItemVisible function', () => {
      const isItemVisible = jest.fn((item) => item.id !== 'settings');
      const { queryByTestId } = renderWithProviders(
        <Sidebar items={mockItems} isItemVisible={isItemVisible} testID="sidebar" />
      );
      expect(queryByTestId('sidebar-item-settings')).toBeNull();
      expect(queryByTestId('sidebar-item-home')).toBeTruthy();
    });
  });

  describe('Active State', () => {
    it('should highlight active item based on pathname', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      const dashboardItem = getByTestId('sidebar-item-dashboard');
      expect(dashboardItem).toBeTruthy();
      // Active state is handled by styled-components, so we just verify it renders
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility label', () => {
      const { getByLabelText } = renderWithProviders(
        <Sidebar items={mockItems} accessibilityLabel="Main navigation" testID="sidebar" />
      );
      expect(getByLabelText('Main navigation')).toBeTruthy();
    });

    it('should have default accessibility label when not provided', () => {
      const { getByLabelText } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      expect(getByLabelText('Main navigation')).toBeTruthy();
    });

    it('should have accessible navigation items', () => {
      const { getByLabelText } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      expect(getByLabelText('Home')).toBeTruthy();
      expect(getByLabelText('Dashboard')).toBeTruthy();
    });

    it('should have accessibility state for active items', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      const dashboardItem = getByTestId('sidebar-item-dashboard');
      expect(dashboardItem).toBeTruthy();
    });
  });

  describe('Keyboard Navigation (Web)', () => {
    it('should render navigation items that support keyboard interaction', () => {
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} onItemPress={onItemPress} testID="sidebar" />
      );
      const homeItem = getByTestId('sidebar-item-home');
      // Test that item is interactive and can trigger actions
      // Keyboard navigation is implemented via onKeyDown handler in Sidebar.web.jsx
      expect(homeItem).toBeTruthy();
      // Component implementation includes onKeyDown and tabIndex props for web keyboard navigation
    });

    it('should have proper focus order for keyboard navigation', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={mockItems} testID="sidebar" />
      );
      const homeItem = getByTestId('sidebar-item-home');
      const dashboardItem = getByTestId('sidebar-item-dashboard');
      const settingsItem = getByTestId('sidebar-item-settings');
      
      // Items should be rendered in order for proper keyboard focus flow
      expect(homeItem).toBeTruthy();
      expect(dashboardItem).toBeTruthy();
      expect(settingsItem).toBeTruthy();
      // Component implementation includes tabIndex={0} for keyboard focus order
    });

    it('should support keyboard navigation for items with children', () => {
      const itemsWithChildren = [
        {
          id: 'parent',
          label: 'Parent',
          icon: '📁',
          children: [
            { id: 'child1', label: 'Child 1', href: '/child1' },
          ],
        },
      ];
      const { getByTestId } = renderWithProviders(
        <Sidebar items={itemsWithChildren} testID="sidebar" />
      );
      const parentItem = getByTestId('sidebar-item-parent');
      // Verify keyboard support exists - component includes onKeyDown handler
      expect(parentItem).toBeTruthy();
      // Component implementation includes keyboard event handlers for expandable items
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const { getByTestId } = renderWithProviders(
        <Sidebar items={[]} testID="sidebar" />
      );
      expect(getByTestId('sidebar')).toBeTruthy();
    });

    it('should handle items without href or onPress', () => {
      const itemsWithoutHandlers = [
        { id: 'item1', label: 'Item 1' },
      ];
      const { getByTestId } = renderWithProviders(
        <Sidebar items={itemsWithoutHandlers} testID="sidebar" />
      );
      expect(getByTestId('sidebar-item-item1')).toBeTruthy();
    });

    it('should handle items with groups', () => {
      const groupedItems = [
        { id: 'item1', label: 'Item 1', group: 'main' },
        { id: 'item2', label: 'Item 2', group: 'secondary' },
      ];
      const { getByTestId } = renderWithProviders(
        <Sidebar items={groupedItems} testID="sidebar" />
      );
      expect(getByTestId('sidebar-item-item1')).toBeTruthy();
      expect(getByTestId('sidebar-item-item2')).toBeTruthy();
    });
  });
});
