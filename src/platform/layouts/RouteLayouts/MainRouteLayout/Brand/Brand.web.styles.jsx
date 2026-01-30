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
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    gap: ${({ theme }) => theme.spacing.xs}px;
  }

  /* Mobile */
  @media (max-width: 767px) {
    gap: 6px;
  }
`;

const StyledBrandLogo = styled.div.withConfig({
  displayName: 'StyledBrandLogo',
  componentId: 'StyledBrandLogo',
})`
  /* Desktop: 32px */
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 12px;
  flex-shrink: 0;
  letter-spacing: -0.5px;
  text-transform: uppercase;

  /* Tablet: 28px */
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  /* Mobile: 24px */
  @media (max-width: 767px) {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
`;

const StyledBrandName = styled.span.withConfig({
  displayName: 'StyledBrandName',
  componentId: 'StyledBrandName',
})`
  /* Desktop: Full name visible */
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;

  /* Tablet: slightly smaller */
  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  }

  /* Mobile: Hide full name */
  @media (max-width: 767px) {
    display: none;
  }
`;

const StyledBrandShortName = styled.span.withConfig({
  displayName: 'StyledBrandShortName',
  componentId: 'StyledBrandShortName',
})`
  /* Desktop/Tablet: Hidden */
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: none;
  white-space: nowrap;

  /* Mobile: Show short name */
  @media (max-width: 767px) {
    display: inline;
    font-size: 13px;
  }
`;

export { StyledBrand, StyledBrandLogo, StyledBrandName, StyledBrandShortName };
