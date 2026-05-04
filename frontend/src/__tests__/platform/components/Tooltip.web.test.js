/**
 * Tooltip Component Web Tests
 * File: Tooltip.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import TooltipWeb from '@platform/components/feedback/Tooltip/Tooltip.web';
import { useTooltip, POSITIONS } from '@platform/components/feedback/Tooltip';
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

const renderWebWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Tooltip Component - Web', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render web tooltip when visible', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible text="Web Tooltip" testID="tooltip-web" />
      );
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByTestId } = renderWebWithTheme(
        <TooltipWeb visible={false} text="Web Tooltip" testID="tooltip-web" />
      );
      expect(queryByTestId('tooltip-web')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have role="tooltip" on web', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible text="Web Tooltip" testID="tooltip-web" />
      );
      const tooltip = getByTestId('tooltip-web');
      expect(tooltip.getAttribute('role')).toBe('tooltip');
    });

    it('should have aria-label on web', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible text="Web Tooltip" testID="tooltip-web" />
      );
      const tooltip = getByTestId('tooltip-web');
      expect(tooltip.getAttribute('aria-label')).toBe('Web Tooltip');
    });

    it('should use custom accessibility label when provided', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible text="Web Tooltip" accessibilityLabel="Custom label" testID="tooltip-web" />
      );
      const tooltip = getByTestId('tooltip-web');
      expect(tooltip.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should support id prop for aria-describedby association', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible text="Web Tooltip" id="tooltip-1" testID="tooltip-web" />
      );
      const tooltip = getByTestId('tooltip-web');
      expect(tooltip.getAttribute('id')).toBe('tooltip-1');
    });
  });

  describe('Web Focus Behavior', () => {
    it('should be associable with trigger element via aria-describedby', () => {
      const TestComponent = () => {
        const { visible, show, hide } = useTooltip({ delay: 0 });
        return (
          <>
            <button
              data-testid="trigger"
              onFocus={show}
              onBlur={hide}
              aria-describedby="tooltip-1"
            >
              Focus me
            </button>
            <TooltipWeb visible={visible} text="Tooltip text" id="tooltip-1" testID="tooltip-web" />
          </>
        );
      };
      const { getByTestId, queryByTestId } = renderWebWithTheme(<TestComponent />);
      const trigger = getByTestId('trigger');
      
      // Verify aria-describedby association
      expect(trigger.getAttribute('aria-describedby')).toBe('tooltip-1');
      
      // Tooltip should not be visible initially
      expect(queryByTestId('tooltip-web')).toBeNull();
      
      // Focus trigger - tooltip should appear
      fireEvent.focus(trigger);
      act(() => {
        jest.advanceTimersByTime(0);
      });
      expect(getByTestId('tooltip-web')).toBeTruthy();
      
      // Blur trigger - tooltip should disappear
      fireEvent.blur(trigger);
      expect(queryByTestId('tooltip-web')).toBeNull();
    });

    it('should show tooltip on focus with delay', () => {
      const TestComponent = () => {
        const { visible, show } = useTooltip({ delay: 500 });
        return (
          <>
            <button
              data-testid="trigger"
              onFocus={show}
              aria-describedby="tooltip-1"
            >
              Focus me
            </button>
            <TooltipWeb visible={visible} text="Tooltip text" id="tooltip-1" testID="tooltip-web" />
          </>
        );
      };
      const { getByTestId, queryByTestId } = renderWebWithTheme(<TestComponent />);
      const trigger = getByTestId('trigger');
      
      // Tooltip should not be visible initially
      expect(queryByTestId('tooltip-web')).toBeNull();
      
      // Focus trigger
      fireEvent.focus(trigger);
      
      // Tooltip should not appear immediately
      expect(queryByTestId('tooltip-web')).toBeNull();
      
      // After delay, tooltip should appear
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });
  });

  describe('Web Hover Behavior', () => {
    it('should show tooltip on hover', () => {
      const TestComponent = () => {
        const { visible, show, hide } = useTooltip({ delay: 0 });
        return (
          <>
            <button
              data-testid="trigger"
              onMouseEnter={show}
              onMouseLeave={hide}
              aria-describedby="tooltip-1"
            >
              Hover me
            </button>
            <TooltipWeb visible={visible} text="Tooltip text" id="tooltip-1" testID="tooltip-web" />
          </>
        );
      };
      const { getByTestId, queryByTestId } = renderWebWithTheme(<TestComponent />);
      const trigger = getByTestId('trigger');
      
      // Tooltip should not be visible initially
      expect(queryByTestId('tooltip-web')).toBeNull();
      
      // Hover trigger - tooltip should appear
      fireEvent.mouseEnter(trigger);
      act(() => {
        jest.advanceTimersByTime(0);
      });
      expect(getByTestId('tooltip-web')).toBeTruthy();
      
      // Leave trigger - tooltip should disappear
      fireEvent.mouseLeave(trigger);
      expect(queryByTestId('tooltip-web')).toBeNull();
    });

    it('should show tooltip on hover with delay', () => {
      const TestComponent = () => {
        const { visible, show } = useTooltip({ delay: 500 });
        return (
          <>
            <button
              data-testid="trigger"
              onMouseEnter={show}
              aria-describedby="tooltip-1"
            >
              Hover me
            </button>
            <TooltipWeb visible={visible} text="Tooltip text" id="tooltip-1" testID="tooltip-web" />
          </>
        );
      };
      const { getByTestId, queryByTestId } = renderWebWithTheme(<TestComponent />);
      const trigger = getByTestId('trigger');
      
      // Tooltip should not be visible initially
      expect(queryByTestId('tooltip-web')).toBeNull();
      
      // Hover trigger
      fireEvent.mouseEnter(trigger);
      
      // Tooltip should not appear immediately
      expect(queryByTestId('tooltip-web')).toBeNull();
      
      // After delay, tooltip should appear
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard focus to show tooltip', () => {
      const TestComponent = () => {
        const { visible, show, hide } = useTooltip({ delay: 0 });
        return (
          <>
            <button
              data-testid="trigger"
              onFocus={show}
              onBlur={hide}
              aria-describedby="tooltip-1"
            >
              Tab to focus
            </button>
            <TooltipWeb visible={visible} text="Tooltip text" id="tooltip-1" testID="tooltip-web" />
          </>
        );
      };
      const { getByTestId, queryByTestId } = renderWebWithTheme(<TestComponent />);
      const trigger = getByTestId('trigger');
      
      // Focus via keyboard (simulated)
      fireEvent.focus(trigger);
      act(() => {
        jest.advanceTimersByTime(0);
      });
      expect(getByTestId('tooltip-web')).toBeTruthy();
      
      // Blur (Tab away)
      fireEvent.blur(trigger);
      expect(queryByTestId('tooltip-web')).toBeNull();
    });

    it('should work with Enter key to focus trigger', () => {
      const TestComponent = () => {
        const { visible, show, hide } = useTooltip({ delay: 0 });
        return (
          <>
            <button
              data-testid="trigger"
              onFocus={show}
              onBlur={hide}
              aria-describedby="tooltip-1"
            >
              Press Enter
            </button>
            <TooltipWeb visible={visible} text="Tooltip text" id="tooltip-1" testID="tooltip-web" />
          </>
        );
      };
      const { getByTestId, queryByTestId } = renderWebWithTheme(<TestComponent />);
      const trigger = getByTestId('trigger');
      
      // Simulate Enter key press (which would focus the button)
      fireEvent.keyDown(trigger, { key: 'Enter' });
      fireEvent.focus(trigger);
      act(() => {
        jest.advanceTimersByTime(0);
      });
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });
  });

  describe('Positions', () => {
    it('should render at top position', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible position={POSITIONS.TOP} text="Top" testID="tooltip-web" />
      );
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });

    it('should render at bottom position', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible position={POSITIONS.BOTTOM} text="Bottom" testID="tooltip-web" />
      );
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });

    it('should render at left position', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible position={POSITIONS.LEFT} text="Left" testID="tooltip-web" />
      );
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });

    it('should render at right position', () => {
      const { getByTestId } = renderWebWithTheme(
        <TooltipWeb visible position={POSITIONS.RIGHT} text="Right" testID="tooltip-web" />
      );
      expect(getByTestId('tooltip-web')).toBeTruthy();
    });
  });
});

