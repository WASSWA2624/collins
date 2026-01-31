/**
 * useMainRouteLayoutWebShell Tests
 * File: useMainRouteLayoutWebShell.test.js
 */
import React from 'react';
import { act } from '@testing-library/react-native';
import { renderHookResult } from '../../../../helpers/render-hook';

import useMainRouteLayoutWebShell from '@platform/layouts/RouteLayouts/MainRouteLayout/useMainRouteLayoutWebShell';

describe('useMainRouteLayoutWebShell', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns defaults', () => {
    const result = renderHookResult(() => useMainRouteLayoutWebShell());
    expect(result.sidebarCollapsed).toBe(false);
    expect(typeof result.sidebarWidth).toBe('number');
    expect(typeof result.collapsedWidth).toBe('number');
    expect(typeof result.toggleSidebar).toBe('function');
    expect(typeof result.resizerProps).toBe('object');
  });

  it('toggles sidebarCollapsed', () => {
    let value;
    const Test = () => {
      value = useMainRouteLayoutWebShell();
      return null;
    };
    const { rerender } = require('@testing-library/react-native').render(React.createElement(Test));

    expect(value.sidebarCollapsed).toBe(false);
    act(() => value.toggleSidebar());
    rerender(React.createElement(Test));
    expect(value.sidebarCollapsed).toBe(true);
    act(() => value.toggleSidebar());
    rerender(React.createElement(Test));
    expect(value.sidebarCollapsed).toBe(false);
  });

  it('keyboard resizer adjusts width when expanded', () => {
    let value;
    const Test = () => {
      value = useMainRouteLayoutWebShell();
      return null;
    };
    const { rerender } = require('@testing-library/react-native').render(React.createElement(Test));

    const startWidth = value.sidebarWidth;
    act(() => value.resizerProps.onKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() }));
    rerender(React.createElement(Test));
    expect(value.sidebarWidth).toBeGreaterThan(startWidth);
  });

  it('keyboard resizer does nothing when collapsed', () => {
    let value;
    const Test = () => {
      value = useMainRouteLayoutWebShell();
      return null;
    };
    const { rerender } = require('@testing-library/react-native').render(React.createElement(Test));

    act(() => value.toggleSidebar());
    rerender(React.createElement(Test));
    const startWidth = value.sidebarWidth;
    act(() => value.resizerProps.onKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() }));
    rerender(React.createElement(Test));
    expect(value.sidebarWidth).toBe(startWidth);
  });
});

