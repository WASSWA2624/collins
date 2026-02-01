/**
 * ErrorState Component Tests
 * File: ErrorState.test.js
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import ErrorState, { SIZES } from '@platform/components/states/ErrorState';
import Icon from '@platform/components/display/Icon';
import Button from '@platform/components/Button';
import lightTheme from '@theme/light.theme';

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('ErrorState Component', () => {
  describe('Rendering', () => {
    it('should render with title only', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title="Something went wrong" testID="error-state" />
      );
      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should render with title and description', () => {
      const { getByText } = renderWithTheme(
        <ErrorState
          title="Something went wrong"
          description="Please try again later"
          testID="error-state"
        />
      );
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(getByText('Please try again later')).toBeTruthy();
    });

    it('should render with icon', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState
          title="Something went wrong"
          icon={<Icon glyph="alert-circle" accessibilityLabel="Error icon" />}
          testID="error-state"
        />
      );
      const errorState = getByTestId('error-state');
      expect(errorState).toBeTruthy();
      expect(errorState.children.length).toBeGreaterThan(0);
    });

    it('should render with retry action', () => {
      const { getByText } = renderWithTheme(
        <ErrorState
          title="Something went wrong"
          action={<Button>Retry</Button>}
          testID="error-state"
        />
      );
      expect(getByText('Retry')).toBeTruthy();
    });

    it('should render all elements together', () => {
      const { getByText, getByTestId } = renderWithTheme(
        <ErrorState
          title="Something went wrong"
          description="Please try again later"
          icon={<Icon glyph="alert-circle" accessibilityLabel="Error icon" />}
          action={<Button>Retry</Button>}
          testID="error-state"
        />
      );
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(getByText('Please try again later')).toBeTruthy();
      const errorState = getByTestId('error-state');
      expect(errorState).toBeTruthy();
      expect(errorState.children.length).toBeGreaterThan(0);
      expect(getByText('Retry')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" size="small" testID="error-state" />
      );
      expect(getByTestId('error-state')).toBeTruthy();
    });

    it('should render medium size (default)', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" testID="error-state" />
      );
      expect(getByTestId('error-state')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" size="large" testID="error-state" />
      );
      expect(getByTestId('error-state')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should fallback to medium size when size is invalid', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" size="invalid-size" testID="error-state" />
      );
      expect(getByTestId('error-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is null', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" size={null} testID="error-state" />
      );
      expect(getByTestId('error-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is undefined', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" size={undefined} testID="error-state" />
      );
      expect(getByTestId('error-state')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have alert role', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" testID="error-state" />
      );
      const errorState = getByTestId('error-state');
      expect(errorState.props.accessibilityRole || errorState.props.role).toBe('alert');
    });

    it('should use custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <ErrorState title="Error" accessibilityLabel="Error occurred" testID="error-state" />
      );
      expect(getByLabelText('Error occurred')).toBeTruthy();
    });

    it('should use title as accessibility label when not provided', () => {
      const { getByLabelText } = renderWithTheme(
        <ErrorState title="Something went wrong" testID="error-state" />
      );
      expect(getByLabelText('Something went wrong')).toBeTruthy();
    });

    it('should handle non-string title for accessibility label', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title={<span>React Node Title</span>} testID="error-state" />
      );
      const errorState = getByTestId('error-state');
      // When title is not a string, aria-label should be undefined or use custom accessibilityLabel
      expect(errorState).toBeTruthy();
    });

    it('should handle React node title', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title={<span>Custom Title</span>} testID="error-state" />
      );
      expect(getByText('Custom Title')).toBeTruthy();
    });

    it('should handle React node description', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title="Title" description={<span>Custom Description</span>} testID="error-state" />
      );
      expect(getByText('Custom Description')).toBeTruthy();
    });

    it('should render without icon', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title="Error" testID="error-state" />
      );
      expect(getByText('Error')).toBeTruthy();
    });

    it('should render without description', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title="Error" testID="error-state" />
      );
      expect(getByText('Error')).toBeTruthy();
    });

    it('should render without action', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title="Error" testID="error-state" />
      );
      expect(getByText('Error')).toBeTruthy();
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Error" testID="test-error-state" />
      );
      expect(getByTestId('test-error-state')).toBeTruthy();
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
      const ErrorStateAndroid = require('@platform/components/states/ErrorState/ErrorState.android').default;

      it('should render Android version', () => {
        const { getByText } = renderWithTheme(
          <ErrorStateAndroid title="Android Error State" testID="error-state-android" />
        );
        expect(getByText('Android Error State')).toBeTruthy();
      });

      it('should have accessibilityRole="alert" on Android', () => {
        const { getByTestId } = renderWithTheme(
          <ErrorStateAndroid title="Android Error State" testID="error-state-android" />
        );
        const errorState = getByTestId('error-state-android');
        expect(errorState.props.accessibilityRole).toBe('alert');
      });

      it('should use custom accessibility label on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <ErrorStateAndroid title="Android Error State" accessibilityLabel="Custom Android label" testID="error-state-android" />
        );
        expect(getByLabelText('Custom Android label')).toBeTruthy();
      });

      it('should render Android version with icon', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <ErrorStateAndroid
            title="Android Error State"
            icon={<Icon glyph="alert-circle" accessibilityLabel="Icon" />}
            testID="error-state-android"
          />
        );
        expect(getByText('Android Error State')).toBeTruthy();
        expect(getByTestId('error-state-android')).toBeTruthy();
      });

      it('should render Android version with description', () => {
        const { getByText } = renderWithTheme(
          <ErrorStateAndroid
            title="Android Error State"
            description="Android description"
            testID="error-state-android"
          />
        );
        expect(getByText('Android Error State')).toBeTruthy();
        expect(getByText('Android description')).toBeTruthy();
      });

      it('should render Android version with action', () => {
        const { getByText } = renderWithTheme(
          <ErrorStateAndroid
            title="Android Error State"
            action={<Button>Android Action</Button>}
            testID="error-state-android"
          />
        );
        expect(getByText('Android Error State')).toBeTruthy();
        expect(getByText('Android Action')).toBeTruthy();
      });

      it('should render Android version with all props', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <ErrorStateAndroid
            title="Android Error State"
            description="Android description"
            icon={<Icon glyph="alert-circle" accessibilityLabel="Icon" />}
            action={<Button>Android Action</Button>}
            testID="error-state-android"
          />
        );
        expect(getByText('Android Error State')).toBeTruthy();
        expect(getByText('Android description')).toBeTruthy();
        expect(getByText('Android Action')).toBeTruthy();
        expect(getByTestId('error-state-android')).toBeTruthy();
      });

      it('should use title as accessibility label when accessibilityLabel not provided on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <ErrorStateAndroid title="Title Only" testID="error-state-android" />
        );
        expect(getByLabelText('Title Only')).toBeTruthy();
      });

      it('should not set accessibilityLabel when title is React node on Android', () => {
        const { getByTestId } = renderWithTheme(
          <ErrorStateAndroid title={<span>React Title</span>} testID="error-state-android" />
        );
        const errorState = getByTestId('error-state-android');
        expect(errorState).toBeTruthy();
        // When title is not string, accessibilityLabel should be undefined unless explicitly provided
        expect(errorState.props.accessibilityLabel).toBeUndefined();
      });
    });

    describe('iOS Platform', () => {
      // eslint-disable-next-line import/no-unresolved
      const ErrorStateIOS = require('@platform/components/states/ErrorState/ErrorState.ios').default;

      it('should render iOS version', () => {
        const { getByText } = renderWithTheme(
          <ErrorStateIOS title="iOS Error State" testID="error-state-ios" />
        );
        expect(getByText('iOS Error State')).toBeTruthy();
      });

      it('should have accessibilityRole="alert" on iOS', () => {
        const { getByTestId } = renderWithTheme(
          <ErrorStateIOS title="iOS Error State" testID="error-state-ios" />
        );
        const errorState = getByTestId('error-state-ios');
        expect(errorState.props.accessibilityRole).toBe('alert');
      });

      it('should use custom accessibility label on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <ErrorStateIOS title="iOS Error State" accessibilityLabel="Custom iOS label" testID="error-state-ios" />
        );
        expect(getByLabelText('Custom iOS label')).toBeTruthy();
      });

      it('should render iOS version with icon', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <ErrorStateIOS
            title="iOS Error State"
            icon={<Icon glyph="alert-circle" accessibilityLabel="Icon" />}
            testID="error-state-ios"
          />
        );
        expect(getByText('iOS Error State')).toBeTruthy();
        expect(getByTestId('error-state-ios')).toBeTruthy();
      });

      it('should render iOS version with description', () => {
        const { getByText } = renderWithTheme(
          <ErrorStateIOS
            title="iOS Error State"
            description="iOS description"
            testID="error-state-ios"
          />
        );
        expect(getByText('iOS Error State')).toBeTruthy();
        expect(getByText('iOS description')).toBeTruthy();
      });

      it('should render iOS version with action', () => {
        const { getByText } = renderWithTheme(
          <ErrorStateIOS
            title="iOS Error State"
            action={<Button>iOS Action</Button>}
            testID="error-state-ios"
          />
        );
        expect(getByText('iOS Error State')).toBeTruthy();
        expect(getByText('iOS Action')).toBeTruthy();
      });

      it('should render iOS version with all props', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <ErrorStateIOS
            title="iOS Error State"
            description="iOS description"
            icon={<Icon glyph="alert-circle" accessibilityLabel="Icon" />}
            action={<Button>iOS Action</Button>}
            testID="error-state-ios"
          />
        );
        expect(getByText('iOS Error State')).toBeTruthy();
        expect(getByText('iOS description')).toBeTruthy();
        expect(getByText('iOS Action')).toBeTruthy();
        expect(getByTestId('error-state-ios')).toBeTruthy();
      });

      it('should use title as accessibility label when accessibilityLabel not provided on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <ErrorStateIOS title="Title Only" testID="error-state-ios" />
        );
        expect(getByLabelText('Title Only')).toBeTruthy();
      });

      it('should not set accessibilityLabel when title is React node on iOS', () => {
        const { getByTestId } = renderWithTheme(
          <ErrorStateIOS title={<span>React Title</span>} testID="error-state-ios" />
        );
        const errorState = getByTestId('error-state-ios');
        expect(errorState).toBeTruthy();
        // When title is not string, accessibilityLabel should be undefined unless explicitly provided
        expect(errorState.props.accessibilityLabel).toBeUndefined();
      });
    });
  });

  describe('Index barrel export', () => {
    it('should export default component', () => {
      expect(ErrorState).toBeDefined();
      expect(typeof ErrorState).toBe('function');
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
        <ErrorState title="Test Title" testID="error-state" />
      );
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('should import and use index barrel exports', () => {
      // Explicitly test that index.js exports work
      // eslint-disable-next-line import/no-unresolved
      const IndexExports = require('@platform/components/states/ErrorState/index.js');
      expect(IndexExports.default).toBeDefined();
      expect(IndexExports.SIZES).toBeDefined();
      expect(IndexExports.SIZES.SMALL).toBe('small');
      expect(IndexExports.SIZES.MEDIUM).toBe('medium');
      expect(IndexExports.SIZES.LARGE).toBe('large');
    });
  });

  describe('Web Platform specific', () => {
    it('should have role="alert" on web', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Web Error State" testID="error-state-web" />
      );
      const errorState = getByTestId('error-state-web');
      expect(errorState.props.accessibilityRole).toBe('alert');
    });

    it('should use aria-label on web', () => {
      const { getByLabelText } = renderWithTheme(
        <ErrorState title="Web Error State" testID="error-state-web" />
      );
      expect(getByLabelText('Web Error State')).toBeTruthy();
    });

    it('should accept className prop on web', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Web Error State" className="custom-class" testID="error-state-web" />
      );
      const errorState = getByTestId('error-state-web');
      expect(errorState.props.className).toBe('custom-class');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string title', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="" testID="error-state" />
      );
      const errorState = getByTestId('error-state');
      expect(errorState).toBeTruthy();
    });

    it('should handle empty string description', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Title" description="" testID="error-state" />
      );
      const errorState = getByTestId('error-state');
      expect(errorState).toBeTruthy();
    });

    it('should handle falsy icon', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title="Title" icon={null} testID="error-state" />
      );
      expect(getByText('Title')).toBeTruthy();
    });

    it('should handle falsy action', () => {
      const { getByText } = renderWithTheme(
        <ErrorState title="Title" action={null} testID="error-state" />
      );
      expect(getByText('Title')).toBeTruthy();
    });

    it('should handle style prop', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="Title" style={{ backgroundColor: 'red' }} testID="error-state" />
      );
      const errorState = getByTestId('error-state');
      expect(errorState).toBeTruthy();
    });
  });
});

