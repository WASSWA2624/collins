/**
 * Spacer Component - Android
 * File: Spacer.android.jsx
 */

import React from 'react';
import { StyledSpacer } from './Spacer.android.styles';
import { useSpacer } from './useSpacer';

/**
 * Spacer (layout)
 * @param {Object} props
 * @param {'vertical'|'horizontal'} props.axis
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'xxl'} props.size
 * @param {string} props.testID
 * @param {string} props.accessibilityLabel
 */
const SpacerAndroid = ({
  axis,
  size,
  testID,
  accessibilityLabel,
  ...rest
}) => {
  const spacer = useSpacer({ axis, size });

  return (
    <StyledSpacer
      {...rest}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      axis={spacer.axis}
      size={spacer.size}
    />
  );
};

export default SpacerAndroid;


