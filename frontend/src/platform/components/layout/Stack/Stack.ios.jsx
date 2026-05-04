/**
 * Stack Component - iOS
 * File: Stack.ios.jsx
 */

import React from 'react';
import { StyledStack } from './Stack.ios.styles';
import { useStack } from './useStack';

/**
 * Stack (layout)
 * @param {Object} props
 * @param {'vertical'|'horizontal'} props.direction
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'xxl'} props.spacing
 * @param {string} props.align - align-items
 * @param {string} props.justify - justify-content
 * @param {boolean} props.wrap
 * @param {React.ReactNode} props.children
 * @param {string} props.testID
 * @param {string} props.accessibilityLabel
 */
const StackIOS = ({
  direction,
  spacing,
  align,
  justify,
  wrap,
  children,
  testID,
  accessibilityLabel,
  ...rest
}) => {
  const stack = useStack({ direction, spacing, align, justify, wrap });

  return (
    <StyledStack
      {...rest}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      direction={stack.direction}
      spacing={stack.spacing}
      align={stack.align}
      justify={stack.justify}
      wrap={stack.wrap}
    >
      {children}
    </StyledStack>
  );
};

export default StackIOS;


