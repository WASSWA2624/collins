/**
 * Brand - Web
 * Brand block for MainRouteLayout header (app name, logo)
 * File: Brand/Brand.web.jsx
 */

import React from 'react';
import {
  StyledBrand,
  StyledBrandLogo,
  StyledBrandName,
  StyledBrandShortName,
} from './Brand.web.styles';

export default function Brand({ appName, appShortName }) {
  return (
    <StyledBrand>
      <StyledBrandLogo aria-hidden="true">{appShortName}</StyledBrandLogo>
      <StyledBrandName>{appName}</StyledBrandName>
      <StyledBrandShortName>{appShortName}</StyledBrandShortName>
    </StyledBrand>
  );
}
