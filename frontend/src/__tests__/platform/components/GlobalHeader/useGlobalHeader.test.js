/**
 * useGlobalHeader Hook Tests
 * File: useGlobalHeader.test.js
 */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import useGlobalHeader from '@platform/components/navigation/GlobalHeader/useGlobalHeader';
import { ACTION_PLACEMENTS } from '@platform/components/navigation/GlobalHeader';

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

describe('useGlobalHeader Hook', () => {
  it('should return empty arrays when actions are invalid', () => {
    const { result } = renderHook(() => useGlobalHeader({ actions: null }));
    expect(result.current.primaryActions).toEqual([]);
    expect(result.current.secondaryActions).toEqual([]);
  });

  it('should filter actions by currentRole', () => {
    const actions = [
      { key: 'admin', roles: ['admin'] },
      { key: 'user', roles: ['user'] },
      { key: 'open' },
    ];
    const { result } = renderHook(() => useGlobalHeader({ actions, currentRole: 'admin' }));
    const keys = result.current.primaryActions.map((action) => action.key);
    expect(keys).toContain('admin');
    expect(keys).toContain('open');
    expect(keys).not.toContain('user');
  });

  it('should hide role-scoped actions when role is missing', () => {
    const actions = [{ key: 'secure', roles: ['admin'] }];
    const { result } = renderHook(() => useGlobalHeader({ actions, currentRole: '' }));
    expect(result.current.primaryActions).toHaveLength(0);
  });

  it('should split actions by placement', () => {
    const actions = [
      { key: 'primary' },
      { key: 'secondary', placement: ACTION_PLACEMENTS.SECONDARY },
    ];
    const { result } = renderHook(() => useGlobalHeader({ actions }));
    expect(result.current.primaryActions).toHaveLength(1);
    expect(result.current.secondaryActions).toHaveLength(1);
  });

  it('should set hasBreadcrumbs when items exist', () => {
    const { result } = renderHook(() =>
      useGlobalHeader({ breadcrumbs: [{ label: 'Home' }] })
    );
    expect(result.current.hasBreadcrumbs).toBe(true);
  });
});
