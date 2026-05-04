/**
 * Switch Component - Web
 * Toggle on/off
 * File: Switch.web.jsx
 */

import React from 'react';
import { useSwitch } from './useSwitch';
import {
  StyledSwitch,
  StyledSwitchInput,
  StyledSwitchTrack,
  StyledSwitchThumb,
  StyledSwitchLabel,
} from './Switch.web.styles';

/**
 * Switch component for Web
 * @param {Object} props - Switch props
 * @param {boolean} props.value - Switch value (on/off)
 * @param {Function} props.onValueChange - Value change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.label - Visible label
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const SwitchWeb = ({
  value = false,
  onValueChange,
  disabled = false,
  label,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  style,
  id,
  name,
  ...rest
}) => {
  const { computedAccessibilityLabel, handleToggle } = useSwitch({
    value,
    onValueChange,
    disabled,
    label,
    accessibilityLabel,
  });

  const reactId = typeof React.useId === 'function' ? React.useId() : undefined;
  const inputId =
    id ||
    (typeof testID === 'string' && testID.length > 0 ? `switch-${testID}` : undefined) ||
    (typeof name === 'string' && name.length > 0 ? `switch-${name}` : undefined) ||
    (reactId ? `switch-${reactId}` : undefined);

  /**
   * Handle change event from input
   * @param {Event} event - Change event
   * @returns {void}
   */
  const handleChange = (event) => {
    if (disabled || !onValueChange) return;
    // Use the event's checked value if available, otherwise toggle
    const nextChecked =
      event && event.target && typeof event.target.checked === 'boolean'
        ? event.target.checked
        : !value;
    onValueChange(nextChecked);
  };

  // Export handleChange for testing (coverage)
  // istanbul ignore else - jest is always defined in test environment
  if (typeof jest !== 'undefined') {
    SwitchWeb.__handleChange = handleChange;
  }

  return (
    <StyledSwitch disabled={disabled} className={className} style={style} {...rest}>
      <StyledSwitchInput
        id={inputId}
        name={name}
        type="checkbox"
        role="switch"
        checked={value}
        disabled={disabled}
        aria-label={computedAccessibilityLabel}
        aria-description={accessibilityHint}
        onChange={handleChange}
        data-testid={testID}
      />
      <StyledSwitchTrack value={value} disabled={disabled} aria-hidden="true">
        <StyledSwitchThumb value={value} disabled={disabled} aria-hidden="true" />
      </StyledSwitchTrack>
      {label && <StyledSwitchLabel disabled={disabled}>{label}</StyledSwitchLabel>}
    </StyledSwitch>
  );
};

export default SwitchWeb;

