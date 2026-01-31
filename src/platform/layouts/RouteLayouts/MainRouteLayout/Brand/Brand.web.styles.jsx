/**
 * Brand Styles - Web
 * File: Brand/Brand.web.styles.jsx
 * Responsive brand/logo styling for mobile, tablet, and desktop
 */
import styled from 'styled-components';

const StyledBrand = styled.div.withConfig({
  displayName: 'StyledBrand',
  componentId: 'StyledBrand',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
  max-width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    gap: ${({ theme }) => theme.spacing.sm}px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    gap: ${({ theme }) => theme.spacing.md}px;
  }
`;

const StyledBrandLogo = styled.span.withConfig({
  displayName: 'StyledBrandLogo',
  componentId: 'StyledBrandLogo',
})`
  display: inline-block;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  }
`;

const StyledBrandName = styled.span.withConfig({
  displayName: 'StyledBrandName',
  componentId: 'StyledBrandName',
})`
  display: none;
  white-space: nowrap;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  /* Mobile-first: show full name from tablet+ */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    display: inline-block;
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  }
`;

export { StyledBrand, StyledBrandLogo, StyledBrandName };
