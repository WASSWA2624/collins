/**
 * Checkbox Component - Web
 * Single/multiple selection
 * File: Checkbox.web.jsx
 */

import React from 'react';
import {
  StyledCheckbox,
  StyledCheckboxInput,
  StyledCheckboxBox,
  StyledCheckboxCheck,
  StyledCheckboxLabel,
} from './Checkbox.web.styles';

/**
 * Checkbox component for Web
 * @param {Object} props - Checkbox props
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.label - Checkbox label
 * @param {string} props.value - Checkbox value
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const CheckboxWeb = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  value,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  style,
  id,
  name,
  ...rest
}) => {
  const reactId = typeof React.useId === 'function' ? React.useId() : undefined;
  const inputId =
    id ||
    (typeof testID === 'string' && testID.length > 0 ? `checkbox-${testID}` : undefined) ||
    (typeof name === 'string' && name.length > 0 ? `checkbox-${name}` : undefined) ||
    (typeof value === 'string' && value.length > 0 ? `checkbox-${value}` : undefined) ||
    (reactId ? `checkbox-${reactId}` : undefined);

  const computedA11yLabel =
    accessibilityLabel ||
    label ||
    (typeof value === 'string' ? value : undefined) ||
    (typeof testID === 'string' ? testID : undefined);

  const handleChange = (event) => {
    if (disabled || !onChange) return;
    const nextChecked =
      event && event.target && typeof event.target.checked === 'boolean'
        ? event.target.checked
        : !checked;
    onChange(nextChecked, value);
  };

  return (
    <StyledCheckbox
      disabled={disabled}
      className={className}
      style={style}
      {...rest}
    >
      <StyledCheckboxInput
        id={inputId}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={computedA11yLabel}
        aria-description={accessibilityHint}
        onChange={handleChange}
        data-testid={testID}
      />
      <StyledCheckboxBox
        checked={checked}
        disabled={disabled}
        aria-hidden="true"
      >
        {checked && <StyledCheckboxCheck aria-hidden="true" />}
      </StyledCheckboxBox>
      {label && (
        <StyledCheckboxLabel disabled={disabled}>
          {label}
        </StyledCheckboxLabel>
      )}
    </StyledCheckbox>
  );
};

export default CheckboxWeb;

