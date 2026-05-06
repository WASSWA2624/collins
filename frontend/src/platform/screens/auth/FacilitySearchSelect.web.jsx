/**
 * FacilitySearchSelect - Web
 * Searchable registration-time facility selector.
 * File: FacilitySearchSelect.web.jsx
 */
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Text, TextField } from '@platform/components';

const MAX_VISIBLE_OPTIONS = 18;

const normalize = (value) => String(value || '').trim().toLowerCase();

const describeFacility = (facility) =>
  [facility?.district, facility?.region, facility?.ownership].filter(Boolean).join(' - ');

const FacilitySearchSelectWeb = ({
  label,
  placeholder,
  helperText,
  selectedHelper,
  noResultsText,
  clearLabel,
  query,
  onQueryChange,
  value,
  onValueChange,
  onClear,
  options = [],
  disabled = false,
  accessibilityHint,
  testID = 'facility-search-select',
}) => {
  const selectedMatchesQuery = Boolean(value) && normalize(query) === normalize(value.name);
  const hasQuery = normalize(query).length > 0;
  const visibleOptions = useMemo(() => {
    if (!hasQuery || selectedMatchesQuery) return [];
    return options.slice(0, MAX_VISIBLE_OPTIONS);
  }, [hasQuery, options, selectedMatchesQuery]);
  const showNoResults = hasQuery && !selectedMatchesQuery && visibleOptions.length === 0;
  const fieldHelperText = value
    ? selectedHelper || describeFacility(value)
    : helperText;
  const listboxId = `${testID}-options`;

  const handleSelect = useCallback((facility) => {
    if (disabled) return;
    onValueChange(facility);
  }, [disabled, onValueChange]);

  return (
    <StyledContainer data-testid={testID}>
      <TextField
        label={label}
        placeholder={placeholder}
        value={query}
        onChangeText={onQueryChange}
        autoCapitalize="words"
        disabled={disabled}
        validationState="default"
        helperText={fieldHelperText}
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint || helperText}
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={visibleOptions.length > 0}
        testID={`${testID}-input`}
      />

      {visibleOptions.length > 0 ? (
        <StyledOptionsPanel
          id={listboxId}
          role="listbox"
          aria-label={label}
          data-testid={listboxId}
        >
          {visibleOptions.map((facility, index) => (
            <StyledOption
              key={facility.id}
              type="button"
              role="option"
              aria-label={`${facility.name}, ${describeFacility(facility)}`}
              aria-selected="false"
              disabled={disabled}
              onClick={() => handleSelect(facility)}
              data-testid={`${testID}-option-${index}`}
            >
              <Text variant="label" testID={`${testID}-option-${index}-name`}>
                {facility.name}
              </Text>
              <Text variant="caption" color="text.secondary">
                {describeFacility(facility)}
              </Text>
            </StyledOption>
          ))}
        </StyledOptionsPanel>
      ) : null}

      {showNoResults ? (
        <StyledEmptyState data-testid={`${testID}-empty`}>
          <Text variant="caption" color="text.secondary">
            {noResultsText}
          </Text>
        </StyledEmptyState>
      ) : null}

      {value && onClear ? (
        <StyledClearAction>
          <Button
            variant="text"
            text={clearLabel}
            onPress={onClear}
            onClick={onClear}
            accessibilityLabel={clearLabel}
            disabled={disabled}
            testID={`${testID}-clear`}
          />
        </StyledClearAction>
      ) : null}
    </StyledContainer>
  );
};

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'FacilitySearchSelectContainer',
})`
  width: 100%;
`;

const StyledOptionsPanel = styled.div.withConfig({
  displayName: 'StyledOptionsPanel',
  componentId: 'FacilitySearchSelectOptions',
})`
  width: 100%;
  max-height: 280px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const StyledOption = styled.button.withConfig({
  displayName: 'StyledOption',
  componentId: 'FacilitySearchSelectOption',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.background.secondary};
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledEmptyState = styled.div.withConfig({
  displayName: 'StyledEmptyState',
  componentId: 'FacilitySearchSelectEmpty',
})`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  box-sizing: border-box;
`;

const StyledClearAction = styled.div.withConfig({
  displayName: 'StyledClearAction',
  componentId: 'FacilitySearchSelectClear',
})`
  width: max-content;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export default FacilitySearchSelectWeb;
