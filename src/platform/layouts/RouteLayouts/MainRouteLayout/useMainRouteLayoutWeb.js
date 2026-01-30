/**
 * useMainRouteLayoutWeb Hook
 * Web-specific state, effects, and handlers for MainRouteLayout
 * File: useMainRouteLayoutWeb.js
 * Per component-structure.mdc: Logic in useComponentName.js
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAuth, useFocusTrap, useI18n, usePrimaryNavigation, useUiState } from '@hooks';
import { AUTH } from '@config';
import breakpoints from '@theme/breakpoints';
import { Icon, LoadingOverlay } from '@platform/components';
import {
  useHeaderActions,
  useNotificationData,
  useHeaderCustomizationItems,
} from './useMainLayoutMemo';
import useKeyboardShortcuts from './useKeyboardShortcuts';
import { ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader/types';
import { actions as uiActions } from '@store/slices/ui.slice';
import { SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH, SIDEBAR_DEFAULT_WIDTH, clamp } from './types';

export default function useMainRouteLayoutWeb() {
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
  const { isAuthenticated, logout, roles } = useAuth();
  const canAccessRegister = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!AUTH.REGISTER_ROLES?.length) return false;
    return AUTH.REGISTER_ROLES.some((role) => roles.includes(role));
  }, [isAuthenticated, roles]);
  const { mainItems, isItemVisible } = usePrimaryNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < breakpoints.tablet;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isCompactHeader = width < breakpoints.desktop;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isHeaderCustomizationOpen, setIsHeaderCustomizationOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const closeButtonRef = useRef(null);
  const mobileSidebarRef = useRef(null);
  const notificationsRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  const overflowWrapperRef = useRef(null);
  const overflowMenuRef = useRef(null);
  const customizationWrapperRef = useRef(null);
  const customizationMenuRef = useRef(null);

  const resolvedSidebarWidth = useMemo(
    () => clamp(storedSidebarWidth ?? SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH),
    [storedSidebarWidth]
  );
  const isSidebarCollapsed = isMobile ? true : storedSidebarCollapsed;
  const hasDocument = typeof document !== 'undefined';
  const overlaySlot = isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null;

  useEffect(() => {
    if (isMobile) setIsMobileSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && isNotificationsOpen) setIsNotificationsOpen(false);
  }, [isMobile, isNotificationsOpen]);

  useEffect(() => {
    if (isMobile && isHeaderCustomizationOpen) setIsHeaderCustomizationOpen(false);
  }, [isMobile, isHeaderCustomizationOpen]);

  useEffect(() => {
    if (!hasDocument || !isMobile) return undefined;
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDocument, isNotificationsOpen]);

  useEffect(() => {
    if (!hasDocument || !isOverflowOpen) return;
    const handleClickOutside = (e) => {
      if (overflowWrapperRef.current && !overflowWrapperRef.current.contains(e.target)) {
        setIsOverflowOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDocument, isOverflowOpen]);

  useEffect(() => {
    if (!hasDocument || !isHeaderCustomizationOpen) return;
    const handleClickOutside = (e) => {
      if (customizationWrapperRef.current && !customizationWrapperRef.current.contains(e.target)) {
        setIsHeaderCustomizationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDocument, isHeaderCustomizationOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isTablet && !isMobile && width < breakpoints.desktop && !storedSidebarCollapsed) {
      dispatch(uiActions.setSidebarCollapsed(true));
    }
  }, [isTablet, width, storedSidebarCollapsed, dispatch]);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) setIsMobileSidebarOpen((p) => !p);
    else dispatch(uiActions.setSidebarCollapsed(!storedSidebarCollapsed));
  }, [dispatch, isMobile, storedSidebarCollapsed]);

  const handleShowHeader = useCallback(() => dispatch(uiActions.setHeaderHidden(false)), [dispatch]);
  const handleHideHeader = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    dispatch(uiActions.setHeaderHidden(true));
  }, [dispatch]);

  const handleToggleHeader = useCallback(() => {
    if (isHeaderHidden) handleShowHeader();
    else handleHideHeader();
  }, [isHeaderHidden, handleShowHeader, handleHideHeader]);

  const handleOpenCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const handleCloseCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const handleShowShortcuts = useCallback(() => {
    // TODO: Implement shortcuts help modal (use @logging/logger when available)
  }, []);
  const handleCloseMenus = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsCommandPaletteOpen(false);
  }, []);

  const handleGoToLogin = useCallback(() => router.push('/login'), [router]);
  const handleGoToRegister = useCallback(() => router.push('/register'), [router]);
  const handleCloseMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);
  const handleToggleNotifications = useCallback(() => {
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsNotificationsOpen((p) => !p);
  }, []);
  const handleCloseNotifications = useCallback(() => setIsNotificationsOpen(false), []);
  const handleToggleOverflowMenu = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsOverflowOpen((p) => !p);
  }, []);
  const handleToggleHeaderCustomization = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen((p) => !p);
  }, []);

  const handleNotificationsKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseNotifications();
      }
    },
    [handleCloseNotifications]
  );
  const handleOverflowKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOverflowOpen(false);
    }
  }, []);
  const handleCustomizationKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsHeaderCustomizationOpen(false);
    }
  }, []);

  const handleNotificationSelect = useCallback(
    (e) => {
      if (e.currentTarget?.dataset?.notificationId) setIsNotificationsOpen(false);
      if (isMobile) setIsOverflowOpen(false);
    },
    [isMobile]
  );

  const handleViewNotifications = useCallback(() => {
    router.push('/notifications');
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
  }, [router]);

  const handleToggleHeaderActionVisibility = useCallback(
    (key) => dispatch(uiActions.toggleHeaderActionVisibility(key)),
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
        dispatch(uiActions.setSidebarWidth(clamp(startWidth + delta, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH)));
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
    (e) => {
      if (isMobile || isSidebarCollapsed) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const delta = e.key === 'ArrowRight' ? 12 : -12;
        dispatch(uiActions.setSidebarWidth(clamp(resolvedSidebarWidth + delta, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH)));
      }
    },
    [dispatch, isMobile, isSidebarCollapsed, resolvedSidebarWidth]
  );

  const handleMobileOverlayKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseMobileSidebar();
      }
    },
    [handleCloseMobileSidebar]
  );

  const handleToggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  }, []);

  useKeyboardShortcuts(
    {
      toggleSidebar: handleToggleSidebar,
      toggleHeader: handleToggleHeader,
      openCommandPalette: handleOpenCommandPalette,
      showShortcuts: handleShowShortcuts,
      closeMenus: handleCloseMenus,
    },
    true
  );
  useFocusTrap(mobileSidebarRef, isMobileSidebarOpen, { initialFocusRef: closeButtonRef });
  useFocusTrap(notificationsMenuRef, isNotificationsOpen);
  useFocusTrap(overflowMenuRef, isOverflowOpen);
  useFocusTrap(customizationMenuRef, isHeaderCustomizationOpen);

  const headerCustomizationItems = useHeaderCustomizationItems(t);
  const isHeaderActionVisible = useCallback(
    (key) => headerActionVisibility?.[key] !== false,
    [headerActionVisibility]
  );

  const authHeaderActions = useMemo(() => {
    if (!isAuthenticated) {
      return [
        {
          id: 'login',
          label: t('auth.login.button'),
          accessibilityLabel: t('auth.login.button'),
          onPress: handleGoToLogin,
          variant: ACTION_VARIANTS.PRIMARY,
        },
      ];
    }
    const actions = [];
    if (canAccessRegister) {
      actions.push({
        id: 'register',
        label: t('auth.register.button'),
        accessibilityLabel: t('auth.register.button'),
        onPress: handleGoToRegister,
        variant: ACTION_VARIANTS.GHOST,
      });
    }
    /* Logout moved to HeaderUtility user menu */
    return actions;
  }, [canAccessRegister, handleGoToLogin, handleGoToRegister, isAuthenticated, t]);

  const rawNotificationItems = useMemo(
    () => [
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
    ],
    [t]
  );
  const { notificationItems, unreadCount } = useNotificationData(rawNotificationItems);

  const shouldShowNotifications = isHeaderActionVisible('notifications');
  const shouldShowNetwork = isHeaderActionVisible('network');
  const shouldShowDatabase = isHeaderActionVisible('database');
  const shouldShowNotificationsInline = !isMobile && shouldShowNotifications;
  const shouldShowFullscreenInline = isHeaderActionVisible('fullscreen') && !isCompactHeader && !isMobile;
  const shouldShowFullscreenOverflow = isHeaderActionVisible('fullscreen') && (isCompactHeader || isMobile);
  const fullscreenLabel = isFullscreen ? t('navigation.fullscreen.exit') : t('navigation.fullscreen.enter');
  const fullscreenIconGlyph = isFullscreen ? '🗗' : '⛶';

  const overflowItems = useMemo(
    () =>
      isMobile
        ? []
        : shouldShowFullscreenOverflow
          ? [{ id: 'fullscreen', label: fullscreenLabel, onPress: handleToggleFullscreen, icon: fullscreenIconGlyph }]
          : [],
    [fullscreenIconGlyph, fullscreenLabel, handleToggleFullscreen, isMobile, shouldShowFullscreenOverflow]
  );

  const shouldShowOverflowMenu = isMobile || overflowItems.length > 0;
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

  useEffect(() => {
    if (!shouldShowNotifications && isNotificationsOpen) setIsNotificationsOpen(false);
  }, [isNotificationsOpen, shouldShowNotifications]);

  useEffect(() => {
    if (!isMobile && overflowItems.length === 0 && isOverflowOpen) setIsOverflowOpen(false);
  }, [isMobile, isOverflowOpen, overflowItems.length]);

  const handleOverflowItemPress = useCallback(async (item) => {
    if (item?.onPress) await item.onPress();
    setIsOverflowOpen(false);
  }, []);

  const CUSTOMIZATION_ICON_MAP = useMemo(
    () => ({ notifications: '🔔', network: '📶', database: '🗄', fullscreen: '⛶' }),
    []
  );

  return {
    t,
    mainItems,
    isItemVisible,
    overlaySlot,
    resolvedSidebarWidth,
    isSidebarCollapsed,
    isMobile,
    isHeaderHidden,
    isMobileSidebarOpen,
    isNotificationsOpen,
    isOverflowOpen,
    isHeaderCustomizationOpen,
    notificationItems,
    unreadCount,
    headerCustomizationItems,
    overflowItems,
    fullscreenLabel,
    fullscreenIconGlyph,
    shouldShowNotifications,
    shouldShowNetwork,
    shouldShowDatabase,
    shouldShowNotificationsInline,
    shouldShowFullscreenInline,
    shouldShowFullscreenOverflow,
    isHeaderActionVisible,
    authHeaderActions,
    handleToggleSidebar,
    handleShowHeader,
    handleHideHeader,
    handleCloseMobileSidebar,
    handleToggleNotifications,
    handleCloseNotifications,
    handleToggleOverflowMenu,
    handleToggleHeaderCustomization,
    handleNotificationsKeyDown,
    handleOverflowKeyDown,
    handleCustomizationKeyDown,
    handleNotificationSelect,
    handleViewNotifications,
    handleToggleHeaderActionVisibility,
    handleResizeStart,
    handleResizeKeyDown,
    handleMobileOverlayKeyDown,
    handleToggleFullscreen,
    handleOverflowItemPress,
    shouldShowOverflowMenu,
    fullscreenIcon,
    closeButtonRef,
    mobileSidebarRef,
    notificationsRef,
    notificationsMenuRef,
    overflowWrapperRef,
    overflowMenuRef,
    customizationWrapperRef,
    customizationMenuRef,
    CUSTOMIZATION_ICON_MAP,
    isFullscreen,
    onLogout: logout,
    isAuthenticated,
  };
}
