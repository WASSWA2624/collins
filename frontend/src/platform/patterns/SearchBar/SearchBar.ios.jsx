/**
 * SearchBar Pattern - iOS
 * Input + Icon + Clear button composition
 * File: SearchBar.ios.jsx
 */

import React from 'react';
import { Button, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useSearchBar from './useSearchBar';
import {
  StyledContainer,
  StyledSearchIcon,
  StyledClearButtonWrapper,
} from './SearchBar.ios.styles';

const SearchBarIOS = ({
  value = '',
  onChangeText,
  onSearch,
  placeholder,
  showClearButton = true,
  debounceMs = 300,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const { localValue, hasValue, handleChangeText, handleClear, handleSubmit } =
    useSearchBar({
      value,
      onChangeText,
      onSearch,
      debounceMs,
    });

  const placeholderText = placeholder || t('common.searchPlaceholder');
  const searchIconLabel = t('common.searchIcon');
  const clearButtonLabel = t('common.clearSearch');
  const searchIcon = '\ud83d\udd0d';
  const clearIcon = '\u00d7';
  // Only pass accessibilityLabel if explicitly provided, otherwise let TextField use placeholder fallback
  const accessibilityLabelText = accessibilityLabel;

  return (
    <StyledContainer style={style} testID={testID} {...rest}>
      <TextField
        value={localValue}
        onChangeText={handleChangeText}
        onSubmitEditing={() => handleSubmit()}
        placeholder={placeholderText}
        type="search"
        prefix={
          <StyledSearchIcon
            accessibilityLabel={searchIconLabel}
            testID={testID ? `${testID}-icon` : undefined}
          >
            {searchIcon}
          </StyledSearchIcon>
        }
        suffix={
          showClearButton && hasValue ? (
            <StyledClearButtonWrapper>
              <Button
                variant="text"
                size="small"
                onPress={handleClear}
                accessibilityLabel={clearButtonLabel}
                testID={testID ? `${testID}-clear` : undefined}
              >
                {clearIcon}
              </Button>
            </StyledClearButtonWrapper>
          ) : null
        }
        {...(accessibilityLabelText && {
          accessibilityLabel: accessibilityLabelText,
        })}
        testID={testID ? `${testID}-input` : undefined}
        style={{ marginBottom: 0 }}
      />
    </StyledContainer>
  );
};

export default SearchBarIOS;
