/**
 * HamburgerIcon Styles - Web
 * File: HamburgerIcon/HamburgerIcon.web.styles.jsx
 * Responsive hamburger icon for mobile/tablet navigation
 */
import styled from 'styled-components';

const StyledHamburgerIcon = styled.span.withConfig({
  displayName: 'StyledHamburgerIcon',
  componentId: 'StyledHamburgerIcon',
})`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 16px;
  height: 14px;

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 15px;
    height: 13px;
    gap: 2.5px;
  }

  /* Mobile: Slightly smaller */
  @media (max-width: 767px) {
    width: 14px;
    height: 12px;
    gap: 2px;
  }
`;

const StyledHamburgerLine = styled.span.withConfig({
  displayName: 'StyledHamburgerLine',
  componentId: 'StyledHamburgerLine',
})`
  height: 2px;
  width: 100%;
  background-color: currentColor;
  border-radius: ${({ theme }) => theme.radius.full}px;
  transition: transform 0.2s ease, opacity 0.2s ease;

  /* Mobile: Thinner lines */
  @media (max-width: 767px) {
    height: 1.5px;
  }
`;

export { StyledHamburgerIcon, StyledHamburgerLine };
