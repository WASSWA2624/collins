/**
 * ThemeControls Component - Web
 * File: ThemeControls.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import { Select } from '@platform/components';
import useThemeControls from './useThemeControls';
import { StyledThemeControls } from './ThemeControls.web.styles';

/**
 * ThemeControls component for Web
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.className]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 */
const ThemeControlsWeb = ({ testID, className, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { theme, options, setTheme } = useThemeControls();
  const label = t('settings.theme.label');
  const resolvedLabel = accessibilityLabel || t('settings.theme.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.theme.hint');

  return (
    <StyledThemeControls data-testid={testID} className={className}>
      <Select
        label={label}
        value={theme}
        options={options}
        onValueChange={setTheme}
        compact
        accessibilityLabel={resolvedLabel}
        accessibilityHint={resolvedHint}
        testID={testID ? `${testID}-select` : undefined}
      />
    </StyledThemeControls>
  );
};

export default ThemeControlsWeb;
