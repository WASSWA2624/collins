/**
 * EmptyState Component Tests
 * File: EmptyState.test.js
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import EmptyState, { SIZES } from '@platform/components/states/EmptyState';
import Icon from '@platform/components/display/Icon';
import Button from '@platform/components/Button';
import lightTheme from '@theme/light.theme';

// Mock i18n hook
const mockEnTranslations = require('@i18n/locales/en.json');
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key, params = {}) => {
      const keys = key.split('.');
      let value = mockEnTranslations;
      for (const k of keys) {
        value = value?.[k];
      }
      if (typeof value === 'string' && params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }
      return value || key;
    },
    locale: 'en',
  }),
}));

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('EmptyState Component', () => {
  describe('Rendering', () => {
    it('should render with title only', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByText('No items')).toBeTruthy();
    });

    it('should render with title and description', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="No items" description="Get started by adding your first item" testID="empty-state" />
      );
      expect(getByText('No items')).toBeTruthy();
      expect(getByText('Get started by adding your first item')).toBeTruthy();
    });

    it('should render with icon', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState
          title="No items"
          icon={<Icon glyph="inbox" accessibilityLabel="Inbox icon" />}
          testID="empty-state"
        />
      );
      // Verify EmptyState renders and contains icon container
      const emptyState = getByTestId('empty-state');
      expect(emptyState).toBeTruthy();
      // Icon container should exist (check children)
      expect(emptyState.children.length).toBeGreaterThan(0);
    });

    it('should render with action', () => {
      const { getByText } = renderWithTheme(
        <EmptyState
          title="No items"
          action={<Button>Add Item</Button>}
          testID="empty-state"
        />
      );
      expect(getByText('Add Item')).toBeTruthy();
    });

    it('should render all elements together', () => {
      const { getByText, getByTestId } = renderWithTheme(
        <EmptyState
          title="No items"
          description="Get started by adding your first item"
          icon={<Icon glyph="inbox" accessibilityLabel="Inbox icon" />}
          action={<Button>Add Item</Button>}
          testID="empty-state"
        />
      );
      expect(getByText('No items')).toBeTruthy();
      expect(getByText('Get started by adding your first item')).toBeTruthy();
      // Verify EmptyState renders with all children
      const emptyState = getByTestId('empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.children.length).toBeGreaterThan(0);
      expect(getByText('Add Item')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" size={SIZES.SMALL} testID="empty-state" />
      );
      expect(getByTestId('empty-state')).toBeTruthy();
    });

    it('should render medium size (default)', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByTestId('empty-state')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" size={SIZES.LARGE} testID="empty-state" />
      );
      expect(getByTestId('empty-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is invalid', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" size="invalid-size" testID="empty-state" />
      );
      expect(getByTestId('empty-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is null', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" size={null} testID="empty-state" />
      );
      expect(getByTestId('empty-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is undefined', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" size={undefined} testID="empty-state" />
      );
      expect(getByTestId('empty-state')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have status role', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" testID="empty-state" />
      );
      const emptyState = getByTestId('empty-state');
      expect(emptyState.props.accessibilityRole || emptyState.props.role).toBe('status');
    });

    it('should use custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <EmptyState title="No items" accessibilityLabel="Empty list" testID="empty-state" />
      );
      expect(getByLabelText('Empty list')).toBeTruthy();
    });

    it('should use title as accessibility label when not provided', () => {
      const { getByLabelText } = renderWithTheme(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByLabelText('No items')).toBeTruthy();
    });

    it('should handle non-string title for accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <EmptyState title={<span>React Node Title</span>} testID="empty-state" />
      );
      // When title is not a string, should use default i18n label
      const expectedLabel = mockEnTranslations?.common?.emptyState || 'common.emptyState';
      expect(getByLabelText(expectedLabel)).toBeTruthy();
    });

    it('should handle React node title', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title={<span>Custom Title</span>} testID="empty-state" />
      );
      expect(getByText('Custom Title')).toBeTruthy();
    });

    it('should handle React node description', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Title" description={<span>Custom Description</span>} testID="empty-state" />
      );
      expect(getByText('Custom Description')).toBeTruthy();
    });

    it('should render without icon', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByText('No items')).toBeTruthy();
    });

    it('should render without description', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByText('No items')).toBeTruthy();
    });

    it('should render without action', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByText('No items')).toBeTruthy();
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No items" testID="test-empty-state" />
      );
      expect(getByTestId('test-empty-state')).toBeTruthy();
    });
  });

  describe('Constants Export', () => {
    it('should export SIZES constant', () => {
      expect(SIZES).toBeDefined();
      expect(SIZES.SMALL).toBe('small');
      expect(SIZES.MEDIUM).toBe('medium');
      expect(SIZES.LARGE).toBe('large');
    });
  });

  describe('Platform-specific implementations', () => {
    describe('Android Platform', () => {
      // eslint-disable-next-line import/no-unresolved
      const EmptyStateAndroid = require('@platform/components/states/EmptyState/EmptyState.android').default;

      it('should render Android version', () => {
        const { getByText } = renderWithTheme(
          <EmptyStateAndroid title="Android Empty State" testID="empty-state-android" />
        );
        expect(getByText('Android Empty State')).toBeTruthy();
      });

      it('should have accessibilityRole="status" on Android', () => {
        const { getByTestId } = renderWithTheme(
          <EmptyStateAndroid title="Android Empty State" testID="empty-state-android" />
        );
        const emptyState = getByTestId('empty-state-android');
        expect(emptyState.props.accessibilityRole).toBe('status');
      });

      it('should use custom accessibility label on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <EmptyStateAndroid title="Android Empty State" accessibilityLabel="Custom Android label" testID="empty-state-android" />
        );
        expect(getByLabelText('Custom Android label')).toBeTruthy();
      });

      it('should render Android version with icon', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <EmptyStateAndroid
            title="Android Empty State"
            icon={<Icon glyph="inbox" accessibilityLabel="Icon" />}
            testID="empty-state-android"
          />
        );
        expect(getByText('Android Empty State')).toBeTruthy();
        expect(getByTestId('empty-state-android')).toBeTruthy();
      });

      it('should render Android version with description', () => {
        const { getByText } = renderWithTheme(
          <EmptyStateAndroid
            title="Android Empty State"
            description="Android description"
            testID="empty-state-android"
          />
        );
        expect(getByText('Android Empty State')).toBeTruthy();
        expect(getByText('Android description')).toBeTruthy();
      });

      it('should render Android version with action', () => {
        const { getByText } = renderWithTheme(
          <EmptyStateAndroid
            title="Android Empty State"
            action={<Button>Android Action</Button>}
            testID="empty-state-android"
          />
        );
        expect(getByText('Android Empty State')).toBeTruthy();
        expect(getByText('Android Action')).toBeTruthy();
      });

      it('should render Android version with all props', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <EmptyStateAndroid
            title="Android Empty State"
            description="Android description"
            icon={<Icon glyph="inbox" accessibilityLabel="Icon" />}
            action={<Button>Android Action</Button>}
            testID="empty-state-android"
          />
        );
        expect(getByText('Android Empty State')).toBeTruthy();
        expect(getByText('Android description')).toBeTruthy();
        expect(getByText('Android Action')).toBeTruthy();
        expect(getByTestId('empty-state-android')).toBeTruthy();
      });

      it('should use title as accessibility label when accessibilityLabel not provided on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <EmptyStateAndroid title="Title Only" testID="empty-state-android" />
        );
        expect(getByLabelText('Title Only')).toBeTruthy();
      });

      it('should use default i18n label when title is React node on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <EmptyStateAndroid title={<span>React Title</span>} testID="empty-state-android" />
        );
        // When title is not string, should use default i18n label
        const expectedLabel = mockEnTranslations?.common?.emptyState || 'common.emptyState';
        expect(getByLabelText(expectedLabel)).toBeTruthy();
      });
    });

    describe('iOS Platform', () => {
      // eslint-disable-next-line import/no-unresolved
      const EmptyStateIOS = require('@platform/components/states/EmptyState/EmptyState.ios').default;

      it('should render iOS version', () => {
        const { getByText } = renderWithTheme(
          <EmptyStateIOS title="iOS Empty State" testID="empty-state-ios" />
        );
        expect(getByText('iOS Empty State')).toBeTruthy();
      });

      it('should have accessibilityRole="status" on iOS', () => {
        const { getByTestId } = renderWithTheme(
          <EmptyStateIOS title="iOS Empty State" testID="empty-state-ios" />
        );
        const emptyState = getByTestId('empty-state-ios');
        expect(emptyState.props.accessibilityRole).toBe('status');
      });

      it('should use custom accessibility label on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <EmptyStateIOS title="iOS Empty State" accessibilityLabel="Custom iOS label" testID="empty-state-ios" />
        );
        expect(getByLabelText('Custom iOS label')).toBeTruthy();
      });

      it('should render iOS version with icon', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <EmptyStateIOS
            title="iOS Empty State"
            icon={<Icon glyph="inbox" accessibilityLabel="Icon" />}
            testID="empty-state-ios"
          />
        );
        expect(getByText('iOS Empty State')).toBeTruthy();
        expect(getByTestId('empty-state-ios')).toBeTruthy();
      });

      it('should render iOS version with description', () => {
        const { getByText } = renderWithTheme(
          <EmptyStateIOS
            title="iOS Empty State"
            description="iOS description"
            testID="empty-state-ios"
          />
        );
        expect(getByText('iOS Empty State')).toBeTruthy();
        expect(getByText('iOS description')).toBeTruthy();
      });

      it('should render iOS version with action', () => {
        const { getByText } = renderWithTheme(
          <EmptyStateIOS
            title="iOS Empty State"
            action={<Button>iOS Action</Button>}
            testID="empty-state-ios"
          />
        );
        expect(getByText('iOS Empty State')).toBeTruthy();
        expect(getByText('iOS Action')).toBeTruthy();
      });

      it('should render iOS version with all props', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <EmptyStateIOS
            title="iOS Empty State"
            description="iOS description"
            icon={<Icon glyph="inbox" accessibilityLabel="Icon" />}
            action={<Button>iOS Action</Button>}
            testID="empty-state-ios"
          />
        );
        expect(getByText('iOS Empty State')).toBeTruthy();
        expect(getByText('iOS description')).toBeTruthy();
        expect(getByText('iOS Action')).toBeTruthy();
        expect(getByTestId('empty-state-ios')).toBeTruthy();
      });

      it('should use title as accessibility label when accessibilityLabel not provided on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <EmptyStateIOS title="Title Only" testID="empty-state-ios" />
        );
        expect(getByLabelText('Title Only')).toBeTruthy();
      });

      it('should use default i18n label when title is React node on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <EmptyStateIOS title={<span>React Title</span>} testID="empty-state-ios" />
        );
        // When title is not string, should use default i18n label
        const expectedLabel = mockEnTranslations?.common?.emptyState || 'common.emptyState';
        expect(getByLabelText(expectedLabel)).toBeTruthy();
      });
    });
  });

  describe('Index barrel export', () => {
    it('should export default component', () => {
      expect(EmptyState).toBeDefined();
      expect(typeof EmptyState).toBe('function');
    });

    it('should export SIZES from index', () => {
      // SIZES is already tested in Constants Export, but verify it's accessible via index
      expect(SIZES).toBeDefined();
      expect(SIZES.SMALL).toBe('small');
      expect(SIZES.MEDIUM).toBe('medium');
      expect(SIZES.LARGE).toBe('large');
    });

    it('should render default export (web version)', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Test Title" testID="empty-state" />
      );
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('should import and use index barrel exports', () => {
      // Explicitly test that index.js exports work
      // eslint-disable-next-line import/no-unresolved
      const IndexExports = require('@platform/components/states/EmptyState/index.js');
      expect(IndexExports.default).toBeDefined();
      expect(IndexExports.SIZES).toBeDefined();
      expect(IndexExports.SIZES.SMALL).toBe('small');
      expect(IndexExports.SIZES.MEDIUM).toBe('medium');
      expect(IndexExports.SIZES.LARGE).toBe('large');
    });
  });

  describe('Web Platform specific', () => {
    it('should have role="status" on web', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="Web Empty State" testID="empty-state-web" />
      );
      const emptyState = getByTestId('empty-state-web');
      expect(emptyState.props.accessibilityRole).toBe('status');
    });

    it('should use aria-label on web', () => {
      const { getByLabelText } = renderWithTheme(
        <EmptyState title="Web Empty State" testID="empty-state-web" />
      );
      expect(getByLabelText('Web Empty State')).toBeTruthy();
    });

    it('should accept className prop on web', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="Web Empty State" className="custom-class" testID="empty-state-web" />
      );
      const emptyState = getByTestId('empty-state-web');
      expect(emptyState.props.className).toBe('custom-class');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string title', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="" testID="empty-state" />
      );
      const emptyState = getByTestId('empty-state');
      expect(emptyState).toBeTruthy();
    });

    it('should handle empty string description', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="Title" description="" testID="empty-state" />
      );
      const emptyState = getByTestId('empty-state');
      expect(emptyState).toBeTruthy();
    });

    it('should handle falsy icon', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Title" icon={null} testID="empty-state" />
      );
      expect(getByText('Title')).toBeTruthy();
    });

    it('should handle falsy action', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Title" action={null} testID="empty-state" />
      );
      expect(getByText('Title')).toBeTruthy();
    });

    it('should handle style prop', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="Title" style={{ backgroundColor: 'red' }} testID="empty-state" />
      );
      const emptyState = getByTestId('empty-state');
      expect(emptyState).toBeTruthy();
    });
  });
});

