/**
 * FilterBar Pattern - Android
 * Multiple Chip components composition
 * File: FilterBar.android.jsx
 */

import React from 'react';
import { Chip } from '@platform/components';
import { useI18n } from '@hooks';
import useFilterBar from './useFilterBar';
import { StyledContainer } from './FilterBar.android.styles';

const FilterBarAndroid = ({
  filters = [],
  onFilterPress,
  onClearAll,
  showClearAll = true,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const defaultAccessibilityLabel = t('common.filters');

  if (!filters || filters.length === 0) {
    return null;
  }

  const { activeFilters, hasActiveFilters } = useFilterBar({
    filters,
    onFilterPress,
    onClearAll,
  });

  return (
    <StyledContainer
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      {...rest}
    >
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          variant={filter.active ? 'primary' : 'outline'}
          removable={filter.active && filter.onRemove}
          onRemove={filter.onRemove}
          onPress={onFilterPress ? () => onFilterPress(filter) : undefined}
          accessibilityLabel={filter.label}
          testID={testID ? `${testID}-filter-${filter.id}` : undefined}
        >
          {filter.label}
        </Chip>
      ))}
      {showClearAll && hasActiveFilters && onClearAll && (
        <Chip
          variant="text"
          onPress={onClearAll}
          accessibilityLabel={t('common.clearAllFilters')}
          testID={testID ? `${testID}-clear-all` : undefined}
        >
          {t('common.clearAll')}
        </Chip>
      )}
    </StyledContainer>
  );
};

export default FilterBarAndroid;

