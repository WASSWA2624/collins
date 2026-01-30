/**
 * HamburgerIcon - Web
 * Hamburger icon for sidebar toggle in MainRouteLayout header
 * File: HamburgerIcon/HamburgerIcon.web.jsx
 */

import React from 'react';
import { StyledHamburgerIcon, StyledHamburgerLine } from './HamburgerIcon.web.styles';

export default function HamburgerIcon() {
  return (
    <StyledHamburgerIcon aria-hidden="true">
      <StyledHamburgerLine />
      <StyledHamburgerLine />
      <StyledHamburgerLine />
    </StyledHamburgerIcon>
  );
}
