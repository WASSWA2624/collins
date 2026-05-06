/**
 * FacilitySearchSelect - Native
 * Searchable registration-time facility selector.
 * File: FacilitySearchSelect.native.jsx
 */
import React, { useCallback, useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Button, Text, TextField } from '@platform/components';

const MAX_VISIBLE_OPTIONS = 18;

const normalize = (value) => String(value || '').trim().toLowerCase();

const describeFacility = (facility) =>
  [facility?.district, facility?.region, facility?.ownership].filter(Boolean).join(' - ');

const FacilitySearchSelectNative = ({
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

  const handleSelect = useCallback((facility) => {
    if (disabled) return;
    onValueChange(facility);
  }, [disabled, onValueChange]);

  return (
    <StyledContainer testID={testID}>
      <TextField
        label={label}
        placeholder={placeholder}
        value={query}
        onChangeText={onQueryChange}
        autoCapitalize="words"
        autoCorrect
        disabled={disabled}
        validationState="default"
        helperText={fieldHelperText}
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint || helperText}
        testID={`${testID}-input`}
      />

      {visibleOptions.length > 0 ? (
        <StyledOptionsPanel
          accessibilityLabel={label}
          accessibilityRole="list"
          testID={`${testID}-options`}
        >
          <StyledOptionsScroll
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {visibleOptions.map((facility, index) => (
              <StyledOption
                key={facility.id}
                accessibilityLabel={`${facility.name}, ${describeFacility(facility)}`}
                accessibilityRole="button"
                disabled={disabled}
                onPress={() => handleSelect(facility)}
                testID={`${testID}-option-${index}`}
              >
                <Text variant="label" testID={`${testID}-option-${index}-name`}>
                  {facility.name}
                </Text>
                <Text variant="caption" color="text.secondary">
                  {describeFacility(facility)}
                </Text>
              </StyledOption>
            ))}
          </StyledOptionsScroll>
        </StyledOptionsPanel>
      ) : null}

      {showNoResults ? (
        <StyledEmptyState testID={`${testID}-empty`}>
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

const StyledContainer = styled.View`
  width: 100%;
`;

const StyledOptionsPanel = styled.View`
  width: 100%;
  max-height: 280px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
`;

const StyledOptionsScroll = styled(ScrollView)`
  max-height: 280px;
`;

const StyledOption = styled(Pressable)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledEmptyState = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StyledClearAction = styled.View`
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export default FacilitySearchSelectNative;
