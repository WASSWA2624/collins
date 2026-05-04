/**
 * Card iOS Styles
 * Styled-components for iOS platform
 * File: Card.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledCard = styled.View.withConfig({
  displayName: 'StyledCard',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  ${({ variant, theme }) => {
    if (variant === 'elevated') {
      return `
        shadow-color: ${theme.shadows.md.shadowColor};
        shadow-offset: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px;
        shadow-opacity: ${theme.shadows.md.shadowOpacity};
        shadow-radius: ${theme.shadows.md.shadowRadius}px;
        elevation: ${theme.shadows.md.elevation};
      `;
    }
    if (variant === 'outlined') {
      return `
        border-width: 1px;
        border-color: ${theme.colors.background.tertiary};
      `;
    }
    return '';
  }}
`;

const StyledCardHeader = styled.View.withConfig({
  displayName: 'StyledCardHeader',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: ${({ hasBody, hasFooter }) => (hasBody || hasFooter ? 1 : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledCardBody = styled.View.withConfig({
  displayName: 'StyledCardBody',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  ${({ hasHeader, hasFooter }) => {
    let styles = '';
    if (hasHeader) {
      styles += 'padding-top: 0;';
    }
    if (hasFooter) {
      styles += 'padding-bottom: 0;';
    }
    return styles;
  }}
`;

const StyledCardFooter = styled.View.withConfig({
  displayName: 'StyledCardFooter',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

export { StyledCard, StyledCardHeader, StyledCardBody, StyledCardFooter };


