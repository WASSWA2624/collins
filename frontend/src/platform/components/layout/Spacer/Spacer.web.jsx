/**
 * Spacer Component - Web
 * File: Spacer.web.jsx
 */

import React from 'react';
import { StyledSpacer } from './Spacer.web.styles';
import { useSpacer } from './useSpacer';

/**
 * Spacer (layout)
 * @param {Object} props
 * @param {'vertical'|'horizontal'} props.axis
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'xxl'} props.size
 * @param {string} props.testID
 * @param {string} props.accessibilityLabel
 * @param {string} props.className
 */
const SpacerWeb = ({
  axis,
  size,
  testID,
  accessibilityLabel,
  className,
  ...rest
}) => {
  const spacer = useSpacer({ axis, size });

  return (
    <StyledSpacer
      {...rest}
      data-testid={testID}
      aria-label={accessibilityLabel}
      className={className}
      axis={spacer.axis}
      size={spacer.size}
    />
  );
};

export default SpacerWeb;


