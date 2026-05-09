/**
 * FacilitySearchSelect - Web
 * Searchable registration-time facility selector.
 * File: FacilitySearchSelect.web.jsx
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Text } from '@platform/components';

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
  const listboxId = `${testID}-options`;
  const inputId = `${testID}-input`;
  const helperId = `${testID}-helper`;

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

  const handleSurfaceMouseDown = useCallback(() => {
    openMenu();
    inputRef.current?.focus();
  }, [openMenu]);

  const handleChange = useCallback((event) => {
    onQueryChange(event.target.value);
    setIsOpen(true);
  }, [onQueryChange]);

  const handleSelect = useCallback((facility) => {
    if (disabled) return;
    onValueChange(facility);
    setIsOpen(false);
    inputRef.current?.blur();
  }, [disabled, onValueChange]);

  return (
    <StyledContainer data-testid={testID}>
      {label ? (
        <StyledLabel htmlFor={inputId}>
          {label}
        </StyledLabel>
      ) : null}

      <StyledSelectSurface
        $isOpen={isOpen}
        $disabled={disabled}
        onMouseDown={handleSurfaceMouseDown}
      >
        <StyledInput
          id={inputId}
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onClick={openMenu}
          onFocus={openMenu}
          onBlur={closeMenuSoon}
          placeholder={placeholder}
          disabled={disabled}
          autoCapitalize="words"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-describedby={displayHelperText ? helperId : undefined}
          aria-description={accessibilityHint || helperText}
          aria-expanded={isOpen}
          aria-label={label || placeholder}
          data-testid={inputId}
        />
        <StyledChevron aria-hidden="true">
          {isOpen ? '^' : 'v'}
        </StyledChevron>
      </StyledSelectSurface>

      {isOpen && loading ? (
        <StyledEmptyState data-testid={`${testID}-loading`}>
          <Text variant="caption" color="text.secondary">
            {loadingText}
          </Text>
        </StyledEmptyState>
      ) : null}

      {isOpen && !loading && visibleOptions.length > 0 ? (
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
              aria-selected={value?.id === facility.id}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
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

      {errorText ? (
        <StyledErrorText data-testid={`${testID}-error`}>
          {errorText}
        </StyledErrorText>
      ) : null}

      {showNoResults ? (
        <StyledEmptyState data-testid={`${testID}-empty`}>
          <Text variant="caption" color="text.secondary">
            {noResultsText}
          </Text>
        </StyledEmptyState>
      ) : null}

      {displayHelperText ? (
        <StyledHelperText id={helperId}>
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

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'FacilitySearchSelectContainer',
})`
  width: 100%;
`;

const StyledLabel = styled.label.withConfig({
  displayName: 'StyledLabel',
  componentId: 'FacilitySearchSelectLabel',
})`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSelectSurface = styled.div.withConfig({
  displayName: 'StyledSelectSurface',
  componentId: 'FacilitySearchSelectSurface',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.primary : theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ $isOpen, theme }) => ($isOpen ? `0 0 0 3px ${theme.colors.primary}15` : 'none')};
  box-sizing: border-box;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'text')};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
`;

const StyledInput = styled.input.withConfig({
  displayName: 'StyledInput',
  componentId: 'FacilitySearchSelectInput',
})`
  width: 100%;
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text.tertiary : theme.colors.text.primary)};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const StyledChevron = styled.span.withConfig({
  displayName: 'StyledChevron',
  componentId: 'FacilitySearchSelectChevron',
})`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: 1;
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
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.md;
    if (!shadow) return '0 8px 20px rgba(0, 0, 0, 0.12)';
    return `${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px ${shadow.shadowRadius * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity})`;
  }};
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

const StyledHelperText = styled.div.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'FacilitySearchSelectHelper',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledErrorText = styled(StyledHelperText).withConfig({
  displayName: 'StyledErrorText',
  componentId: 'FacilitySearchSelectError',
})`
  color: ${({ theme }) => theme.colors.status?.error || '#B42318'};
`;

const StyledClearAction = styled.div.withConfig({
  displayName: 'StyledClearAction',
  componentId: 'FacilitySearchSelectClear',
})`
  width: max-content;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export default FacilitySearchSelectWeb;
