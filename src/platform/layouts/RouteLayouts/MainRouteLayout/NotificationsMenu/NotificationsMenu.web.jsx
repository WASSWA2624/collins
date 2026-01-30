/**
 * NotificationsMenu - Web
 * Notifications dropdown (wrapper + list) for MainRouteLayout
 * File: NotificationsMenu/NotificationsMenu.web.jsx
 */

import React from 'react';
import { StyledNotificationsMenu } from '../MainRouteLayout.web.styles';
import NotificationsList from '../NotificationsList';

export default function NotificationsMenu({
  items,
  emptyLabel,
  menuLabel,
  viewAllLabel,
  onItemSelect,
  onViewAll,
  onKeyDown,
  menuRef,
}) {
  return (
    <StyledNotificationsMenu
      role="menu"
      aria-label={menuLabel}
      onKeyDown={onKeyDown}
      ref={menuRef}
    >
      <NotificationsList
        items={items}
        emptyLabel={emptyLabel}
        viewAllLabel={viewAllLabel}
        onItemSelect={onItemSelect}
        onViewAll={onViewAll}
      />
    </StyledNotificationsMenu>
  );
}
