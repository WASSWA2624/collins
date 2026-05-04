/**
 * Radio Component - Android
 * Single selection control (presentation-only)
 * File: Radio.android.jsx
 */

import React from 'react';
import { useRadio } from './useRadio';
import { useI18n } from '@hooks';
import { StyledRadio, StyledRadioCircle, StyledRadioDot, StyledRadioLabel } from './Radio.android.styles';

/**
 * Radio component for Android
 * @param {Object} props - Radio props
 * @param {boolean} props.selected - Selected state
 * @param {Function} props.onChange - Called with value when selected
 * @param {Function} props.onPress - Back-compat alias for onChange
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.label - Radio label
 * @param {*} props.value - Radio value
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const RadioAndroid = ({
  selected = false,
  onChange,
  onPress,
  disabled = false,
  label,
  value,
  accessibilityLabel,
  testID,
  ...rest
}) => {
  const { t } = useI18n();
  const { computedAccessibilityLabel, handleSelect } = useRadio({
    disabled,
    value,
    onChange,
    onPress,
    label,
    accessibilityLabel,
  });

  const finalAccessibilityLabel = computedAccessibilityLabel || t('common.radio');

  return (
    <StyledRadio
      onPress={handleSelect}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={finalAccessibilityLabel}
      testID={testID}
      {...rest}
    >
      <StyledRadioCircle selected={selected} disabled={disabled}>
        {selected && <StyledRadioDot />}
      </StyledRadioCircle>
      {label && <StyledRadioLabel disabled={disabled}>{label}</StyledRadioLabel>}
    </StyledRadio>
  );
};

export default RadioAndroid;

