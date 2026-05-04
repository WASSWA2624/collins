/**
 * ThemeControls Component - iOS
 * File: ThemeControls.ios.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import Select from '../../forms/Select';
import useThemeControls from './useThemeControls';
import { StyledThemeControls } from './ThemeControls.ios.styles';

/**
 * ThemeControls component for iOS
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 */
const ThemeControlsIOS = ({ testID, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { theme, options, setTheme } = useThemeControls();
  const label = t('settings.theme.label');
  const resolvedLabel = accessibilityLabel || t('settings.theme.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.theme.hint');

  return (
    <StyledThemeControls testID={testID}>
      <Select
        label={label}
        value={theme}
        options={options}
        onValueChange={setTheme}
        accessibilityLabel={resolvedLabel}
        accessibilityHint={resolvedHint}
        testID={testID ? `${testID}-select` : undefined}
      />
    </StyledThemeControls>
  );
};

export default ThemeControlsIOS;
