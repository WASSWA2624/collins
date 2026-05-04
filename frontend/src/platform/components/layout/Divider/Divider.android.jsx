/**
 * Divider Component - Android
 * Visual separator
 * File: Divider.android.jsx
 */

import React from 'react';
import { StyledDivider } from './Divider.android.styles';
import { ORIENTATIONS } from './types';

/**
 * Divider component for Android
 * @param {Object} props - Divider props
 * @param {string} props.orientation - Orientation (horizontal, vertical)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const DividerAndroid = ({
  orientation = ORIENTATIONS.HORIZONTAL,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  return (
    <StyledDivider
      orientation={orientation}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    />
  );
};

export default DividerAndroid;

