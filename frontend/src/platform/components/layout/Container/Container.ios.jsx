/**
 * Container Component - iOS
 * Max-width container for content
 * File: Container.ios.jsx
 */
import React from 'react';
import { StyledContainer } from './Container.ios.styles';
import { SIZES } from './types';

/**
 * Container component for iOS
 * @param {Object} props - Container props
 * @param {string} props.size - Container size (small, medium, large, full)
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ContainerIOS = ({
  size = SIZES.MEDIUM,
  children,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  return (
    <StyledContainer
      size={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      {children}
    </StyledContainer>
  );
};

export default ContainerIOS;

