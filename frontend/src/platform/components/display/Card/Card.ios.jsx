/**
 * Card Component - iOS
 * Card container component for iOS platform
 * File: Card.ios.jsx
 */
// 1. External dependencies
import React from 'react';

// 4. Styles (relative import - platform-specific)
import { StyledCard, StyledCardHeader, StyledCardBody, StyledCardFooter } from './Card.ios.styles';

// 6. Types and constants (relative import)
import { VARIANTS } from './types';

/**
 * Card component for iOS
 * @param {Object} props - Card props
 * @param {string} props.variant - Card variant (elevated, outlined)
 * @param {React.ReactNode} props.children - Card content (body)
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const CardIOS = ({
  variant = VARIANTS.ELEVATED,
  children,
  header,
  footer,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  const hasHeader = !!header;
  const hasBody = !!children;
  const hasFooter = !!footer;

  return (
    <StyledCard
      variant={variant}
      accessibilityRole="article"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={style}
      {...rest}
    >
      {header && (
        <StyledCardHeader hasBody={hasBody} hasFooter={hasFooter}>
          {header}
        </StyledCardHeader>
      )}
      {children && (
        <StyledCardBody hasHeader={hasHeader} hasFooter={hasFooter}>
          {children}
        </StyledCardBody>
      )}
      {footer && (
        <StyledCardFooter>
          {footer}
        </StyledCardFooter>
      )}
    </StyledCard>
  );
};

export default CardIOS;

