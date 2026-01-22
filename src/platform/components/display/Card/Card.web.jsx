/**
 * Card Component - Web
 * Card container component for Web platform
 * File: Card.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 4. Styles (relative import - platform-specific)
import { StyledCard, StyledCardHeader, StyledCardBody, StyledCardFooter } from './Card.web.styles';

// 6. Types and constants (relative import)
import { VARIANTS } from './types';

/**
 * Card component for Web
 * @param {Object} props - Card props
 * @param {string} props.variant - Card variant (elevated, outlined)
 * @param {React.ReactNode} props.children - Card content (body)
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const CardWeb = ({
  variant = VARIANTS.ELEVATED,
  children,
  header,
  footer,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  style,
  ...rest
}) => {
  const hasHeader = !!header;
  const hasBody = !!children;
  const hasFooter = !!footer;

  return (
    <StyledCard
      variant={variant}
      role="article"
      aria-label={accessibilityLabel}
      aria-description={accessibilityHint}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    >
      {header && (
        <StyledCardHeader $hasBody={hasBody} $hasFooter={hasFooter}>
          {header}
        </StyledCardHeader>
      )}
      {children && (
        <StyledCardBody $hasHeader={hasHeader} $hasFooter={hasFooter}>
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

export default CardWeb;

