/**
 * Divider Component - Web
 * Visual separator
 * File: Divider.web.jsx
 */

import React from 'react';
import { StyledDivider } from './Divider.web.styles';
import { ORIENTATIONS } from './types';

/**
 * Divider component for Web
 * @param {Object} props - Divider props
 * @param {string} props.orientation - Orientation (horizontal, vertical)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const DividerWeb = ({
  orientation = ORIENTATIONS.HORIZONTAL,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  return (
    <StyledDivider
      orientation={orientation}
      role="separator"
      aria-label={accessibilityLabel}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    />
  );
};

export default DividerWeb;

