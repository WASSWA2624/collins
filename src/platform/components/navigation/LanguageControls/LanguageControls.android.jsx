/**
 * LanguageControls Component - Android
 * File: LanguageControls.android.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import Select from '../../forms/Select';
import useLanguageControls from './useLanguageControls';
import { StyledLanguageControls } from './LanguageControls.android.styles';

/**
 * LanguageControls component for Android
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 */
const LanguageControlsAndroid = ({ testID, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { locale, options, setLocale } = useLanguageControls();
  const label = t('settings.language.label');
  const resolvedLabel = accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');

  return (
    <StyledLanguageControls testID={testID}>
      <Select
        label={label}
        value={locale}
        options={options}
        onValueChange={setLocale}
        accessibilityLabel={resolvedLabel}
        accessibilityHint={resolvedHint}
        testID={testID ? `${testID}-select` : undefined}
      />
    </StyledLanguageControls>
  );
};

export default LanguageControlsAndroid;
