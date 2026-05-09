/**
 * FacilitySearchSelect - Native
 * Searchable registration-time facility selector.
 * File: FacilitySearchSelect.native.jsx
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { Button, Text } from '@platform/components';

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
  loadingText,
  errorText,
  clearLabel,
  query,
  onQueryChange,
  value,
  onValueChange,
  onClear,
  options = [],
  disabled = false,
  loading = false,
  accessibilityHint,
  testID = 'facility-search-select',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const closeTimerRef = useRef(null);

  const visibleOptions = useMemo(() => {
    if (!isOpen) return [];
    return options.slice(0, MAX_VISIBLE_OPTIONS);
  }, [isOpen, options]);
  const hasQuery = normalize(query).length > 0;
  const showNoResults = isOpen && !loading && hasQuery && visibleOptions.length === 0;
  const displayHelperText = value
    ? selectedHelper || describeFacility(value)
    : helperText;

  const openMenu = useCallback(() => {
    if (disabled) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  }, [disabled]);

  const closeMenuSoon = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 120);
  }, []);

  const handleSurfacePress = useCallback(() => {
    if (disabled) return;
    inputRef.current?.focus();
    setIsOpen(true);
  }, [disabled]);

  const handleQueryChange = useCallback((nextQuery) => {
    onQueryChange(nextQuery);
    setIsOpen(true);
  }, [onQueryChange]);

  const handleSelect = useCallback((facility) => {
    if (disabled) return;
    onValueChange(facility);
    setIsOpen(false);
    inputRef.current?.blur();
  }, [disabled, onValueChange]);

  return (
    <StyledContainer testID={testID}>
      {label ? (
        <Text variant="label">
          {label}
        </Text>
      ) : null}

      <StyledSelectSurface
        accessibilityLabel={label || placeholder}
        accessibilityHint={accessibilityHint || helperText}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: isOpen, disabled }}
        disabled={disabled}
        isOpen={isOpen}
        onPress={handleSurfacePress}
      >
        <StyledInput
          ref={inputRef}
          value={query}
          onChangeText={handleQueryChange}
          onFocus={openMenu}
          onBlur={closeMenuSoon}
          placeholder={placeholder}
          editable={!disabled}
          autoCapitalize="words"
          autoCorrect
          testID={`${testID}-input`}
        />
        <StyledChevron>
          {isOpen ? '^' : 'v'}
        </StyledChevron>
      </StyledSelectSurface>

      {isOpen && loading ? (
        <StyledEmptyState testID={`${testID}-loading`}>
          <Text variant="caption" color="text.secondary">
            {loadingText}
          </Text>
        </StyledEmptyState>
      ) : null}

      {isOpen && !loading && visibleOptions.length > 0 ? (
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

      {errorText ? (
        <StyledErrorText testID={`${testID}-error`}>
          {errorText}
        </StyledErrorText>
      ) : null}

      {showNoResults ? (
        <StyledEmptyState testID={`${testID}-empty`}>
          <Text variant="caption" color="text.secondary">
            {noResultsText}
          </Text>
        </StyledEmptyState>
      ) : null}

      {displayHelperText ? (
        <StyledHelperText>
          {displayHelperText}
        </StyledHelperText>
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

const StyledSelectSurface = styled(Pressable)`
  width: 100%;
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ isOpen, theme }) => (isOpen ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  min-width: 0px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledChevron = styled.Text`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
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

const StyledHelperText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledErrorText = styled(StyledHelperText)`
  color: ${({ theme }) => theme.colors.status?.error || '#B42318'};
`;

const StyledClearAction = styled.View`
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export default FacilitySearchSelectNative;
