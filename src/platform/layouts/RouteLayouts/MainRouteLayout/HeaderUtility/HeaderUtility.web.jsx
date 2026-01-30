/**
 * HeaderUtility - Web
 * Header utility row: notifications, network, fullscreen, customization, hide header, overflow, user menu
 * File: HeaderUtility/HeaderUtility.web.jsx
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useNetwork } from '@hooks';
import { DatabaseIndicator, Icon, NetworkConnectivityIcon } from '@platform/components';
import {
  StyledHeaderMenu,
  StyledHeaderMenuButton,
  StyledHeaderMenuDivider,
  StyledHeaderMenuItem,
  StyledHeaderMenuItemContent,
  StyledHeaderMenuItemIcon,
  StyledHeaderMenuItemLabel,
  StyledHeaderMenuSectionTitle,
  StyledHeaderMenuWrapper,
  StyledHeaderToggleButton,
  StyledHeaderUtilityRow,
  StyledMaximizeRestoreButton,
  StyledNetworkButton,
  StyledNotificationsBadge,
  StyledNotificationsButton,
  StyledNotificationsWrapper,
} from './HeaderUtility.web.styles';
import { StyledHeaderMenuItemMeta } from '../MainRouteLayout.web.styles';
import NotificationsMenu from '../NotificationsMenu';
import NotificationsList from '../NotificationsList';
import HeaderCustomizationMenu from '../HeaderCustomizationMenu';
import HeaderCustomizationList from '../HeaderCustomizationList';
import OverflowMenu from '../OverflowMenu';

/** Windows-style maximize (one square) / restore (two overlapping squares) icon */
function MaximizeRestoreIcon({ isFullscreen, ...rest }) {
  return isFullscreen ? (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...rest}>
      <rect x="1" y="1" width="5" height="5" rx="0.5" />
      <rect x="6" y="6" width="5" height="5" rx="0.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...rest}>
      <rect x="0" y="0" width="12" height="12" rx="0.5" />
    </svg>
  );
}

function OverflowMenuContent({
  isMobile,
  shouldShowNotifications,
  shouldShowNetwork,
  shouldShowDatabase,
  shouldShowFullscreenOverflow,
  notificationItems,
  unreadCount,
  headerCustomizationItems,
  overflowItems,
  fullscreenLabel,
  fullscreenIconGlyph,
  isHeaderActionVisible,
  t,
  CUSTOMIZATION_ICON_MAP,
  networkStatusLabel,
  databaseStatusLabel,
  onNotificationSelect,
  onViewNotifications,
  onOverflowItemPress,
  onHideHeader,
  onToggleFullscreen,
  onToggleHeaderActionVisibility,
}) {
  if (isMobile) {
    return (
      <>
        {shouldShowNotifications ? (
          <>
            <StyledHeaderMenuSectionTitle>
              <span>{t('navigation.notifications.label')}</span>
              {unreadCount > 0 ? (
                <StyledHeaderMenuItemMeta $isChecked>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </StyledHeaderMenuItemMeta>
              ) : null}
            </StyledHeaderMenuSectionTitle>
            <NotificationsList
              items={notificationItems}
              emptyLabel={t('navigation.notifications.empty')}
              viewAllLabel={t('navigation.notifications.viewAll')}
              onItemSelect={onNotificationSelect}
              onViewAll={onViewNotifications}
            />
            <StyledHeaderMenuDivider />
          </>
        ) : null}
        {/* Network & Database status in mobile overflow */}
        {(shouldShowNetwork || shouldShowDatabase) ? (
          <>
            <StyledHeaderMenuSectionTitle>
              <span>{t('navigation.network.label')}</span>
            </StyledHeaderMenuSectionTitle>
            {shouldShowNetwork ? (
              <StyledHeaderMenuItem as="div" role="status" aria-label={networkStatusLabel}>
                <StyledHeaderMenuItemContent>
                  <StyledHeaderMenuItemIcon>
                    <NetworkConnectivityIcon title={networkStatusLabel} />
                  </StyledHeaderMenuItemIcon>
                  <StyledHeaderMenuItemLabel>{networkStatusLabel}</StyledHeaderMenuItemLabel>
                </StyledHeaderMenuItemContent>
              </StyledHeaderMenuItem>
            ) : null}
            {shouldShowDatabase ? (
              <StyledHeaderMenuItem as="div" role="status" aria-label={databaseStatusLabel}>
                <StyledHeaderMenuItemContent>
                  <StyledHeaderMenuItemIcon>
                    <DatabaseIndicator testID="overflow-database-indicator" />
                  </StyledHeaderMenuItemIcon>
                  <StyledHeaderMenuItemLabel>{databaseStatusLabel}</StyledHeaderMenuItemLabel>
                </StyledHeaderMenuItemContent>
              </StyledHeaderMenuItem>
            ) : null}
            <StyledHeaderMenuDivider />
          </>
        ) : null}
        {shouldShowFullscreenOverflow ? (
          <StyledHeaderMenuItem
            type="button"
            role="menuitem"
            onClick={() => onOverflowItemPress({ onPress: onToggleFullscreen })}
            aria-label={fullscreenLabel}
          >
            <StyledHeaderMenuItemContent>
              <StyledHeaderMenuItemIcon>
                <Icon glyph={fullscreenIconGlyph} decorative accessibilityLabel={fullscreenLabel} />
              </StyledHeaderMenuItemIcon>
              <StyledHeaderMenuItemLabel>{fullscreenLabel}</StyledHeaderMenuItemLabel>
            </StyledHeaderMenuItemContent>
          </StyledHeaderMenuItem>
        ) : null}
        <StyledHeaderMenuItem
          type="button"
          role="menuitem"
          onClick={onHideHeader}
          aria-label={t('navigation.header.hideHeader')}
        >
          <StyledHeaderMenuItemContent>
            <StyledHeaderMenuItemIcon>
              <Icon glyph="-" decorative accessibilityLabel={t('navigation.header.hideHeader')} />
            </StyledHeaderMenuItemIcon>
            <StyledHeaderMenuItemLabel>{t('navigation.header.hideHeader')}</StyledHeaderMenuItemLabel>
          </StyledHeaderMenuItemContent>
        </StyledHeaderMenuItem>
        <StyledHeaderMenuDivider />
        <StyledHeaderMenuSectionTitle>
          <span>{t('navigation.header.customizationMenuLabel')}</span>
        </StyledHeaderMenuSectionTitle>
        <HeaderCustomizationList
          items={headerCustomizationItems}
          isVisible={isHeaderActionVisible}
          onToggle={onToggleHeaderActionVisibility}
          t={t}
          iconMap={CUSTOMIZATION_ICON_MAP}
        />
      </>
    );
  }
  return overflowItems.map((item) => (
    <StyledHeaderMenuItem
      key={item.id}
      type="button"
      role="menuitem"
      onClick={() => onOverflowItemPress(item)}
      aria-label={item.label}
    >
      <StyledHeaderMenuItemContent>
        <StyledHeaderMenuItemIcon>
          <Icon glyph={item.icon} decorative accessibilityLabel={item.label} />
        </StyledHeaderMenuItemIcon>
        <StyledHeaderMenuItemLabel>{item.label}</StyledHeaderMenuItemLabel>
      </StyledHeaderMenuItemContent>
    </StyledHeaderMenuItem>
  ));
}

export default function HeaderUtility(props) {
  const {
    t,
    isMobile,
    shouldShowNotificationsInline,
    shouldShowNetwork,
    shouldShowDatabase,
    shouldShowFullscreenInline,
    shouldShowOverflowMenu,
    notificationItems,
    unreadCount,
    fullscreenLabel,
    isFullscreen,
    isNotificationsOpen,
    isHeaderCustomizationOpen,
    notificationsRef,
    notificationsMenuRef,
    customizationWrapperRef,
    customizationMenuRef,
    overflowWrapperRef,
    overflowMenuRef,
    handleToggleNotifications,
    handleNotificationsKeyDown,
    handleCloseNotifications,
    handleViewNotifications,
    handleNotificationSelect,
    handleToggleHeaderCustomization,
    handleCustomizationKeyDown,
    handleToggleOverflowMenu,
    handleOverflowKeyDown,
    handleToggleHeaderActionVisibility,
    handleToggleFullscreen,
    handleHideHeader,
    handleOverflowItemPress,
    headerCustomizationItems,
    isHeaderActionVisible,
    CUSTOMIZATION_ICON_MAP,
    shouldShowNotifications,
    shouldShowFullscreenOverflow,
    overflowItems,
    isAuthenticated,
    onLogout,
  } = props;

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userWrapperRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleToggleUserMenu = useCallback(() => setIsUserMenuOpen((prev) => !prev), []);
  const handleCloseUserMenu = useCallback(() => setIsUserMenuOpen(false), []);
  const handleUserMenuKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') handleCloseUserMenu();
    },
    [handleCloseUserMenu]
  );
  const router = useRouter();
  const { isOffline, isLowQuality, isSyncing } = useNetwork();
  const networkStatusKey = isOffline ? 'offline' : isLowQuality ? 'unstable' : isSyncing ? 'syncing' : 'online';
  const networkStatusLabel = t(`navigation.network.status.${networkStatusKey}`);
  const networkTooltip = `${t('navigation.network.label')}: ${networkStatusLabel}`;

  const handleLogout = useCallback(() => {
    if (onLogout) onLogout();
    handleCloseUserMenu();
  }, [onLogout, handleCloseUserMenu]);
  const handleProfile = useCallback(() => {
    handleCloseUserMenu();
    router.push('/settings/user-profiles');
  }, [router]);
  const handleSettings = useCallback(() => {
    handleCloseUserMenu();
    router.push('/settings');
  }, [router]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onDocClick = (e) => {
      if (userWrapperRef.current && !userWrapperRef.current.contains(e.target)) handleCloseUserMenu();
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isUserMenuOpen, handleCloseUserMenu]);

  const overflowContentProps = {
    isMobile,
    shouldShowNotifications,
    shouldShowNetwork,
    shouldShowDatabase,
    shouldShowFullscreenOverflow,
    notificationItems,
    unreadCount,
    headerCustomizationItems,
    overflowItems,
    fullscreenLabel,
    fullscreenIconGlyph: props.fullscreenIconGlyph,
    isHeaderActionVisible,
    t,
    CUSTOMIZATION_ICON_MAP,
    networkStatusLabel,
    databaseStatusLabel: t('navigation.network.database.label'),
    onNotificationSelect: handleNotificationSelect,
    onViewNotifications: handleViewNotifications,
    onOverflowItemPress: handleOverflowItemPress,
    onHideHeader: handleHideHeader,
    onToggleFullscreen: handleToggleFullscreen,
    onToggleHeaderActionVisibility: handleToggleHeaderActionVisibility,
  };
  const overflowContent = shouldShowOverflowMenu ? (
    <OverflowMenu
      isOpen={props.isOverflowOpen}
      onToggle={handleToggleOverflowMenu}
      onKeyDown={handleOverflowKeyDown}
      wrapperRef={overflowWrapperRef}
      menuRef={overflowMenuRef}
      showMoreLabel={t('navigation.header.showMore')}
      overflowMenuLabel={t('navigation.header.overflowMenuLabel')}
    >
      <OverflowMenuContent {...overflowContentProps} />
    </OverflowMenu>
  ) : null;

  return (
    <StyledHeaderUtilityRow>
      {shouldShowNotificationsInline ? (
        <StyledNotificationsWrapper ref={notificationsRef}>
          <StyledNotificationsButton
            type="button"
            onClick={handleToggleNotifications}
            aria-haspopup="menu"
            aria-expanded={isNotificationsOpen}
            aria-label={t('navigation.notifications.label')}
            title={t('navigation.notifications.label')}
            data-testid="main-notifications-toggle"
          >
            <Icon glyph="🔔" decorative accessibilityLabel={t('navigation.notifications.label')} />
            {unreadCount > 0 ? (
              <StyledNotificationsBadge>
                {unreadCount > 99 ? '99+' : unreadCount}
              </StyledNotificationsBadge>
            ) : null}
          </StyledNotificationsButton>
          {isNotificationsOpen ? (
            <NotificationsMenu
              items={notificationItems}
              emptyLabel={t('navigation.notifications.empty')}
              menuLabel={t('navigation.notifications.menuLabel')}
              viewAllLabel={t('navigation.notifications.viewAll')}
              onItemSelect={handleNotificationSelect}
              onViewAll={handleViewNotifications}
              onKeyDown={handleNotificationsKeyDown}
              menuRef={notificationsMenuRef}
            />
          ) : null}
        </StyledNotificationsWrapper>
      ) : null}
      {shouldShowNetwork ? (
        <StyledNetworkButton title={networkTooltip} data-testid="main-network-indicator">
          <NetworkConnectivityIcon title={networkStatusLabel} />
        </StyledNetworkButton>
      ) : null}
      {shouldShowDatabase ? (
        <StyledNetworkButton title={t('navigation.network.database.label')}>
          <DatabaseIndicator testID="main-database-indicator" title={t('navigation.network.database.label')} />
        </StyledNetworkButton>
      ) : null}
      {shouldShowFullscreenInline ? (
        <StyledMaximizeRestoreButton
          type="button"
          onClick={handleToggleFullscreen}
          aria-label={fullscreenLabel}
          data-testid="main-fullscreen-toggle"
          title={fullscreenLabel}
        >
          <MaximizeRestoreIcon isFullscreen={isFullscreen} />
        </StyledMaximizeRestoreButton>
      ) : null}
      {!isMobile ? (
        <StyledHeaderMenuWrapper ref={customizationWrapperRef}>
          <StyledHeaderMenuButton
            type="button"
            onClick={handleToggleHeaderCustomization}
            aria-haspopup="menu"
            aria-expanded={isHeaderCustomizationOpen}
            aria-label={t('navigation.header.customize')}
            title={t('navigation.header.customize')}
            data-testid="main-header-customize-toggle"
          >
            <Icon glyph="⚙" decorative accessibilityLabel={t('navigation.header.customize')} />
          </StyledHeaderMenuButton>
          {isHeaderCustomizationOpen ? (
            <HeaderCustomizationMenu
              items={headerCustomizationItems}
              isVisible={isHeaderActionVisible}
              onToggle={handleToggleHeaderActionVisibility}
              onKeyDown={handleCustomizationKeyDown}
              menuRef={customizationMenuRef}
              menuLabel={t('navigation.header.customizationMenuLabel')}
              t={t}
              iconMap={CUSTOMIZATION_ICON_MAP}
            />
          ) : null}
        </StyledHeaderMenuWrapper>
      ) : null}
      {!isMobile ? (
        <StyledHeaderToggleButton
          variant="outline"
          size="small"
          onPress={handleHideHeader}
          accessibilityLabel={t('navigation.header.hideHeader')}
          title={t('navigation.header.hideHeader')}
          testID="main-header-toggle"
          icon={<Icon glyph="˄" decorative accessibilityLabel={t('navigation.header.hideHeader')} />}
        />
      ) : null}
      {overflowContent}
      {isAuthenticated && onLogout ? (
        <StyledHeaderMenuWrapper ref={userWrapperRef}>
          <StyledHeaderMenuButton
            type="button"
            onClick={handleToggleUserMenu}
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            aria-label={t('common.userMenu')}
            title={t('common.userMenu')}
            data-testid="main-user-menu-toggle"
          >
            <Icon glyph="👤" decorative accessibilityLabel={t('common.userMenu')} />
          </StyledHeaderMenuButton>
          {isUserMenuOpen ? (
            <StyledHeaderMenu
              role="menu"
              aria-label={t('common.userMenu')}
              onKeyDown={handleUserMenuKeyDown}
              ref={userMenuRef}
            >
              <StyledHeaderMenuItem
                type="button"
                role="menuitem"
                onClick={handleProfile}
                aria-label={t('navigation.header.profile')}
              >
                <StyledHeaderMenuItemContent>
                  <StyledHeaderMenuItemIcon>
                    <Icon glyph="👤" decorative accessibilityLabel={t('navigation.header.profile')} />
                  </StyledHeaderMenuItemIcon>
                  <StyledHeaderMenuItemLabel>{t('navigation.header.profile')}</StyledHeaderMenuItemLabel>
                </StyledHeaderMenuItemContent>
              </StyledHeaderMenuItem>
              <StyledHeaderMenuItem
                type="button"
                role="menuitem"
                onClick={handleSettings}
                aria-label={t('navigation.header.settings')}
              >
                <StyledHeaderMenuItemContent>
                  <StyledHeaderMenuItemIcon>
                    <Icon glyph="⚙" decorative accessibilityLabel={t('navigation.header.settings')} />
                  </StyledHeaderMenuItemIcon>
                  <StyledHeaderMenuItemLabel>{t('navigation.header.settings')}</StyledHeaderMenuItemLabel>
                </StyledHeaderMenuItemContent>
              </StyledHeaderMenuItem>
              <StyledHeaderMenuDivider />
              <StyledHeaderMenuItem
                type="button"
                role="menuitem"
                onClick={handleLogout}
                aria-label={t('navigation.header.logout')}
              >
                <StyledHeaderMenuItemContent>
                  <StyledHeaderMenuItemIcon>
                    <Icon glyph="↪" decorative accessibilityLabel={t('navigation.header.logout')} />
                  </StyledHeaderMenuItemIcon>
                  <StyledHeaderMenuItemLabel>{t('navigation.header.logout')}</StyledHeaderMenuItemLabel>
                </StyledHeaderMenuItemContent>
              </StyledHeaderMenuItem>
            </StyledHeaderMenu>
          ) : null}
        </StyledHeaderMenuWrapper>
      ) : null}
    </StyledHeaderUtilityRow>
  );
}
