/**
 * TabBar Component - Android
 * Bottom navigation bar for mobile
 * File: TabBar.android.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Badge from '@platform/components/display/Badge';
import { useI18n } from '@hooks';
import { getMenuIconGlyph } from '@config/sideMenu';
import useTabBar from './useTabBar';
import {
  StyledTabBar,
  StyledTabBarContent,
  StyledTabItem,
  StyledTabItemIcon,
  StyledTabItemBadge,
} from './TabBar.android.styles';

/**
 * TabBar component for Android
 * @param {Object} props - TabBar props
 * @param {Array} props.items - Tab items
 * @param {Function} props.onTabPress - Tab press handler
 * @param {Function} props.isTabVisible - Function to check tab visibility
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const TabBarAndroid = ({
  items = [],
  onTabPress,
  isTabVisible,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const { bottom: bottomInset } = useSafeAreaInsets();
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
      bottomInset={bottomInset}
      accessibilityLabel={accessibilityLabel || t('navigation.tabBar.title')}
      testID={testID}
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
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              testID={testID ? `${testID}-tab-${item.id}` : undefined}
            >
              <StyledTabItemIcon active={isActive}>{getMenuIconGlyph(item.icon)}</StyledTabItemIcon>
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

export default TabBarAndroid;

