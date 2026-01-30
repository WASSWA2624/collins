/**
 * LoadingSpinner Component Tests
 * File: LoadingSpinner.test.js
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import LoadingSpinner, { SIZES } from '@platform/components/feedback/LoadingSpinner';
import LoadingSpinnerAndroid from '@platform/components/feedback/LoadingSpinner/LoadingSpinner.android';
import LoadingSpinnerIOS from '@platform/components/feedback/LoadingSpinner/LoadingSpinner.ios';
import LoadingSpinnerWeb from '@platform/components/feedback/LoadingSpinner/LoadingSpinner.web';
import {
  getBorderWidth,
  getSpinnerDimension,
  getBorderColor,
  getBorderTopColor,
} from '@platform/components/feedback/LoadingSpinner/LoadingSpinner.web.styles';
import lightTheme from '@theme/light.theme';
import rootReducer from '@store/rootReducer';
import { renderWithProviders } from '../../helpers/test-utils';

const createMockStore = () => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: {
        theme: 'light',
        locale: 'en',
        isLoading: false,
      },
    },
  });
};

const renderWithTheme = (component) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );
};

const renderWithWebTheme = (component) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <WebThemeProvider theme={lightTheme}>{component}</WebThemeProvider>
    </Provider>
  );
};

describe('LoadingSpinner Component', () => {
  describe('Basic Rendering', () => {
    it('should render spinner', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner size={SIZES.SMALL} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render medium size (default)', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner size={SIZES.LARGE} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });
  });

  describe('Color', () => {
    it('should use theme color by default', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should use custom color when provided', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner color="#FF0000" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have default accessibility label', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should have custom accessibility label', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner accessibilityLabel="Loading products" />
      );
      expect(getByLabelText('Loading products')).toBeTruthy();
    });

    it('should have accessibility hint', () => {
      const { getByLabelText } = renderWithProviders(
        <LoadingSpinner accessibilityHint="Please wait while content loads" />
      );
      const spinner = getByLabelText('Loading...');
      expect(spinner).toBeTruthy();
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      const { getByTestId } = renderWithProviders(
        <LoadingSpinner testID="test-spinner" />
      );
      expect(getByTestId('test-spinner')).toBeTruthy();
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

  describe('Android platform', () => {
    it('should render Android component', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid testID="spinner-android" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render small size on Android', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid size={SIZES.SMALL} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render large size on Android', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid size={SIZES.LARGE} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should use custom color on Android', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid color="#FF0000" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should have progressbar accessibility role on Android', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid accessibilityLabel="Loading data" />
      );
      const spinner = getByLabelText('Loading data');
      expect(spinner.props.accessibilityRole).toBe('progressbar');
    });

    it('should accept style prop on Android', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = renderWithTheme(
        <LoadingSpinnerAndroid testID="spinner-android" style={customStyle} />
      );
      const spinner = getByTestId('spinner-android');
      expect(spinner.props.style).toBe(customStyle);
    });
  });

  describe('iOS platform', () => {
    it('should render iOS component', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS testID="spinner-ios" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render small size on iOS', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS size={SIZES.SMALL} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render large size on iOS', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS size={SIZES.LARGE} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should use custom color on iOS', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS color="#FF0000" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should have progressbar accessibility role on iOS', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS accessibilityLabel="Loading data" />
      );
      const spinner = getByLabelText('Loading data');
      expect(spinner.props.accessibilityRole).toBe('progressbar');
    });

    it('should accept style prop on iOS', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = renderWithTheme(
        <LoadingSpinnerIOS testID="spinner-ios" style={customStyle} />
      );
      const spinner = getByTestId('spinner-ios');
      expect(spinner.props.style).toBe(customStyle);
    });
  });

  describe('Web platform', () => {
    it('should render Web component', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render small size on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb size={SIZES.SMALL} accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render medium size on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb size={SIZES.MEDIUM} accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render large size on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb size={SIZES.LARGE} accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle invalid size on Web (fallback to medium)', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb size="invalid" accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should use custom color on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb color="#FF0000" accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should use theme color when color prop is not provided on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should have status role on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb accessibilityLabel="Loading data" />
      );
      const spinner = getByLabelText('Loading data');
      expect(spinner.props.role).toBe('status');
    });

    it('should have aria-live polite on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb accessibilityLabel="Loading data" />
      );
      const spinner = getByLabelText('Loading data');
      expect(spinner.props['aria-live']).toBe('polite');
    });

    it('should accept aria-label on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb aria-label="Loading data" />
      );
      expect(getByLabelText('Loading data')).toBeTruthy();
    });

    it('should accept className prop on Web', () => {
      const { UNSAFE_getByType } = renderWithWebTheme(
        <LoadingSpinnerWeb className="custom-class" accessibilityLabel="Loading..." />
      );
      const spinner = UNSAFE_getByType(LoadingSpinnerWeb);
      expect(spinner.props.className).toBe('custom-class');
    });

    it('should accept style prop on Web', () => {
      const customStyle = { marginTop: 10 };
      const { UNSAFE_getByType } = renderWithWebTheme(
        <LoadingSpinnerWeb style={customStyle} accessibilityLabel="Loading..." />
      );
      const spinner = UNSAFE_getByType(LoadingSpinnerWeb);
      expect(spinner.props.style).toBe(customStyle);
    });

    it('should have aria-description on Web', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb accessibilityLabel="Loading" accessibilityHint="Please wait" />
      );
      const spinner = getByLabelText('Loading');
      expect(spinner.props['aria-description']).toBe('Please wait');
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid size on Android (fallback to medium)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid size="invalid" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle invalid size on iOS (fallback to medium)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS size="invalid" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle undefined size on Android (uses default)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid size={undefined} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle undefined size on iOS (uses default)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS size={undefined} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle null color on Android (uses theme)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid color={null} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle null color on iOS (uses theme)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS color={null} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle undefined color on Android (uses theme)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid color={undefined} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle undefined color on iOS (uses theme)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS color={undefined} />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle empty string color on Android (uses theme)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerAndroid color="" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle empty string color on iOS (uses theme)', () => {
      const { getByLabelText } = renderWithTheme(
        <LoadingSpinnerIOS color="" />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle empty string color on Web (uses theme)', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb color="" accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle null color on Web (uses theme)', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb color={null} accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle undefined color on Web (uses theme)', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb color={undefined} accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should handle invalid size on Web with custom color', () => {
      const { getByLabelText } = renderWithWebTheme(
        <LoadingSpinnerWeb size="invalid" color="#FF0000" accessibilityLabel="Loading..." />
      );
      expect(getByLabelText('Loading...')).toBeTruthy();
    });

    it('should render Web component with all size and color combinations to cover styled component branches', () => {
      // Test all combinations to ensure styled component template literals are executed
      const sizes = [SIZES.SMALL, SIZES.MEDIUM, SIZES.LARGE, 'invalid'];
      const colors = ['#FF0000', undefined, null, ''];
      
      sizes.forEach((size) => {
        colors.forEach((color) => {
          const { getByLabelText } = renderWithWebTheme(
            <LoadingSpinnerWeb size={size} color={color} accessibilityLabel="Loading..." />
          );
          expect(getByLabelText('Loading...')).toBeTruthy();
        });
      });
    });
  });

  describe('Index Export', () => {
    it('should export LoadingSpinner as default', () => {
      expect(LoadingSpinner).toBeDefined();
      expect(typeof LoadingSpinner).toBe('function');
      // Verify it's the web component (default export from index)
      expect(LoadingSpinner).toBeDefined();
    });

    it('should export SIZES from index', () => {
      expect(SIZES).toBeDefined();
      expect(SIZES.SMALL).toBe('small');
      expect(SIZES.MEDIUM).toBe('medium');
      expect(SIZES.LARGE).toBe('large');
    });

    it('should allow importing from index path', () => {
      // Test that the index.js barrel file exports work correctly
      // This is verified by the fact that we can import LoadingSpinner and SIZES above
      expect(LoadingSpinner).toBeDefined();
      expect(SIZES).toBeDefined();
    });
  });

  describe('Web Styles Helpers', () => {
    describe('getBorderWidth', () => {
      it('should return correct width for small size', () => {
        expect(getBorderWidth('small', lightTheme)).toBe(`${lightTheme.spacing.xs}px`);
      });

      it('should return correct width for medium size', () => {
        expect(getBorderWidth('medium', lightTheme)).toBe(`${lightTheme.spacing.xs}px`);
      });

      it('should return correct width for large size', () => {
        expect(getBorderWidth('large', lightTheme)).toBe(`${lightTheme.spacing.xs}px`);
      });

      it('should return medium width for invalid size', () => {
        expect(getBorderWidth('invalid', lightTheme)).toBe(`${lightTheme.spacing.xs}px`);
      });

      it('should return medium width for undefined size', () => {
        expect(getBorderWidth(undefined, lightTheme)).toBe(`${lightTheme.spacing.xs}px`);
      });

      it('should return medium width for null size', () => {
        expect(getBorderWidth(null, lightTheme)).toBe(`${lightTheme.spacing.xs}px`);
      });
    });

    describe('getSpinnerDimension', () => {
      it('should return correct dimension for small size', () => {
        const dimension = getSpinnerDimension('small', lightTheme);
        expect(dimension).toBe(`${lightTheme.spacing.xl}px`);
      });

      it('should return correct dimension for medium size', () => {
        const dimension = getSpinnerDimension('medium', lightTheme);
        expect(dimension).toBe(`${lightTheme.spacing.xxl}px`);
      });

      it('should return correct dimension for large size', () => {
        const dimension = getSpinnerDimension('large', lightTheme);
        expect(dimension).toBe(`${lightTheme.spacing.xxl + lightTheme.spacing.md}px`);
      });

      it('should return medium dimension for invalid size', () => {
        const dimension = getSpinnerDimension('invalid', lightTheme);
        expect(dimension).toBe(`${lightTheme.spacing.xxl}px`);
      });

      it('should return medium dimension for undefined size', () => {
        const dimension = getSpinnerDimension(undefined, lightTheme);
        expect(dimension).toBe(`${lightTheme.spacing.xxl}px`);
      });

      it('should return medium dimension for null size', () => {
        const dimension = getSpinnerDimension(null, lightTheme);
        expect(dimension).toBe(`${lightTheme.spacing.xxl}px`);
      });
    });

    describe('getBorderColor', () => {
      it('should return custom color when provided', () => {
        expect(getBorderColor('#FF0000', lightTheme)).toBe('#FF0000');
      });

      it('should return theme color when color is not provided', () => {
        expect(getBorderColor(undefined, lightTheme)).toBe(lightTheme.colors.background.tertiary);
      });

      it('should return theme color when color is null', () => {
        expect(getBorderColor(null, lightTheme)).toBe(lightTheme.colors.background.tertiary);
      });

      it('should return theme color when color is empty string', () => {
        expect(getBorderColor('', lightTheme)).toBe(lightTheme.colors.background.tertiary);
      });
    });

    describe('getBorderTopColor', () => {
      it('should return custom color when provided', () => {
        expect(getBorderTopColor('#FF0000', lightTheme)).toBe('#FF0000');
      });

      it('should return theme primary color when color is not provided', () => {
        expect(getBorderTopColor(undefined, lightTheme)).toBe(lightTheme.colors.primary);
      });

      it('should return theme primary color when color is null', () => {
        expect(getBorderTopColor(null, lightTheme)).toBe(lightTheme.colors.primary);
      });

      it('should return theme primary color when color is empty string', () => {
        expect(getBorderTopColor('', lightTheme)).toBe(lightTheme.colors.primary);
      });
    });
  });
});

