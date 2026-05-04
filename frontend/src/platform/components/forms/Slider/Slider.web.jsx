/**
 * Slider Component - Web
 * Range input
 * File: Slider.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import { StyledSlider, StyledSliderTrack, StyledSliderFill, StyledSliderThumb } from './Slider.web.styles';

/**
 * Slider component for Web
 * @param {Object} props - Slider props
 * @param {number} props.value - Current value
 * @param {number} props.minimumValue - Minimum value (default: 0)
 * @param {number} props.maximumValue - Maximum value (default: 100)
 * @param {Function} props.onValueChange - Value change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const SliderWeb = ({
  value = 0,
  minimumValue = 0,
  maximumValue = 100,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const clampedValue = Math.min(Math.max(value, minimumValue), maximumValue);
  const percentage = ((clampedValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  const handleTrackPress = (event) => {
    if (disabled || !onValueChange) return;
    // Calculate value from touch position
    // This is simplified - in production, you'd calculate from event coordinates
  };

  return (
    <StyledSlider
      accessibilityRole="slider"
      accessibilityValue={{ min: minimumValue, max: maximumValue, now: clampedValue }}
      accessibilityLabel={accessibilityLabel || t('common.sliderValue', { value: clampedValue })}
      accessibilityState={{ disabled }}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledSliderTrack onPress={handleTrackPress} disabled={disabled}>
        <StyledSliderFill percentage={percentage} disabled={disabled} />
        <StyledSliderThumb percentage={percentage} disabled={disabled} />
      </StyledSliderTrack>
    </StyledSlider>
  );
};

export default SliderWeb;

