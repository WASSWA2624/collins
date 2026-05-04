/**
 * Container Component - Android
 * Max-width container for content
 * File: Container.android.jsx
 */
import React from 'react';
import { StyledContainer } from './Container.android.styles';
import { SIZES } from './types';

/**
 * Container component for Android
 * @param {Object} props - Container props
 * @param {string} props.size - Container size (small, medium, large, full)
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ContainerAndroid = ({
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

export default ContainerAndroid;

