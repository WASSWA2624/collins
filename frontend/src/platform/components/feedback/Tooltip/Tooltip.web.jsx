/**
 * Tooltip Component - Web
 * Contextual help on hover/focus
 * File: Tooltip.web.jsx
 */

import React from 'react';
import { StyledTooltip, StyledTooltipText } from './Tooltip.web.styles';
import { useI18n } from '@hooks';
import { POSITIONS } from './types';

/**
 * Tooltip component for Web
 * @param {Object} props - Tooltip props
 * @param {string} props.position - Tooltip position (top, bottom, left, right)
 * @param {boolean} props.visible - Visibility state
 * @param {string|React.ReactNode} props.text - Tooltip text
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.id - ID for aria-describedby association with trigger element
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const TooltipWeb = ({
  position = POSITIONS.TOP,
  visible = false,
  text,
  accessibilityLabel,
  id,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const textString = typeof text === 'string' && text ? text : null;
  const defaultAccessibilityLabel = accessibilityLabel || textString || t('common.tooltip');
  
  if (!visible) return null;

  return (
    <StyledTooltip
      id={id}
      position={position}
      role="tooltip"
      aria-label={defaultAccessibilityLabel}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledTooltipText>{text}</StyledTooltipText>
    </StyledTooltip>
  );
};

export default TooltipWeb;

