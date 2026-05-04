/**
 * useRadio
 * Shared logic hook for Radio component
 * File: useRadio.js
 */

import { useCallback, useMemo } from 'react';

/**
 * @param {Object} params
 * @param {boolean} params.disabled
 * @param {*} params.value
 * @param {Function} params.onChange
 * @param {Function} params.onPress - Back-compat alias for onChange
 * @param {string} params.label
 * @param {string} params.accessibilityLabel
 */
const useRadio = ({ disabled, value, onChange, onPress, label, accessibilityLabel }) => {
  const computedAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    if (label) return label;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return null; // Component will handle i18n fallback
  }, [accessibilityLabel, label, value]);

  const handleSelect = useCallback(() => {
    if (disabled) return;
    const handler = onChange || onPress;
    if (typeof handler === 'function') handler(value);
  }, [disabled, onChange, onPress, value]);

  return { computedAccessibilityLabel, handleSelect };
};

export { useRadio };


