/**
 * MainRouteLayout Component - Web
 * Reusable route layout for authenticated/main app routes on Web
 * File: MainRouteLayout.web.jsx
 * 
 * Per component-structure.mdc: Reusable layout components belong in platform/layouts/
 * Per app-router.mdc: Route layouts handle authentication guards
 * 
 * This component combines:
 * - Auth guard (routing logic)
 * - MainLayout (UI component)
 * - Navigation components (Header, Sidebar)
 * - Slot rendering (child routes)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusTrap, useI18n, usePrimaryNavigation, useShellBanners, useUiState } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import breakpoints from '@theme/breakpoints';
import { AppFrame } from '@platform/layouts';
import {
  GlobalHeader,
  Icon,
  LanguageControls,
  LoadingOverlay,
  NetworkIndicator,
  NoticeSurface,
  ShellBanners,
  Sidebar,
  ThemeControls,
} from '@platform/components';
import { ACTION_PLACEMENTS, ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader/types';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import { actions as uiActions } from '@store/slices/ui.slice';
import {
  StyledBrand,
  StyledBrandLogo,
  StyledBrandName,
  StyledBrandShortName,
  StyledHeaderMenu,
  StyledHeaderMenuButton,
  StyledHeaderMenuItem,
  StyledHeaderMenuItemLabel,
  StyledHeaderMenuItemMeta,
  StyledHeaderMenuSectionTitle,
  StyledHeaderMenuDivider,
  StyledHeaderMenuWrapper,
  StyledHeaderRevealButton,
  StyledHeaderToggleButton,
  StyledHeaderUtilityRow,
  StyledHamburgerIcon,
  StyledHamburgerLine,
  StyledOverflowMenuButton,
  StyledMobileCloseButton,
  StyledMobileSidebarBackdrop,
  StyledMobileSidebarContent,
  StyledMobileSidebarHeader,
  StyledMobileSidebarOverlay,
  StyledMobileSidebarPanel,
  StyledNotificationsBadge,
  StyledNotificationsButton,
  StyledNotificationsEmpty,
  StyledNotificationsItem,
  StyledNotificationsItemContent,
  StyledNotificationsItemIcon,
  StyledNotificationsItemMeta,
  StyledNotificationsItemTitle,
  StyledNotificationsMenu,
  StyledNotificationsWrapper,
  StyledSidebarControls,
  StyledSidebarResizeHandle,
  StyledSidebarWrapper,
  StyledHeaderMenuItemContent,
  StyledHeaderMenuItemIcon,
  StyledFullscreenButton,
} from './MainRouteLayout.web.styles';

const SIDEBAR_MIN_WIDTH = 200;
const SIDEBAR_MAX_WIDTH = 360;
const SIDEBAR_DEFAULT_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 64;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * MainRouteLayout component for Web
 * @param {Object} props - MainRouteLayout props
 */
const MainRouteLayoutWeb = () => {
  // Call auth guard at the top of component per app-router.mdc
  // Hook automatically redirects unauthenticated users to /login
  useAuthGuard();
  const { t } = useI18n();
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isLoading,
    sidebarWidth: storedSidebarWidth,
    isSidebarCollapsed: storedSidebarCollapsed,
    isHeaderHidden,
    headerActionVisibility,
  } = useUiState();
  const { mainItems, isItemVisible } = usePrimaryNavigation();
  const banners = useShellBanners();
  const { width } = useWindowDimensions();
  const isMobile = width < breakpoints.tablet;
  const isCompactHeader = width < breakpoints.desktop;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isHeaderCustomizationOpen, setIsHeaderCustomizationOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const mobileSidebarRef = useRef(null);
  const notificationsRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  const overflowWrapperRef = useRef(null);
  const overflowMenuRef = useRef(null);
  const customizationWrapperRef = useRef(null);
  const customizationMenuRef = useRef(null);
  const bannerSlot = banners.length ? <ShellBanners banners={banners} testID="main-shell-banners" /> : null;
  const overlaySlot = isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null;
  const resolvedSidebarWidth = useMemo(
    () => clamp(storedSidebarWidth ?? SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH),
    [storedSidebarWidth]
  );
  const isSidebarCollapsed = isMobile ? true : storedSidebarCollapsed;
  const hasDocument = typeof document !== 'undefined';

  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && isNotificationsOpen) {
      setIsNotificationsOpen(false);
    }
  }, [isMobile, isNotificationsOpen]);

  useEffect(() => {
    if (isMobile && isHeaderCustomizationOpen) {
      setIsHeaderCustomizationOpen(false);
    }
  }, [isMobile, isHeaderCustomizationOpen]);

  useEffect(() => {
    if (!hasDocument || !isMobile) return undefined;
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasDocument, isMobile, isMobileSidebarOpen]);

  useEffect(() => {
    if (!hasDocument || !isResizing) return;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [hasDocument, isResizing]);

  useEffect(() => {
    if (!hasDocument || !isNotificationsOpen) return;

    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasDocument, isNotificationsOpen]);

  useEffect(() => {
    if (!hasDocument || !isOverflowOpen) return;
    const handleClickOutside = (event) => {
      if (overflowWrapperRef.current && !overflowWrapperRef.current.contains(event.target)) {
        setIsOverflowOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasDocument, isOverflowOpen]);

  useEffect(() => {
    if (!hasDocument || !isHeaderCustomizationOpen) return;
    const handleClickOutside = (event) => {
      if (customizationWrapperRef.current && !customizationWrapperRef.current.contains(event.target)) {
        setIsHeaderCustomizationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasDocument, isHeaderCustomizationOpen]);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      dispatch(uiActions.setSidebarCollapsed(!storedSidebarCollapsed));
    }
  }, [dispatch, isMobile, storedSidebarCollapsed]);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const handleToggleNotifications = useCallback(() => {
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsNotificationsOpen((prev) => !prev);
  }, []);

  const handleCloseNotifications = useCallback(() => {
    setIsNotificationsOpen(false);
  }, []);

  const handleToggleOverflowMenu = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsOverflowOpen((prev) => !prev);
  }, []);

  const handleToggleHeaderCustomization = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen((prev) => !prev);
  }, []);

  const handleNotificationsKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseNotifications();
      }
    },
    [handleCloseNotifications]
  );

  const handleOverflowKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOverflowOpen(false);
    }
  }, []);

  const handleCustomizationKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsHeaderCustomizationOpen(false);
    }
  }, []);

  const handleNotificationSelect = useCallback(
    (event) => {
      const selectedId = event.currentTarget?.dataset?.notificationId;
      if (selectedId) {
        setIsNotificationsOpen(false);
      }
      if (isMobile) {
        setIsOverflowOpen(false);
      }
    },
    [isMobile]
  );

  const handleViewNotifications = useCallback(() => {
    router.push('/notifications');
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
  }, [router]);

  const handleHideHeader = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    dispatch(uiActions.setHeaderHidden(true));
  }, [dispatch]);

  const handleShowHeader = useCallback(() => {
    dispatch(uiActions.setHeaderHidden(false));
  }, [dispatch]);

  const handleToggleHeaderActionVisibility = useCallback(
    (key) => {
      dispatch(uiActions.toggleHeaderActionVisibility(key));
    },
    [dispatch]
  );

  const handleResizeStart = useCallback(
    (event) => {
      if (isMobile || isSidebarCollapsed) return;
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);

      const startX = event.clientX;
      const startWidth = resolvedSidebarWidth;

      const handleMouseMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth = clamp(startWidth + delta, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH);
        dispatch(uiActions.setSidebarWidth(nextWidth));
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dispatch, isMobile, isSidebarCollapsed, resolvedSidebarWidth]
  );

  const handleResizeKeyDown = useCallback(
    (event) => {
      if (isMobile || isSidebarCollapsed) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 12 : -12;
        const nextWidth = clamp(resolvedSidebarWidth + delta, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH);
        dispatch(uiActions.setSidebarWidth(nextWidth));
      }
    },
    [dispatch, isMobile, isSidebarCollapsed, resolvedSidebarWidth]
  );

  const handleMobileOverlayKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseMobileSidebar();
      }
    },
    [handleCloseMobileSidebar]
  );

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      // Ignore fullscreen errors silently to avoid disrupting layout rendering.
    }
  }, []);

  useFocusTrap(mobileSidebarRef, isMobileSidebarOpen, { initialFocusRef: closeButtonRef });
  useFocusTrap(notificationsMenuRef, isNotificationsOpen);
  useFocusTrap(overflowMenuRef, isOverflowOpen);
  useFocusTrap(customizationMenuRef, isHeaderCustomizationOpen);

  const HamburgerIcon = useMemo(
    () => (
      <StyledHamburgerIcon aria-hidden="true">
        <StyledHamburgerLine />
        <StyledHamburgerLine />
        <StyledHamburgerLine />
      </StyledHamburgerIcon>
    ),
    []
  );

  const isHeaderActionVisible = useCallback(
    (key) => headerActionVisibility?.[key] !== false,
    [headerActionVisibility]
  );

  const headerCustomizationItems = useMemo(
    () => ([
      { id: 'notifications', label: t('navigation.header.actions.notifications') },
      { id: 'network', label: t('navigation.header.actions.network') },
      { id: 'fullscreen', label: t('navigation.header.actions.fullscreen') },
    ]),
    [t]
  );

  const headerActions = useMemo(
    () => [
      {
        id: 'toggle-sidebar',
        label: null,
        icon: HamburgerIcon,
        onPress: handleToggleSidebar,
        placement: ACTION_PLACEMENTS.SECONDARY,
        variant: ACTION_VARIANTS.GHOST,
        accessibilityLabel: t('common.toggleMenu'),
        isCircular: false,
      },
    ],
    [HamburgerIcon, handleToggleSidebar, t]
  );

  const brandTitle = useMemo(
    () => (
      <StyledBrand>
        <StyledBrandLogo aria-hidden="true">{t('app.shortName')}</StyledBrandLogo>
        <StyledBrandName>{t('app.name')}</StyledBrandName>
        <StyledBrandShortName>{t('app.shortName')}</StyledBrandShortName>
      </StyledBrand>
    ),
    [t]
  );
  const fullscreenLabel = isFullscreen ? t('navigation.fullscreen.exit') : t('navigation.fullscreen.enter');
  const fullscreenIconGlyph = isFullscreen ? '🗗' : '⛶';
  const fullscreenIcon = useMemo(
    () => (
      <Icon
        glyph={fullscreenIconGlyph}
        decorative
        accessibilityLabel={fullscreenLabel}
      />
    ),
    [fullscreenIconGlyph, fullscreenLabel]
  );
  const notificationItems = useMemo(
    () => ([
      {
        id: 'appointments',
        title: t('navigation.notifications.items.appointments.title'),
        meta: t('navigation.notifications.items.appointments.meta'),
        unread: true,
        icon: '📅',
      },
      {
        id: 'labResults',
        title: t('navigation.notifications.items.labResults.title'),
        meta: t('navigation.notifications.items.labResults.meta'),
        unread: true,
        icon: '🧪',
      },
      {
        id: 'messages',
        title: t('navigation.notifications.items.messages.title'),
        meta: t('navigation.notifications.items.messages.meta'),
        unread: false,
        icon: '💬',
      },
    ]),
    [t]
  );
  const unreadCount = useMemo(
    () => notificationItems.filter((item) => item.unread).length,
    [notificationItems]
  );
  const shouldShowNotifications = isHeaderActionVisible('notifications');
  const shouldShowNetwork = isHeaderActionVisible('network');
  const shouldShowNotificationsInline = !isMobile && shouldShowNotifications;
  const shouldShowFullscreenInline = isHeaderActionVisible('fullscreen') && !isCompactHeader && !isMobile;
  const shouldShowFullscreenOverflow = isHeaderActionVisible('fullscreen') && (isCompactHeader || isMobile);
  const overflowItems = useMemo(
    () => (isMobile ? [] : (shouldShowFullscreenOverflow ? [{
      id: 'fullscreen',
      label: fullscreenLabel,
      onPress: handleToggleFullscreen,
      icon: fullscreenIconGlyph,
    }] : [])),
    [fullscreenIconGlyph, fullscreenLabel, handleToggleFullscreen, isMobile, shouldShowFullscreenOverflow]
  );

  useEffect(() => {
    if (!shouldShowNotifications && isNotificationsOpen) {
      setIsNotificationsOpen(false);
    }
  }, [isNotificationsOpen, shouldShowNotifications]);

  useEffect(() => {
    if (!isMobile && overflowItems.length === 0 && isOverflowOpen) {
      setIsOverflowOpen(false);
    }
  }, [isMobile, isOverflowOpen, overflowItems.length]);

  const handleOverflowItemPress = useCallback(
    async (item) => {
      if (item?.onPress) {
        await item.onPress();
      }
      setIsOverflowOpen(false);
    },
    []
  );
  const shouldShowOverflowMenu = isMobile || overflowItems.length > 0;
  const overflowMenu = shouldShowOverflowMenu ? (
    <StyledHeaderMenuWrapper ref={overflowWrapperRef}>
      <StyledOverflowMenuButton
        type="button"
        onClick={handleToggleOverflowMenu}
        aria-haspopup="menu"
        aria-expanded={isOverflowOpen}
        aria-label={t('navigation.header.showMore')}
        data-testid="main-header-overflow-toggle"
      >
        <Icon
          glyph="⋮"
          size="lg"
          decorative
          accessibilityLabel={t('navigation.header.showMore')}
        />
      </StyledOverflowMenuButton>
      {isOverflowOpen ? (
        <StyledHeaderMenu
          role="menu"
          aria-label={t('navigation.header.overflowMenuLabel')}
          onKeyDown={handleOverflowKeyDown}
          ref={overflowMenuRef}
        >
          {isMobile ? (
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
                  {notificationItems.length === 0 ? (
                    <StyledNotificationsEmpty>
                      {t('navigation.notifications.empty')}
                    </StyledNotificationsEmpty>
                  ) : (
                    <>
                      {notificationItems.map((item) => (
                        <StyledNotificationsItem
                          key={item.id}
                          type="button"
                          role="menuitem"
                          data-notification-id={item.id}
                          onClick={handleNotificationSelect}
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
                        onClick={handleViewNotifications}
                        aria-label={t('navigation.notifications.viewAll')}
                      >
                        <StyledNotificationsItemContent>
                          <StyledNotificationsItemIcon>
                            <Icon
                              glyph="📬"
                              decorative
                              accessibilityLabel={t('navigation.notifications.viewAll')}
                            />
                          </StyledNotificationsItemIcon>
                          <StyledNotificationsItemTitle>
                            {t('navigation.notifications.viewAll')}
                          </StyledNotificationsItemTitle>
                        </StyledNotificationsItemContent>
                      </StyledNotificationsItem>
                    </>
                  )}
                  <StyledHeaderMenuDivider />
                </>
              ) : null}
              {shouldShowFullscreenOverflow ? (
                <StyledHeaderMenuItem
                  type="button"
                  role="menuitem"
                  onClick={() => handleOverflowItemPress({ onPress: handleToggleFullscreen })}
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
                onClick={handleHideHeader}
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
              {headerCustomizationItems.map((item) => {
                const isVisible = isHeaderActionVisible(item.id);
                const iconMap = {
                  notifications: '🔔',
                  network: '📶',
                  fullscreen: '⛶',
                };
                return (
                  <StyledHeaderMenuItem
                    key={item.id}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={isVisible}
                    $isChecked={isVisible}
                    onClick={() => handleToggleHeaderActionVisibility(item.id)}
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
                    <StyledHeaderMenuItemMeta $isChecked={isVisible}>
                      {isVisible ? t('common.on') : t('common.off')}
                    </StyledHeaderMenuItemMeta>
                  </StyledHeaderMenuItem>
                );
              })}
            </>
          ) : (
            overflowItems.map((item) => (
              <StyledHeaderMenuItem
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => handleOverflowItemPress(item)}
                aria-label={item.label}
              >
                <StyledHeaderMenuItemContent>
                  <StyledHeaderMenuItemIcon>
                    <Icon glyph={item.icon} decorative accessibilityLabel={item.label} />
                  </StyledHeaderMenuItemIcon>
                  <StyledHeaderMenuItemLabel>{item.label}</StyledHeaderMenuItemLabel>
                </StyledHeaderMenuItemContent>
              </StyledHeaderMenuItem>
            ))
          )}
        </StyledHeaderMenu>
      ) : null}
    </StyledHeaderMenuWrapper>
  ) : null;
  const shouldShowSidebarControls = isMobile || !isSidebarCollapsed;
  const headerSlot = isHeaderHidden
    ? null
    : (
      <GlobalHeader
        title={brandTitle}
        accessibilityLabel={t('navigation.header.title')}
        testID="main-header"
        actions={headerActions}
        utilitySlot={(
          <StyledHeaderUtilityRow>
            {shouldShowNotificationsInline ? (
              <StyledNotificationsWrapper ref={notificationsRef}>
                <StyledNotificationsButton
                  type="button"
                  onClick={handleToggleNotifications}
                  aria-haspopup="menu"
                  aria-expanded={isNotificationsOpen}
                  aria-label={t('navigation.notifications.label')}
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
                  <StyledNotificationsMenu
                    role="menu"
                    aria-label={t('navigation.notifications.menuLabel')}
                    onKeyDown={handleNotificationsKeyDown}
                    ref={notificationsMenuRef}
                  >
                    {notificationItems.length === 0 ? (
                      <StyledNotificationsEmpty>
                        {t('navigation.notifications.empty')}
                      </StyledNotificationsEmpty>
                    ) : (
                      <>
                        {notificationItems.map((item) => (
                          <StyledNotificationsItem
                            key={item.id}
                            type="button"
                            role="menuitem"
                            data-notification-id={item.id}
                            onClick={handleNotificationSelect}
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
                          onClick={handleViewNotifications}
                          aria-label={t('navigation.notifications.viewAll')}
                        >
                          <StyledNotificationsItemContent>
                            <StyledNotificationsItemIcon>
                              <Icon
                                glyph="📬"
                                decorative
                                accessibilityLabel={t('navigation.notifications.viewAll')}
                              />
                            </StyledNotificationsItemIcon>
                            <StyledNotificationsItemTitle>
                              {t('navigation.notifications.viewAll')}
                            </StyledNotificationsItemTitle>
                          </StyledNotificationsItemContent>
                        </StyledNotificationsItem>
                      </>
                    )}
                  </StyledNotificationsMenu>
                ) : null}
              </StyledNotificationsWrapper>
            ) : null}
            {shouldShowNetwork ? <NetworkIndicator testID="main-network-indicator" /> : null}
            {shouldShowFullscreenInline ? (
              <StyledFullscreenButton
                variant="outline"
                size="small"
                onPress={handleToggleFullscreen}
                accessibilityLabel={fullscreenLabel}
                testID="main-fullscreen-toggle"
                icon={fullscreenIcon}
              >
                {!isMobile ? fullscreenLabel : null}
              </StyledFullscreenButton>
            ) : null}
            {!isMobile ? (
              <StyledHeaderMenuWrapper ref={customizationWrapperRef}>
                <StyledHeaderMenuButton
                  type="button"
                  onClick={handleToggleHeaderCustomization}
                  aria-haspopup="menu"
                  aria-expanded={isHeaderCustomizationOpen}
                  aria-label={t('navigation.header.customize')}
                  data-testid="main-header-customize-toggle"
                >
                  <Icon glyph="⚙" decorative accessibilityLabel={t('navigation.header.customize')} />
                </StyledHeaderMenuButton>
                {isHeaderCustomizationOpen ? (
                  <StyledHeaderMenu
                    role="menu"
                    aria-label={t('navigation.header.customizationMenuLabel')}
                    onKeyDown={handleCustomizationKeyDown}
                    ref={customizationMenuRef}
                  >
                    {headerCustomizationItems.map((item) => {
                      const isVisible = isHeaderActionVisible(item.id);
                      const iconMap = {
                        notifications: '🔔',
                        network: '📶',
                        fullscreen: '⛶',
                      };
                      return (
                        <StyledHeaderMenuItem
                          key={item.id}
                          type="button"
                          role="menuitemcheckbox"
                          aria-checked={isVisible}
                          $isChecked={isVisible}
                          onClick={() => handleToggleHeaderActionVisibility(item.id)}
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
                          <StyledHeaderMenuItemMeta $isChecked={isVisible}>
                            {isVisible ? t('common.on') : t('common.off')}
                          </StyledHeaderMenuItemMeta>
                        </StyledHeaderMenuItem>
                      );
                    })}
                  </StyledHeaderMenu>
                ) : null}
              </StyledHeaderMenuWrapper>
            ) : null}
            {!isMobile ? (
              <StyledHeaderToggleButton
                variant="outline"
                size="small"
                onPress={handleHideHeader}
                accessibilityLabel={t('navigation.header.hideHeader')}
                testID="main-header-toggle"
                icon={<Icon glyph="˄" decorative accessibilityLabel={t('navigation.header.hideHeader')} />}
              />
            ) : null}
            {overflowMenu}
          </StyledHeaderUtilityRow>
        )}
      />
    );

  // Use platform MainLayout component with Sidebar, Header, and Slot
  return (
    <>
      <AppFrame
        sidebar={
          <StyledSidebarWrapper>
            <Sidebar
              accessibilityLabel={t('navigation.sidebar.title')}
              items={mainItems}
              isItemVisible={isItemVisible}
              collapsed={isSidebarCollapsed}
              footerSlot={shouldShowSidebarControls ? (
                <StyledSidebarControls>
                  <LanguageControls testID="main-language-controls" />
                  <ThemeControls testID="main-theme-controls" />
                </StyledSidebarControls>
              ) : null}
              testID="main-sidebar"
            />
            {!isMobile && !isSidebarCollapsed ? (
              <StyledSidebarResizeHandle
                role="slider"
                aria-orientation="vertical"
                aria-label={t('navigation.sidebar.resize')}
                aria-valuemin={SIDEBAR_MIN_WIDTH}
                aria-valuemax={SIDEBAR_MAX_WIDTH}
                aria-valuenow={resolvedSidebarWidth}
                tabIndex={0}
                onMouseDown={handleResizeStart}
                onKeyDown={handleResizeKeyDown}
              />
            ) : null}
          </StyledSidebarWrapper>
        }
        header={headerSlot}
        footer={
          <GlobalFooter
            variant={FOOTER_VARIANTS.MAIN}
            accessibilityLabel={t('navigation.footer.title')}
            testID="main-footer"
          />
        }
        banner={bannerSlot}
        overlay={overlaySlot}
        notices={<NoticeSurface testID="main-notice-surface" />}
        sidebarCollapsed={isSidebarCollapsed}
        sidebarWidth={resolvedSidebarWidth}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        accessibilityLabel={t('navigation.mainNavigation')}
        testID="main-route-layout"
      >
        <Slot />
      </AppFrame>
      {isHeaderHidden ? (
        <StyledHeaderRevealButton
          variant="outline"
          size="small"
          onPress={handleShowHeader}
          accessibilityLabel={t('navigation.header.showHeader')}
          testID="main-header-reveal"
        >
          <Icon glyph="˅" decorative accessibilityLabel={t('navigation.header.showHeader')} />
        </StyledHeaderRevealButton>
      ) : null}
      {isMobile ? (
        <StyledMobileSidebarOverlay
          isOpen={isMobileSidebarOpen}
          aria-hidden={!isMobileSidebarOpen}
          onKeyDown={handleMobileOverlayKeyDown}
        >
          <StyledMobileSidebarPanel
            isOpen={isMobileSidebarOpen}
            role="dialog"
            aria-modal="true"
            aria-label={t('navigation.sidebar.title')}
            ref={mobileSidebarRef}
          >
            <StyledMobileSidebarHeader>
              <StyledMobileCloseButton
                type="button"
                onClick={handleCloseMobileSidebar}
                aria-label={t('common.close')}
                ref={closeButtonRef}
              >
                X
              </StyledMobileCloseButton>
            </StyledMobileSidebarHeader>
            <StyledMobileSidebarContent>
              <Sidebar
                accessibilityLabel={t('navigation.sidebar.title')}
                items={mainItems}
                isItemVisible={isItemVisible}
                collapsed
                footerSlot={shouldShowSidebarControls ? (
                  <StyledSidebarControls>
                    <LanguageControls testID="main-language-controls-mobile" />
                    <ThemeControls testID="main-theme-controls-mobile" />
                  </StyledSidebarControls>
                ) : null}
                testID="main-sidebar-mobile"
              />
            </StyledMobileSidebarContent>
          </StyledMobileSidebarPanel>
          <StyledMobileSidebarBackdrop
            type="button"
            onClick={handleCloseMobileSidebar}
            aria-label={t('common.close')}
          />
        </StyledMobileSidebarOverlay>
      ) : null}
    </>
  );
};

export default MainRouteLayoutWeb;

