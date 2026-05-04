/**
 * FilterBar Pattern - Web
 * Multiple Chip components composition
 * File: FilterBar.web.jsx
 */

// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { Chip } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer } from './FilterBar.web.styles';

// 5. Component-specific hook (relative import)
import useFilterBar from './useFilterBar';

/**
 * FilterBar component for Web
 * @param {Object} props - FilterBar props
 * @param {Array} props.filters - Array of filter objects { id, label, active, onRemove }
 * @param {Function} props.onFilterPress - Handler when filter is pressed
 * @param {Function} props.onClearAll - Handler to clear all filters
 * @param {boolean} props.showClearAll - Show clear all button
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const FilterBarWeb = ({
  filters = [],
  onFilterPress,
  onClearAll,
  showClearAll = true,
  accessibilityLabel,
  testID,
  className,
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
      className={className}
      style={style}
      data-testid={testID}
      role="group"
      aria-label={accessibilityLabel || defaultAccessibilityLabel}
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

export default FilterBarWeb;

