import React, { useMemo } from 'react';
import { usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import {
  StyledSidebar,
  StyledSidebarHeader,
  StyledCloseButton,
  StyledSidebarContent,
} from './Sidebar.web.styles';
import Icon from '@platform/components/display/Icon';
import SidebarItem from '@platform/components/navigation/SidebarItem';
import { getMenuIconGlyph, SIDE_MENU_ITEMS } from '@config/sideMenu';

const isItemActive = (pathname, href) => {
  if (!href) return false;
  if (pathname === href) return true;
  if (href !== '/' && pathname.startsWith(href + '/')) return true;
  return false;
};

/**
 * Sidebar component for Web
 * Renders nav items with pathname-based active state and localized labels.
 */
const SidebarWeb = ({
  items = SIDE_MENU_ITEMS,
  itemsI18nPrefix = 'navigation.items.main',
  collapsed = false,
  onClose,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const pathname = usePathname();
  const topLevel = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <StyledSidebar
      $collapsed={collapsed}
      accessibilityRole="navigation"
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {onClose ? (
        <StyledSidebarHeader>
          <StyledCloseButton
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            aria-description={t('common.closeSidebarHint')}
            title={t('common.close')}
            data-testid="sidebar-close"
          >
            <Icon glyph={getMenuIconGlyph('close-outline')} size="sm" decorative />
          </StyledCloseButton>
        </StyledSidebarHeader>
      ) : null}
      <StyledSidebarContent $collapsed={collapsed}>
        {topLevel.map((item) => {
          const href = item.href ?? item.path;
          const i18nKey = item.id ? `${itemsI18nPrefix}.${item.id}` : '';
          const translated = i18nKey ? t(i18nKey) : '';
          const label = translated && translated !== i18nKey ? translated : item.label ?? '';
          const active = isItemActive(pathname, href);
          return (
            <SidebarItem
              key={item.id}
              item={{ ...item, href, label, path: href }}
              collapsed={collapsed}
              active={active}
              onClose={onClose}
            />
          );
        })}
      </StyledSidebarContent>
    </StyledSidebar>
  );
};

export default SidebarWeb;

