/**
 * LanguageControls Component - Web
 * File: LanguageControls.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import { Select } from '@platform/components';
import useLanguageControls from './useLanguageControls';
import { StyledLanguageControls } from './LanguageControls.web.styles';

/**
 * LanguageControls component for Web
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.className]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 */
const LanguageControlsWeb = ({ testID, className, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { locale, options, setLocale } = useLanguageControls();
  const label = t('settings.language.label');
  const resolvedLabel = accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');

  return (
    <StyledLanguageControls data-testid={testID} className={className}>
      <Select
        label={label}
        value={locale}
        options={options}
        onValueChange={setLocale}
        compact
        accessibilityLabel={resolvedLabel}
        accessibilityHint={resolvedHint}
        testID={testID ? `${testID}-select` : undefined}
      />
    </StyledLanguageControls>
  );
};

export default LanguageControlsWeb;
