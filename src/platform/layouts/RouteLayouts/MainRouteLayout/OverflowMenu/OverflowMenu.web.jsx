/**
 * OverflowMenu - Web
 * Overflow menu wrapper (button + dropdown content slot)
 * File: OverflowMenu/OverflowMenu.web.jsx
 */

import React from 'react';
import { Icon } from '@platform/components';
import {
  StyledHeaderMenu,
  StyledHeaderMenuWrapper,
  StyledOverflowMenuButton,
} from '../MainRouteLayout.web.styles';

export default function OverflowMenu({
  isOpen,
  onToggle,
  onKeyDown,
  wrapperRef,
  menuRef,
  showMoreLabel,
  overflowMenuLabel,
  children,
}) {
  return (
    <StyledHeaderMenuWrapper ref={wrapperRef}>
      <StyledOverflowMenuButton
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={showMoreLabel}
        title={showMoreLabel}
        data-testid="main-header-overflow-toggle"
      >
        <Icon
          glyph="⋮"
          size="lg"
          decorative
          accessibilityLabel={showMoreLabel}
        />
      </StyledOverflowMenuButton>
      {isOpen ? (
        <StyledHeaderMenu
          role="menu"
          aria-label={overflowMenuLabel}
          onKeyDown={onKeyDown}
          ref={menuRef}
        >
          {children}
        </StyledHeaderMenu>
      ) : null}
    </StyledHeaderMenuWrapper>
  );
}
