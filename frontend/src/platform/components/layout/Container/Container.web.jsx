/**
 * Container Component - Web
 * Max-width container for content
 * File: Container.web.jsx
 */
import React from 'react';
import { StyledContainer } from './Container.web.styles';
import { SIZES } from './types';

/**
 * Container component for Web
 * @param {Object} props - Container props
 * @param {string} props.size - Container size (small, medium, large, full)
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ContainerWeb = ({
  size = SIZES.MEDIUM,
  children,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  return (
    <StyledContainer
      size={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </StyledContainer>
  );
};

export default ContainerWeb;

