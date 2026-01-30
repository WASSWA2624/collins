/**
 * HeaderCustomizationList - Web
 * Header customization toggle items only (no menu wrapper). Used in dropdown and overflow menu.
 * File: HeaderCustomizationList/HeaderCustomizationList.web.jsx
 */

import React from 'react';
import { Icon } from '@platform/components';
import {
  StyledHeaderMenuItem,
  StyledHeaderMenuItemContent,
  StyledHeaderMenuItemIcon,
  StyledHeaderMenuItemLabel,
  StyledHeaderMenuItemMeta,
} from '../MainRouteLayout.web.styles';

export default function HeaderCustomizationList({
  items,
  isVisible,
  onToggle,
  t,
  iconMap,
}) {
  return items.map((item) => {
    const visible = isVisible(item.id);
    return (
      <StyledHeaderMenuItem
        key={item.id}
        type="button"
        role="menuitemcheckbox"
        aria-checked={visible}
        $isChecked={visible}
        onClick={() => onToggle(item.id)}
        aria-label={item.label}
      >
        <StyledHeaderMenuItemContent>
          <StyledHeaderMenuItemIcon>
            <Icon
              glyph={iconMap[item.id] || '⚙'}
              decorative
              accessibilityLabel={item.label}
            />
          </StyledHeaderMenuItemIcon>
          <StyledHeaderMenuItemLabel>{item.label}</StyledHeaderMenuItemLabel>
        </StyledHeaderMenuItemContent>
        <StyledHeaderMenuItemMeta $isChecked={visible}>
          {visible ? t('common.on') : t('common.off')}
        </StyledHeaderMenuItemMeta>
      </StyledHeaderMenuItem>
    );
  });
}
