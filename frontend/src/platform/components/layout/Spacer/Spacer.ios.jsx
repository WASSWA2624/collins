/**
 * Spacer Component - iOS
 * File: Spacer.ios.jsx
 */

import React from 'react';
import { StyledSpacer } from './Spacer.ios.styles';
import { useSpacer } from './useSpacer';

/**
 * Spacer (layout)
 * @param {Object} props
 * @param {'vertical'|'horizontal'} props.axis
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'xxl'} props.size
 * @param {string} props.testID
 * @param {string} props.accessibilityLabel
 */
const SpacerIOS = ({
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

export default SpacerIOS;


