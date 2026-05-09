/**
 * LanguageControls Component - Android
 * File: LanguageControls.android.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import Select from '@platform/components/forms/Select';
import useLanguageControls from './useLanguageControls';
import { StyledLanguageControls } from './LanguageControls.android.styles';

/**
 * LanguageControls component for Android
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 * @param {Object} [props.style]
 * @param {boolean} [props.compact]
 */
const LanguageControlsAndroid = ({
  testID,
  accessibilityLabel,
  accessibilityHint,
  style,
  compact = false,
}) => {
  const { t } = useI18n();
  const { locale, options, setLocale } = useLanguageControls();
  const label = t('settings.language.label');
  const resolvedLabel =
    accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');

  return (
    <StyledLanguageControls testID={testID} style={style}>
      <Select
        label={label}
        value={locale}
        options={options}
        onValueChange={setLocale}
        compact={compact}
        style={style}
        accessibilityLabel={resolvedLabel}
        accessibilityHint={resolvedHint}
        testID={testID ? `${testID}-select` : undefined}
      />
    </StyledLanguageControls>
  );
};

export default LanguageControlsAndroid;
