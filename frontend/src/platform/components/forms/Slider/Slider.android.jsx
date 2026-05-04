/**
 * Slider Component - Android
 * Range input
 * File: Slider.android.jsx
 */
import React from 'react';
import { StyledSlider, StyledSliderTrack, StyledSliderFill, StyledSliderThumb } from './Slider.android.styles';

/**
 * Slider component for Android
 * @param {Object} props - Slider props
 * @param {number} props.value - Current value
 * @param {number} props.minimumValue - Minimum value (default: 0)
 * @param {number} props.maximumValue - Maximum value (default: 100)
 * @param {Function} props.onValueChange - Value change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const SliderAndroid = ({
  value = 0,
  minimumValue = 0,
  maximumValue = 100,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const clampedValue = Math.min(Math.max(value, minimumValue), maximumValue);
  const percentage = ((clampedValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <StyledSlider
      accessibilityRole="slider"
      accessibilityValue={{ min: minimumValue, max: maximumValue, now: clampedValue }}
      accessibilityLabel={accessibilityLabel || `Slider: ${clampedValue}`}
      accessibilityState={{ disabled }}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledSliderTrack disabled={disabled}>
        <StyledSliderFill percentage={percentage} disabled={disabled} />
        <StyledSliderThumb percentage={percentage} disabled={disabled} />
      </StyledSliderTrack>
    </StyledSlider>
  );
};

export default SliderAndroid;

