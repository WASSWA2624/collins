/**
 * NotificationsList - Web
 * Notifications list content only (no menu wrapper). Used in dropdown and overflow menu.
 * File: NotificationsList/NotificationsList.web.jsx
 */

import React from 'react';
import { Icon } from '@platform/components';
import {
  StyledNotificationsEmpty,
  StyledNotificationsItem,
  StyledNotificationsItemContent,
  StyledNotificationsItemIcon,
  StyledNotificationsItemMeta,
  StyledNotificationsItemTitle,
} from '../MainRouteLayout.web.styles';

export default function NotificationsList({
  items,
  emptyLabel,
  viewAllLabel,
  onItemSelect,
  onViewAll,
}) {
  if (items.length === 0) {
    return <StyledNotificationsEmpty>{emptyLabel}</StyledNotificationsEmpty>;
  }
  return (
    <>
      {items.map((item) => (
        <StyledNotificationsItem
          key={item.id}
          type="button"
          role="menuitem"
          data-notification-id={item.id}
          onClick={onItemSelect}
          aria-label={item.title}
        >
          <StyledNotificationsItemContent>
            <StyledNotificationsItemIcon>
              <Icon glyph={item.icon} decorative accessibilityLabel={item.title} />
            </StyledNotificationsItemIcon>
            <div>
              <StyledNotificationsItemTitle>{item.title}</StyledNotificationsItemTitle>
              <StyledNotificationsItemMeta>{item.meta}</StyledNotificationsItemMeta>
            </div>
          </StyledNotificationsItemContent>
        </StyledNotificationsItem>
      ))}
      <StyledNotificationsItem
        type="button"
        role="menuitem"
        onClick={onViewAll}
        aria-label={viewAllLabel}
      >
        <StyledNotificationsItemContent>
          <StyledNotificationsItemIcon>
            <Icon glyph="📬" decorative accessibilityLabel={viewAllLabel} />
          </StyledNotificationsItemIcon>
          <StyledNotificationsItemTitle>{viewAllLabel}</StyledNotificationsItemTitle>
        </StyledNotificationsItemContent>
      </StyledNotificationsItem>
    </>
  );
}
