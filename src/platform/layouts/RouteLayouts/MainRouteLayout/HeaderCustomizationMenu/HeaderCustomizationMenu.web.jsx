/**
 * HeaderCustomizationMenu - Web
 * Header customization dropdown (wrapper + list) for MainRouteLayout
 * File: HeaderCustomizationMenu/HeaderCustomizationMenu.web.jsx
 */

import React from 'react';
import { StyledHeaderMenu } from '../MainRouteLayout.web.styles';
import HeaderCustomizationList from '../HeaderCustomizationList';

export default function HeaderCustomizationMenu({
  items,
  isVisible,
  onToggle,
  onKeyDown,
  menuRef,
  menuLabel,
  t,
  iconMap,
}) {
  return (
    <StyledHeaderMenu
      role="menu"
      aria-label={menuLabel}
      onKeyDown={onKeyDown}
      ref={menuRef}
    >
      <HeaderCustomizationList
        items={items}
        isVisible={isVisible}
        onToggle={onToggle}
        t={t}
        iconMap={iconMap}
      />
    </StyledHeaderMenu>
  );
}
