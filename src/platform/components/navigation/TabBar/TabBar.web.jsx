/**
 * TabBar Component - Web
 * Bottom navigation bar (typically hidden on web, shown on mobile viewports)
 * File: TabBar.web.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
import Text from '@platform/components/display/Text';
import Badge from '@platform/components/display/Badge';
import { useI18n } from '@hooks';
import useTabBar from './useTabBar';
import {
  StyledTabBar,
  StyledTabBarContent,
  StyledTabItem,
  StyledTabItemIcon,
  StyledTabItemBadge,
} from './TabBar.web.styles';

/**
 * TabBar component for Web
 * @param {Object} props - TabBar props
 * @param {Array} props.items - Tab items
 * @param {Function} props.onTabPress - Tab press handler
 * @param {Function} props.isTabVisible - Function to check tab visibility
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const TabBarWeb = ({
  items = [],
  onTabPress,
  isTabVisible,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    filteredItems,
    isTabActive,
    handleTabPress: hookHandleTabPress,
  } = useTabBar({
    items,
    onTabPress: onTabPress || ((item) => {
      if (item.href) {
        router.replace(item.href);
      } else if (item.onPress) {
        // istanbul ignore next - Unreachable through normal usage (handlePress checks item.onPress first)
        // This branch exists for completeness but is intentionally optimized away in handlePress
        item.onPress(item);
      }
    }),
    isTabVisible,
  });

  const handlePress = (item) => {
    if (onTabPress) {
      onTabPress(item);
    } else if (item.onPress) {
      item.onPress(item);
    } else {
      hookHandleTabPress(item);
    }
  };

  return (
    <StyledTabBar
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel || t('navigation.tabBar.title')}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledTabBarContent>
        {filteredItems.map((item) => {
          const isActive = isTabActive(item);
          return (
            <StyledTabItem
              key={item.id}
              active={isActive}
              onPress={() => handlePress(item)}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              testID={testID ? `${testID}-tab-${item.id}` : undefined}
            >
              <StyledTabItemIcon active={isActive}>{item.icon || '○'}</StyledTabItemIcon>
              {item.badge && item.badgeCount > 0 && (
                <StyledTabItemBadge>
                  <Badge variant="error" size="small">
                    {item.badgeCount > 99 ? '99+' : item.badgeCount}
                  </Badge>
                </StyledTabItemBadge>
              )}
            </StyledTabItem>
          );
        })}
      </StyledTabBarContent>
    </StyledTabBar>
  );
};

export default TabBarWeb;

