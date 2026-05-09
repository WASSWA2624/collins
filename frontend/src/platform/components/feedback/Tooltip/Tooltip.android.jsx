/**
 * Tooltip Component - Android
 * Contextual help on long press
 * File: Tooltip.android.jsx
 */

import React from 'react';
import { StyledTooltip, StyledTooltipText } from './Tooltip.android.styles';
import { useI18n } from '@hooks';
import { POSITIONS } from './types';

/**
 * Tooltip component for Android
 * @param {Object} props - Tooltip props
 * @param {string} props.position - Tooltip position (top, bottom, left, right)
 * @param {boolean} props.visible - Visibility state
 * @param {string|React.ReactNode} props.text - Tooltip text
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const TooltipAndroid = ({
  position = POSITIONS.TOP,
  visible = false,
  text,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const textString = typeof text === 'string' && text ? text : null;
  const defaultAccessibilityLabel = accessibilityLabel || textString || t('common.tooltip');
  
  if (!visible) return null;

  return (
    <StyledTooltip
      position={position}
      accessibilityLabel={defaultAccessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledTooltipText>{text}</StyledTooltipText>
    </StyledTooltip>
  );
};

export default TooltipAndroid;

