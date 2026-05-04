/**
 * useSwitch
 * Shared logic hook for Switch component
 * File: useSwitch.js
 */

import { useCallback, useMemo } from 'react';
import { useI18n } from '@hooks';

/**
 * @param {Object} params
 * @param {boolean} params.value
 * @param {Function} params.onValueChange
 * @param {boolean} params.disabled
 * @param {string} params.label
 * @param {string} params.accessibilityLabel
 */
const useSwitch = ({ value, onValueChange, disabled, label, accessibilityLabel }) => {
  const { t } = useI18n();

  const computedAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    if (label) return label;
    // Use i18n for default state labels
    return value ? t('common.on') : t('common.off');
  }, [accessibilityLabel, label, value, t]);

  const handleToggle = useCallback(() => {
    if (disabled || !onValueChange) return;
    onValueChange(!value);
  }, [disabled, onValueChange, value]);

  return { computedAccessibilityLabel, handleToggle };
};

export { useSwitch };

