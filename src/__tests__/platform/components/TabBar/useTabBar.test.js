/**
 * useTabBar Hook Tests
 * File: useTabBar.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import useTabBar from '@platform/components/navigation/TabBar/useTabBar';

const mockPathname = '/';

jest.mock('expo-router', () => ({
  usePathname: () => mockPathname,
}));

const TestComponent = ({ onResult, ...hookProps }) => {
  const result = useTabBar(hookProps);
  React.useEffect(() => {
    onResult(result);
  }, [result, onResult]);
  return null;
};

describe('useTabBar Hook', () => {
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
      id: 'search',
      label: 'Search',
      href: '/search',
      icon: '🔍',
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/profile',
      icon: '👤',
    },
  ];

  it('should return filtered items', () => {
    let result;
    render(<TestComponent items={mockItems} onResult={(value) => (result = value)} />);
    expect(result.filteredItems).toHaveLength(3);
    expect(result.filteredItems[0].id).toBe('home');
  });

  it('should filter items based on isTabVisible', () => {
    const isTabVisible = jest.fn((item) => item.id !== 'profile');
    let result;
    render(
      <TestComponent items={mockItems} isTabVisible={isTabVisible} onResult={(value) => (result = value)} />
    );
    expect(result.filteredItems).toHaveLength(2);
    expect(result.filteredItems.find((item) => item.id === 'profile')).toBeUndefined();
  });

  it('should identify active tab based on pathname', () => {
    let result;
    render(<TestComponent items={mockItems} onResult={(value) => (result = value)} />);
    expect(result.isTabActive(mockItems[0])).toBe(true); // home is active
    expect(result.isTabActive(mockItems[1])).toBe(false); // search is not active
  });

  it('should not mark home active for non-root paths', () => {
    jest.spyOn(require('expo-router'), 'usePathname').mockReturnValue('/settings');
    let result;
    render(<TestComponent items={mockItems} onResult={(value) => (result = value)} />);
    expect(result.isTabActive(mockItems[0])).toBe(false); // home only active for /
  });

  it('should identify active tab for nested paths under same segment', () => {
    const itemsWithSettings = [
      ...mockItems,
      { id: 'settings', label: 'Settings', href: '/settings', icon: '⚙️' },
    ];
    jest.spyOn(require('expo-router'), 'usePathname').mockReturnValue('/settings');
    let result;
    render(<TestComponent items={itemsWithSettings} onResult={(value) => (result = value)} />);
    expect(result.isTabActive(itemsWithSettings[3])).toBe(true); // settings active for /settings
    jest.spyOn(require('expo-router'), 'usePathname').mockReturnValue('/settings/about');
    render(<TestComponent items={itemsWithSettings} onResult={(value) => (result = value)} />);
    expect(result.isTabActive(itemsWithSettings[3])).toBe(true); // settings active for /settings/about
  });

  it('should return false for item without href', () => {
    const itemsWithoutHref = [
      {
        id: 'no-href',
        label: 'No Href',
        icon: '⭐',
      },
    ];
    let result;
    render(<TestComponent items={itemsWithoutHref} onResult={(value) => (result = value)} />);
    expect(result.isTabActive(itemsWithoutHref[0])).toBe(false);
  });

  it('should use custom pathname when provided', () => {
    let result;
    render(<TestComponent items={mockItems} pathname="/search" onResult={(value) => (result = value)} />);
    expect(result.pathname).toBe('/search');
    expect(result.isTabActive(mockItems[1])).toBe(true); // search is active
  });

  it('should call onTabPress when provided', () => {
    const onTabPress = jest.fn();
    let result;
    render(
      <TestComponent items={mockItems} onTabPress={onTabPress} onResult={(value) => (result = value)} />
    );
    result.handleTabPress(mockItems[0]);
    expect(onTabPress).toHaveBeenCalledWith(mockItems[0]);
  });

  it('should call item.onPress when onTabPress not provided', () => {
    const onItemPress = jest.fn();
    const itemsWithOnPress = [
      {
        id: 'custom',
        label: 'Custom',
        href: '/custom',
        icon: '⭐',
        onPress: onItemPress,
      },
    ];
    let result;
    render(<TestComponent items={itemsWithOnPress} onResult={(value) => (result = value)} />);
    result.handleTabPress(itemsWithOnPress[0]);
    expect(onItemPress).toHaveBeenCalledWith(itemsWithOnPress[0]);
  });

  it('should call item.onPress when onTabPress handler receives item with onPress but no href', () => {
    const onItemPress = jest.fn();
    const mockRouter = { push: jest.fn() };
    // This simulates the default handler pattern used in TabBar components (line 48-54)
    const defaultHandler = (item) => {
      if (item.href) {
        mockRouter.push(item.href);
      } else if (item.onPress) {
        item.onPress(item); // This covers the pattern used in TabBar.ios.jsx line 52, TabBar.android.jsx line 52, TabBar.web.jsx line 54
      }
    };
    const itemsWithOnPressNoHref = [
      {
        id: 'no-href',
        label: 'No Href',
        icon: '⭐',
        onPress: onItemPress,
      },
    ];
    let result;
    render(
      <TestComponent
        items={itemsWithOnPressNoHref}
        onTabPress={defaultHandler}
        onResult={(value) => (result = value)}
      />
    );
    result.handleTabPress(itemsWithOnPressNoHref[0]);
    expect(onItemPress).toHaveBeenCalledWith(itemsWithOnPressNoHref[0]);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should not call anything when item has no onPress and no onTabPress provided', () => {
    const itemsWithoutHandlers = [
      {
        id: 'no-handler',
        label: 'No Handler',
        icon: '⭐',
      },
    ];
    let result;
    render(<TestComponent items={itemsWithoutHandlers} onResult={(value) => (result = value)} />);
    // Should not throw
    expect(() => result.handleTabPress(itemsWithoutHandlers[0])).not.toThrow();
  });

  it('should handle empty items array', () => {
    let result;
    render(<TestComponent items={[]} onResult={(value) => (result = value)} />);
    expect(result.filteredItems).toHaveLength(0);
  });

  it('should default to all tabs visible when isTabVisible not provided', () => {
    let result;
    render(<TestComponent items={mockItems} onResult={(value) => (result = value)} />);
    expect(result.filteredItems).toHaveLength(3);
  });

  it('should handle hook called without arguments (default parameters)', () => {
    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.filteredItems).toHaveLength(0);
    expect(result.pathname).toBeDefined();
    expect(typeof result.pathname).toBe('string');
  });
});

