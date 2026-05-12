/**
 * ThemeControls Component - Android
 * File: ThemeControls.android.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import Select from '../../forms/Select';
import useThemeControls from './useThemeControls';
import { StyledThemeControls } from './ThemeControls.android.styles';

/**
 * ThemeControls component for Android
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 */
const ThemeControlsAndroid = ({ testID, accessibilityLabel, accessibilityHint }) => {
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

export default ThemeControlsAndroid;
