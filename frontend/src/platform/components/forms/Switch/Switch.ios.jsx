/**
 * Switch Component - iOS
 * Toggle on/off
 * File: Switch.ios.jsx
 */

import React from 'react';
import { useSwitch } from './useSwitch';
import { StyledSwitch, StyledSwitchTrack, StyledSwitchThumb } from './Switch.ios.styles';

/**
 * Switch component for iOS
 * @param {Object} props - Switch props
 * @param {boolean} props.value - Switch value (on/off)
 * @param {Function} props.onValueChange - Value change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.label - Switch label
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const SwitchIOS = ({
  value = false,
  onValueChange,
  disabled = false,
  label,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  const { computedAccessibilityLabel, handleToggle } = useSwitch({
    value,
    onValueChange,
    disabled,
    label,
    accessibilityLabel,
  });

  return (
    <StyledSwitch
      onPress={handleToggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={computedAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledSwitchTrack value={value} disabled={disabled}>
        <StyledSwitchThumb value={value} disabled={disabled} />
      </StyledSwitchTrack>
    </StyledSwitch>
  );
};

export default SwitchIOS;

