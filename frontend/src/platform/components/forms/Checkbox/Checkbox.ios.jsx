/**
 * Checkbox Component - iOS
 * Single/multiple selection
 * File: Checkbox.ios.jsx
 */

import React from 'react';
import { StyledCheckbox, StyledCheckboxBox, StyledCheckboxCheck, StyledCheckboxLabel } from './Checkbox.ios.styles';

/**
 * Checkbox component for iOS
 * @param {Object} props - Checkbox props
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.label - Checkbox label
 * @param {string} props.value - Checkbox value
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const CheckboxIOS = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  value,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked, value);
    }
  };

  return (
    <StyledCheckbox
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel || label}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledCheckboxBox checked={checked} disabled={disabled}>
        {checked && <StyledCheckboxCheck />}
      </StyledCheckboxBox>
      {label && <StyledCheckboxLabel disabled={disabled}>{label}</StyledCheckboxLabel>}
    </StyledCheckbox>
  );
};

export default CheckboxIOS;

