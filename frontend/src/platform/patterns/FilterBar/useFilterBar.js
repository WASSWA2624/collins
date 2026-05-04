/**
 * useFilterBar Hook
 * Shared logic for FilterBar pattern across all platforms
 * File: useFilterBar.js
 */

import { useMemo } from 'react';

/**
 * Hook for FilterBar component logic
 * @param {Object} params - Hook parameters
 * @param {Array} params.filters - Array of filter objects
 * @param {Function} params.onFilterPress - Handler when filter is pressed
 * @param {Function} params.onClearAll - Handler to clear all filters
 * @returns {Object} FilterBar state and handlers
 */
const useFilterBar = ({
  filters = [],
  onFilterPress,
  onClearAll,
}) => {
  const activeFilters = useMemo(
    () => filters.filter((f) => f.active),
    [filters]
  );

  const hasActiveFilters = activeFilters.length > 0;

  const handleFilterPress = (filter) => {
    if (onFilterPress) {
      onFilterPress(filter);
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  return {
    activeFilters,
    hasActiveFilters,
    handleFilterPress,
    handleClearAll,
  };
};

export default useFilterBar;

