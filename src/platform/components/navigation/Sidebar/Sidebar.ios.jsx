/**
 * Sidebar Component - iOS
 * Mobile navigation drawer (typically used in drawer navigation)
 * File: Sidebar.ios.jsx
 */
import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
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
} from './Sidebar.ios.styles';

/**
 * Sidebar component for iOS
 * @param {Object} props - Sidebar props
 * @param {Array} props.items - Navigation items
 * @param {Function} props.onItemPress - Item press handler
 * @param {Function} props.isItemVisible - Function to check item visibility
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const SidebarIOS = ({
  items = [],
  onItemPress,
  isItemVisible,
  accessibilityLabel,
  testID,
  style,
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
            <StyledNavItemLabel active={isActive}>{item.label}</StyledNavItemLabel>
            {item.badge && (
              <StyledNavItemBadge>
                <Badge variant="primary" size="small">
                  {item.badgeCount || ''}
                </Badge>
              </StyledNavItemBadge>
            )}
            {hasChildren && <StyledExpandIcon expanded={isExpanded}>▼</StyledExpandIcon>}
          </StyledNavItemContent>
        </StyledNavItem>
        {hasChildren && isExpanded && (
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
      accessibilityRole="navigation"
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      <ScrollView
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <StyledSidebarContent>
          {Object.entries(groupedItems).map(([groupName, groupItems]) => (
            <StyledNavSection key={groupName}>
              {groupName !== 'main' && (
                <StyledNavSectionHeader>
                  <StyledNavSectionTitle>{groupName}</StyledNavSectionTitle>
                </StyledNavSectionHeader>
              )}
              {groupItems.map((item) => renderNavItem(item))}
              {groupName !== 'main' && <Divider />}
            </StyledNavSection>
          ))}
        </StyledSidebarContent>
      </ScrollView>
    </StyledSidebar>
  );
};

export default SidebarIOS;

