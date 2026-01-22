/**
 * Card Web Styles
 * Styled-components for Web platform
 * File: Card.web.styles.jsx
 */

import styled from 'styled-components';

const StyledCard = styled.article.withConfig({
  displayName: 'StyledCard',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  ${({ variant, theme }) => {
    if (variant === 'elevated') {
      return `
        box-shadow: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px ${theme.shadows.md.shadowRadius}px rgba(0, 0, 0, ${theme.shadows.md.shadowOpacity});
      `;
    }
    if (variant === 'outlined') {
      return `
        border: 1px solid ${theme.colors.background.tertiary};
      `;
    }
    return '';
  }}
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
`;

const StyledCardHeader = styled.div.withConfig({
  displayName: 'StyledCardHeader',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom: ${({ $hasBody, $hasFooter, theme }) => ($hasBody || $hasFooter ? `1px solid ${theme.colors.background.tertiary}` : 'none')};
`;

const StyledCardBody = styled.div.withConfig({
  displayName: 'StyledCardBody',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  ${({ $hasHeader, $hasFooter }) => {
    let styles = '';
    if ($hasHeader) {
      styles += 'padding-top: 0;';
    }
    if ($hasFooter) {
      styles += 'padding-bottom: 0;';
    }
    return styles;
  }}
`;

const StyledCardFooter = styled.div.withConfig({
  displayName: 'StyledCardFooter',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

export { StyledCard, StyledCardHeader, StyledCardBody, StyledCardFooter };


