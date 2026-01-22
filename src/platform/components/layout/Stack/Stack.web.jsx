/**
 * Stack Component - Web
 * File: Stack.web.jsx
 */

import React from 'react';
import { StyledStack } from './Stack.web.styles';
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
 * @param {string} props.className
 */
const StackWeb = ({
  direction,
  spacing,
  align,
  justify,
  wrap,
  children,
  testID,
  accessibilityLabel,
  className,
  ...rest
}) => {
  const stack = useStack({ direction, spacing, align, justify, wrap });

  return (
    <StyledStack
      {...rest}
      data-testid={testID}
      aria-label={accessibilityLabel}
      className={className}
      $direction={stack.direction}
      $spacing={stack.spacing}
      $align={stack.align}
      $justify={stack.justify}
      $wrap={stack.wrap}
    >
      {children}
    </StyledStack>
  );
};

export default StackWeb;


