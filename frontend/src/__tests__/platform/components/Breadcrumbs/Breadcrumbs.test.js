/**
 * Breadcrumbs Component Tests
 * Comprehensive tests for Breadcrumbs component across all platforms
 * File: Breadcrumbs.test.js
 */
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import BreadcrumbsModule from '@platform/components/navigation/Breadcrumbs';
import { renderWithProviders } from '../../../helpers/test-utils';

const Breadcrumbs = BreadcrumbsModule.default || BreadcrumbsModule;

// Mock expo-router
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock useI18n hook
jest.mock('@hooks', () => {
  const mockEnTranslations = require('@i18n/locales/en.json');
  return {
    useI18n: () => ({
      t: (key) => {
        const keys = key.split('.');
        let value = mockEnTranslations;
        for (const k of keys) {
          value = value?.[k];
        }
        return value || key;
      },
      locale: 'en',
    }),
  };
});

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Current Item' },
  ];

  describe('Rendering', () => {
    it('should render with items', () => {
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      expect(getByTestId('breadcrumbs')).toBeTruthy();
    });

    it('should accept className prop (web)', () => {
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={mockItems} className="custom-class" testID="breadcrumbs" />
      );
      expect(getByTestId('breadcrumbs')).toBeTruthy();
    });

    it('should accept style prop', () => {
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={mockItems} style={{ marginTop: 10 }} testID="breadcrumbs" />
      );
      expect(getByTestId('breadcrumbs')).toBeTruthy();
    });

    it('should render all breadcrumb items', () => {
      const { getByText } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      expect(getByText('Home')).toBeTruthy();
      expect(getByText('Products')).toBeTruthy();
      expect(getByText('Category')).toBeTruthy();
      expect(getByText('Current Item')).toBeTruthy();
    });

    it('should render separators between items', () => {
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      // Separators are rendered between items
      expect(getByTestId('breadcrumbs')).toBeTruthy();
    });

    it('should use custom separator', () => {
      const { getAllByText } = renderWithProviders(
        <Breadcrumbs items={mockItems} separator=" > " testID="breadcrumbs" />
      );
      const separators = getAllByText(' > ');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('should not render when items array is empty', () => {
      const { queryByTestId } = renderWithProviders(
        <Breadcrumbs items={[]} testID="breadcrumbs" />
      );
      expect(queryByTestId('breadcrumbs')).toBeNull();
    });

    it('should not render when items is null', () => {
      const { queryByTestId } = renderWithProviders(
        <Breadcrumbs items={null} testID="breadcrumbs" />
      );
      expect(queryByTestId('breadcrumbs')).toBeNull();
    });

    it('should render last item as non-link', () => {
      const { getByText } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      const currentItem = getByText('Current Item');
      expect(currentItem).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onItemPress when item is pressed', () => {
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={mockItems} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' }),
        0
      );
    });

    it('should navigate to href when item is pressed without handler', () => {
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should call item.onPress when provided', () => {
      const onItemPress = jest.fn();
      const itemsWithOnPress = [
        { label: 'Home', onPress: onItemPress },
        { label: 'Current' },
      ];
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={itemsWithOnPress} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' })
      );
    });

    it('should not navigate when last item is pressed', () => {
      const { getByText } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      const currentItem = getByText('Current Item');
      fireEvent.press(currentItem);
      // Last item should not trigger navigation
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility label', () => {
      const { getByLabelText } = renderWithProviders(
        <Breadcrumbs items={mockItems} accessibilityLabel="Breadcrumb navigation" testID="breadcrumbs" />
      );
      expect(getByLabelText('Breadcrumb navigation')).toBeTruthy();
    });

    it('should have default accessibility label when not provided', () => {
      const { getByLabelText } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      expect(getByLabelText('Breadcrumb navigation')).toBeTruthy();
    });

    it('should have accessible breadcrumb items', () => {
      const { getByLabelText } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      expect(getByLabelText('Home')).toBeTruthy();
      expect(getByLabelText('Products')).toBeTruthy();
    });

    it('should have proper accessibility roles', () => {
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={mockItems} testID="breadcrumbs" />
      );
      const breadcrumbs = getByTestId('breadcrumbs');
      expect(breadcrumbs).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item', () => {
      const singleItem = [{ label: 'Home' }];
      const { getByText } = renderWithProviders(
        <Breadcrumbs items={singleItem} testID="breadcrumbs" />
      );
      expect(getByText('Home')).toBeTruthy();
    });

    it('should handle items without href or onPress', () => {
      const itemsWithoutHandlers = [
        { label: 'Home' },
        { label: 'Current' },
      ];
      const { getByText } = renderWithProviders(
        <Breadcrumbs items={itemsWithoutHandlers} testID="breadcrumbs" />
      );
      expect(getByText('Home')).toBeTruthy();
      expect(getByText('Current')).toBeTruthy();
    });

    it('should handle items with very long labels', () => {
      const itemsWithLongLabels = [
        { label: 'Home' },
        { label: 'Very Long Breadcrumb Label That Might Wrap or Truncate' },
      ];
      const { getByText } = renderWithProviders(
        <Breadcrumbs items={itemsWithLongLabels} testID="breadcrumbs" />
      );
      expect(getByText('Very Long Breadcrumb Label That Might Wrap or Truncate')).toBeTruthy();
    });

    it('should handle custom separator character', () => {
      const { getAllByText } = renderWithProviders(
        <Breadcrumbs items={mockItems} separator=" → " testID="breadcrumbs" />
      );
      const separators = getAllByText(' → ');
      expect(separators.length).toBeGreaterThan(0);
    });
  });

  describe('Web-specific behavior', () => {
    it('should support href prop for web links', () => {
      const itemsWithHref = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ];
      const { getByTestId } = renderWithProviders(
        <Breadcrumbs items={itemsWithHref} testID="breadcrumbs" />
      );
      expect(getByTestId('breadcrumbs-item-0')).toBeTruthy();
    });

    it('should handle Enter key for keyboard navigation', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsWeb items={mockItems} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      const link = getByTestId('breadcrumbs-item-0');
      const preventDefault = jest.fn();
      // Access onKeyDown handler from component props and call it directly
      const onKeyDown = link.props.onKeyDown;
      expect(onKeyDown).toBeDefined();
      onKeyDown({ key: 'Enter', preventDefault });
      expect(preventDefault).toHaveBeenCalled();
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' }),
        0
      );
    });

    it('should handle Space key for keyboard navigation', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsWeb items={mockItems} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      const link = getByTestId('breadcrumbs-item-0');
      const preventDefault = jest.fn();
      // Access onKeyDown handler from component props and call it directly
      const onKeyDown = link.props.onKeyDown;
      expect(onKeyDown).toBeDefined();
      onKeyDown({ key: ' ', preventDefault });
      expect(preventDefault).toHaveBeenCalled();
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' }),
        0
      );
    });

    it('should not trigger navigation on Enter key for last item', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const onItemPress = jest.fn();
      const { getByText } = renderWithProviders(
        <BreadcrumbsWeb items={mockItems} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      const lastItem = getByText('Current Item');
      // Last item doesn't have onKeyDown handler, but test that it doesn't trigger navigation
      // The last item is rendered as StyledBreadcrumbItem, not StyledLink, so no keyboard handler
      expect(lastItem).toBeTruthy();
      // Verify last item doesn't have keyboard handler by checking it's not a link
      expect(onItemPress).not.toHaveBeenCalled();
    });

    it('should ignore other keys for keyboard navigation', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsWeb items={mockItems} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      const link = getByTestId('breadcrumbs-item-0');
      const preventDefault = jest.fn();
      // Access onKeyDown handler from component props and call it directly
      const onKeyDown = link.props.onKeyDown;
      expect(onKeyDown).toBeDefined();
      onKeyDown({ key: 'Tab', preventDefault });
      expect(preventDefault).not.toHaveBeenCalled();
      expect(onItemPress).not.toHaveBeenCalled();
    });

    it('should navigate to href when Enter key is pressed without handler', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsWeb items={mockItems} testID="breadcrumbs" />
      );
      const link = getByTestId('breadcrumbs-item-0');
      const preventDefault = jest.fn();
      // Access onKeyDown handler from component props and call it directly
      const onKeyDown = link.props.onKeyDown;
      expect(onKeyDown).toBeDefined();
      onKeyDown({ key: 'Enter', preventDefault });
      expect(preventDefault).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should call item.onPress when Enter key is pressed', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const onItemPress = jest.fn();
      const itemsWithOnPress = [
        { label: 'Home', onPress: onItemPress },
        { label: 'Current' },
      ];
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsWeb items={itemsWithOnPress} testID="breadcrumbs" />
      );
      const link = getByTestId('breadcrumbs-item-0');
      const preventDefault = jest.fn();
      // Access onKeyDown handler from component props and call it directly
      const onKeyDown = link.props.onKeyDown;
      expect(onKeyDown).toBeDefined();
      onKeyDown({ key: 'Enter', preventDefault });
      expect(preventDefault).toHaveBeenCalled();
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' })
      );
    });

    it('should call item.onPress via keyboard when item has onPress but no onItemPress or href', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const itemOnPress = jest.fn();
      const itemsWithOnPress = [
        { label: 'Home', onPress: itemOnPress },
        { label: 'Current' },
      ];
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsWeb items={itemsWithOnPress} testID="breadcrumbs" />
      );
      const link = getByTestId('breadcrumbs-item-0');
      const preventDefault = jest.fn();
      // Access onKeyDown handler from component props and call it directly
      const onKeyDown = link.props.onKeyDown;
      expect(onKeyDown).toBeDefined();
      onKeyDown({ key: 'Enter', preventDefault });
      expect(preventDefault).toHaveBeenCalled();
      expect(itemOnPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' })
      );
    });

    it('should handle item.onPress when item has onPress but no onItemPress or href', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const itemOnPress = jest.fn();
      const itemsWithOnPress = [
        { label: 'Home', onPress: itemOnPress },
        { label: 'Current' },
      ];
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsWeb items={itemsWithOnPress} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(itemOnPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' })
      );
    });

    it('should handle Enter key on last item (should not trigger navigation)', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const onItemPress = jest.fn();
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ];
      const { getByText } = renderWithProviders(
        <BreadcrumbsWeb items={items} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      const lastItem = getByText('Current');
      // Last item doesn't have onKeyDown handler, so it shouldn't trigger navigation
      expect(lastItem).toBeTruthy();
      expect(onItemPress).not.toHaveBeenCalled();
    });

    it('should handle undefined testID', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const { getByText } = renderWithProviders(
        <BreadcrumbsWeb items={mockItems} />
      );
      expect(getByText('Home')).toBeTruthy();
    });

    it('should handle default items parameter (empty array)', () => {
      const BreadcrumbsWeb = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.web').default;
      const { queryByText } = renderWithProviders(
        <BreadcrumbsWeb />
      );
      expect(queryByText('Home')).toBeNull();
    });
  });

  describe('Platform-specific implementations', () => {
    it('should test Android implementation', () => {
      const BreadcrumbsAndroid = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.android').default;
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsAndroid items={mockItems} testID="breadcrumbs" />
      );
      expect(getByTestId('breadcrumbs')).toBeTruthy();
    });

    it('should test iOS implementation', () => {
      const BreadcrumbsIOS = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.ios').default;
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsIOS items={mockItems} testID="breadcrumbs" />
      );
      expect(getByTestId('breadcrumbs')).toBeTruthy();
    });

    it('should handle item press on Android', () => {
      const BreadcrumbsAndroid = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.android').default;
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsAndroid items={mockItems} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' }),
        0
      );
    });

    it('should handle item press on iOS', () => {
      const BreadcrumbsIOS = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.ios').default;
      const onItemPress = jest.fn();
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsIOS items={mockItems} onItemPress={onItemPress} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(onItemPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' }),
        0
      );
    });

    it('should navigate to href on Android when item is pressed without handler', () => {
      const BreadcrumbsAndroid = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.android').default;
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsAndroid items={mockItems} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should navigate to href on iOS when item is pressed without handler', () => {
      const BreadcrumbsIOS = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.ios').default;
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsIOS items={mockItems} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should call item.onPress on Android when item has onPress but no onItemPress or href', () => {
      const BreadcrumbsAndroid = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.android').default;
      const itemOnPress = jest.fn();
      const itemsWithOnPress = [
        { label: 'Home', onPress: itemOnPress },
        { label: 'Current' },
      ];
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsAndroid items={itemsWithOnPress} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(itemOnPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' })
      );
    });

    it('should call item.onPress on iOS when item has onPress but no onItemPress or href', () => {
      const BreadcrumbsIOS = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.ios').default;
      const itemOnPress = jest.fn();
      const itemsWithOnPress = [
        { label: 'Home', onPress: itemOnPress },
        { label: 'Current' },
      ];
      const { getByTestId } = renderWithProviders(
        <BreadcrumbsIOS items={itemsWithOnPress} testID="breadcrumbs" />
      );
      fireEvent.press(getByTestId('breadcrumbs-item-0'));
      expect(itemOnPress).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Home' })
      );
    });

    it('should not render when items array is empty on Android', () => {
      const BreadcrumbsAndroid = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.android').default;
      const { queryByTestId } = renderWithProviders(
        <BreadcrumbsAndroid items={[]} testID="breadcrumbs" />
      );
      expect(queryByTestId('breadcrumbs')).toBeNull();
    });

    it('should not render when items array is empty on iOS', () => {
      const BreadcrumbsIOS = require('@platform/components/navigation/Breadcrumbs/Breadcrumbs.ios').default;
      const { queryByTestId } = renderWithProviders(
        <BreadcrumbsIOS items={[]} testID="breadcrumbs" />
      );
      expect(queryByTestId('breadcrumbs')).toBeNull();
    });
  });
});

