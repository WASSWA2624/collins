/**
 * useFilterBar Hook Tests
 * File: useFilterBar.test.js
 */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import useFilterBar from '@platform/patterns/FilterBar/useFilterBar';

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
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe('useFilterBar Hook', () => {
  describe('activeFilters computation', () => {
    it('should return empty array when filters is empty', () => {
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters: [] },
      });
      
      expect(result.current.activeFilters).toEqual([]);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should return empty array when filters is undefined', () => {
      const { result } = renderHook(useFilterBar, {
        initialProps: {},
      });
      
      expect(result.current.activeFilters).toEqual([]);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should filter active filters correctly', () => {
      const filters = [
        { id: '1', label: 'Filter 1', active: true },
        { id: '2', label: 'Filter 2', active: false },
        { id: '3', label: 'Filter 3', active: true },
        { id: '4', label: 'Filter 4', active: false },
      ];
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters },
      });
      
      expect(result.current.activeFilters).toEqual([
        { id: '1', label: 'Filter 1', active: true },
        { id: '3', label: 'Filter 3', active: true },
      ]);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should return empty array when no filters are active', () => {
      const filters = [
        { id: '1', label: 'Filter 1', active: false },
        { id: '2', label: 'Filter 2', active: false },
      ];
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters },
      });
      
      expect(result.current.activeFilters).toEqual([]);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should return all filters when all are active', () => {
      const filters = [
        { id: '1', label: 'Filter 1', active: true },
        { id: '2', label: 'Filter 2', active: true },
      ];
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters },
      });
      
      expect(result.current.activeFilters).toEqual(filters);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should recompute when filters change', () => {
      const initialFilters = [
        { id: '1', label: 'Filter 1', active: true },
        { id: '2', label: 'Filter 2', active: false },
      ];
      
      const { result, rerender } = renderHook(useFilterBar, {
        initialProps: { filters: initialFilters },
      });
      
      expect(result.current.activeFilters).toHaveLength(1);
      expect(result.current.hasActiveFilters).toBe(true);
      
      const updatedFilters = [
        { id: '1', label: 'Filter 1', active: false },
        { id: '2', label: 'Filter 2', active: false },
      ];
      
      rerender({ filters: updatedFilters });
      
      expect(result.current.activeFilters).toEqual([]);
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe('handleFilterPress', () => {
    it('should call onFilterPress when provided', () => {
      const onFilterPress = jest.fn();
      const filter = { id: '1', label: 'Filter 1', active: true };
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters: [filter], onFilterPress },
      });
      
      act(() => {
        result.current.handleFilterPress(filter);
      });
      
      expect(onFilterPress).toHaveBeenCalledWith(filter);
      expect(onFilterPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onFilterPress when not provided', () => {
      const filter = { id: '1', label: 'Filter 1', active: true };
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters: [filter] },
      });
      
      act(() => {
        result.current.handleFilterPress(filter);
      });
      
      // Should not throw
      expect(result.current.handleFilterPress).toBeDefined();
    });

    it('should handle multiple calls correctly', () => {
      const onFilterPress = jest.fn();
      const filter1 = { id: '1', label: 'Filter 1', active: true };
      const filter2 = { id: '2', label: 'Filter 2', active: false };
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters: [filter1, filter2], onFilterPress },
      });
      
      act(() => {
        result.current.handleFilterPress(filter1);
        result.current.handleFilterPress(filter2);
      });
      
      expect(onFilterPress).toHaveBeenCalledTimes(2);
      expect(onFilterPress).toHaveBeenNthCalledWith(1, filter1);
      expect(onFilterPress).toHaveBeenNthCalledWith(2, filter2);
    });
  });

  describe('handleClearAll', () => {
    it('should call onClearAll when provided', () => {
      const onClearAll = jest.fn();
      const filters = [
        { id: '1', label: 'Filter 1', active: true },
        { id: '2', label: 'Filter 2', active: false },
      ];
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters, onClearAll },
      });
      
      act(() => {
        result.current.handleClearAll();
      });
      
      expect(onClearAll).toHaveBeenCalledTimes(1);
      expect(onClearAll).toHaveBeenCalledWith();
    });

    it('should not call onClearAll when not provided', () => {
      const filters = [
        { id: '1', label: 'Filter 1', active: true },
      ];
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters },
      });
      
      act(() => {
        result.current.handleClearAll();
      });
      
      // Should not throw
      expect(result.current.handleClearAll).toBeDefined();
    });

    it('should handle multiple calls correctly', () => {
      const onClearAll = jest.fn();
      const filters = [
        { id: '1', label: 'Filter 1', active: true },
      ];
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters, onClearAll },
      });
      
      act(() => {
        result.current.handleClearAll();
        result.current.handleClearAll();
      });
      
      expect(onClearAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('return value structure', () => {
    it('should return all expected properties', () => {
      const filters = [
        { id: '1', label: 'Filter 1', active: true },
      ];
      const onFilterPress = jest.fn();
      const onClearAll = jest.fn();
      
      const { result } = renderHook(useFilterBar, {
        initialProps: { filters, onFilterPress, onClearAll },
      });
      
      expect(result.current).toHaveProperty('activeFilters');
      expect(result.current).toHaveProperty('hasActiveFilters');
      expect(result.current).toHaveProperty('handleFilterPress');
      expect(result.current).toHaveProperty('handleClearAll');
      
      expect(typeof result.current.activeFilters).toBe('object');
      expect(Array.isArray(result.current.activeFilters)).toBe(true);
      expect(typeof result.current.hasActiveFilters).toBe('boolean');
      expect(typeof result.current.handleFilterPress).toBe('function');
      expect(typeof result.current.handleClearAll).toBe('function');
    });
  });
});

