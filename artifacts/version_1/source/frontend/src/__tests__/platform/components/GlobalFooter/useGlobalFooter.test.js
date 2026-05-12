/**
 * useGlobalFooter Hook Tests
 * File: useGlobalFooter.test.js
 */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import useGlobalFooter from '@platform/components/navigation/GlobalFooter/useGlobalFooter';

const act = TestRenderer.act;

// Custom renderHook implementation to avoid @testing-library/react-hooks dependency
const renderHook = (hook, { initialProps } = {}) => {
  const result = {};
  let renderer;

  const HookHarness = ({ hookProps }) => {
    const hookResult = hook(hookProps || {});
    Object.assign(result, hookResult);
    return null;
  };

  act(() => {
    renderer = TestRenderer.create(<HookHarness hookProps={initialProps} />);
  });

  return {
    result: { current: result },
    rerender: (newProps) => {
      act(() => {
        renderer.update(<HookHarness hookProps={newProps} />);
      });
    },
  };
};

describe('useGlobalFooter Hook', () => {
  it('should return empty arrays when inputs are invalid', () => {
    const { result } = renderHook(() => useGlobalFooter({ legalLinks: null, quickActions: null }));
    expect(result.current.visibleLegalLinks).toEqual([]);
    expect(result.current.visibleQuickActions).toEqual([]);
    expect(result.current.hasLegalLinks).toBe(false);
    expect(result.current.hasQuickActions).toBe(false);
  });

  it('should filter items by currentRole', () => {
    const legalLinks = [
      { key: 'terms', roles: ['admin'] },
      { key: 'privacy', roles: ['user'] },
      { key: 'support' },
    ];
    const quickActions = [
      { key: 'help', roles: ['admin'] },
      { key: 'feedback', roles: ['user'] },
    ];

    const { result } = renderHook(() => useGlobalFooter({ legalLinks, quickActions, currentRole: 'admin' }));
    const legalKeys = result.current.visibleLegalLinks.map((item) => item.key);
    const actionKeys = result.current.visibleQuickActions.map((item) => item.key);

    expect(legalKeys).toContain('terms');
    expect(legalKeys).toContain('support');
    expect(legalKeys).not.toContain('privacy');
    expect(actionKeys).toContain('help');
    expect(actionKeys).not.toContain('feedback');
  });

  it('should hide role-scoped items when role is missing', () => {
    const legalLinks = [{ key: 'secure', roles: ['admin'] }];
    const quickActions = [{ key: 'help', roles: ['admin'] }];
    const { result } = renderHook(() => useGlobalFooter({ legalLinks, quickActions, currentRole: '' }));
    expect(result.current.visibleLegalLinks).toHaveLength(0);
    expect(result.current.visibleQuickActions).toHaveLength(0);
  });

  it('should exclude items marked as not visible', () => {
    const legalLinks = [{ key: 'terms', isVisible: false }, { key: 'privacy' }];
    const quickActions = [{ key: 'support', isVisible: false }, { key: 'help' }];
    const { result } = renderHook(() => useGlobalFooter({ legalLinks, quickActions }));
    const legalKeys = result.current.visibleLegalLinks.map((item) => item.key);
    const actionKeys = result.current.visibleQuickActions.map((item) => item.key);

    expect(legalKeys).toEqual(['privacy']);
    expect(actionKeys).toEqual(['help']);
  });
});
