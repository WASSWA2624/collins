/**
 * Sidebar Component - Web
 * Desktop navigation sidebar with collapsible sections
 * File: Sidebar.web.jsx
 */
import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import Text from '@platform/components/display/Text';
import Badge from '@platform/components/display/Badge';
import { Divider } from '@platform/components';
import { useI18n } from '@hooks';
import NavItemIcon from '@platform/components/navigation/NavItemIcon';
import useSidebar from './useSidebar';
import {
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarFooter,
  StyledNavSection,
  StyledNavSectionHeader,
  StyledNavSectionTitle,
  StyledNavItem,
  StyledNavItemContent,
  StyledNavItemIcon,
  StyledNavItemLabel,
  StyledNavItemBadge,
  StyledNavItemChildren,
  StyledExpandIcon,
} from './Sidebar.web.styles';

/**
 * Sidebar component for Web
 * @param {Object} props - Sidebar props
 * @param {Array} props.items - Navigation items
 * @param {boolean} props.collapsed - Collapsed state
 * @param {Function} props.onItemPress - Item press handler
 * @param {Function} props.isItemVisible - Function to check item visibility
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.footerSlot - Optional footer slot content
 */
const SidebarWeb = ({
  items = [],
  collapsed = false,
  onItemPress,
  isItemVisible,
  accessibilityLabel,
  testID,
  className,
  style,
  footerSlot,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    expandedSections,
    isItemActive,
    toggleSection,
    handleItemPress: hookHandleItemPress,
    filteredItems,
  } = useSidebar({
    items,
    onItemPress: onItemPress || ((item) => {
      if (item.href) {
        router.push(item.href);
      } else if (item.onPress) {
        item.onPress(item);
      }
    }),
    isItemVisible,
  });

  const handlePress = (item) => {
    if (onItemPress) {
      onItemPress(item);
    } else {
      hookHandleItemPress(item);
    }
  };

  const handleItemKeyDown = (event, item) => {
    // Handle Enter and Space keys for keyboard navigation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (item.children && item.children.length > 0) {
        toggleSection(item.id);
      } else {
        handlePress(item);
      }
    }
  };

  const renderNavItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isItemActive(item);
    const isExpanded = expandedSections[item.id] || false;

    return (
      <React.Fragment key={item.id}>
        <StyledNavItem
          level={level}
          active={isActive}
          onPress={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              handlePress(item);
            }
          }}
          onKeyDown={(event) => handleItemKeyDown(event, item)}
          tabIndex={0}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: isActive }}
          testID={testID ? `${testID}-item-${item.id}` : undefined}
        >
          <StyledNavItemContent>
            {item.icon && (
              <StyledNavItemIcon>
                <NavItemIcon name={item.icon} size={24} />
              </StyledNavItemIcon>
            )}
            {!collapsed && (
              <>
                <StyledNavItemLabel active={isActive}>{item.label}</StyledNavItemLabel>
                {item.badge && (
                  <StyledNavItemBadge>
                    <Badge variant="primary" size="small">
                      {item.badgeCount || ''}
                    </Badge>
                  </StyledNavItemBadge>
                )}
                {hasChildren && (
                  <StyledExpandIcon expanded={isExpanded}>▼</StyledExpandIcon>
                )}
              </>
            )}
          </StyledNavItemContent>
        </StyledNavItem>
        {hasChildren && isExpanded && !collapsed && (
          <StyledNavItemChildren>
            {item.children.map((child) => renderNavItem(child, level + 1))}
          </StyledNavItemChildren>
        )}
      </React.Fragment>
    );
  };

  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach((item) => {
      const group = item.group || 'main';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <StyledSidebar
      collapsed={collapsed}
      accessibilityRole="navigation"
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledSidebarContent>
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <StyledNavSection key={groupName}>
            {!collapsed && groupName !== 'main' && (
              <StyledNavSectionHeader>
                <StyledNavSectionTitle>{groupName}</StyledNavSectionTitle>
              </StyledNavSectionHeader>
            )}
            {groupItems.map((item) => renderNavItem(item))}
            {groupName !== 'main' && <Divider />}
          </StyledNavSection>
        ))}
      </StyledSidebarContent>
      {footerSlot ? <StyledSidebarFooter>{footerSlot}</StyledSidebarFooter> : null}
    </StyledSidebar>
  );
};

export default SidebarWeb;

