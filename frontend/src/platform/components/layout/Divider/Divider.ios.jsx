/**
 * Divider Component - iOS
 * Visual separator
 * File: Divider.ios.jsx
 */

import React from 'react';
import { StyledDivider } from './Divider.ios.styles';
import { ORIENTATIONS } from './types';

/**
 * Divider component for iOS
 * @param {Object} props - Divider props
 * @param {string} props.orientation - Orientation (horizontal, vertical)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const DividerIOS = ({
  orientation = ORIENTATIONS.HORIZONTAL,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  return (
    <StyledDivider
      orientation={orientation}
      accessibilityRole="separator"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    />
  );
};

export default DividerIOS;

