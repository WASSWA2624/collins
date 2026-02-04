/**
 * Sidebar Component - iOS
 * Mobile navigation drawer (typically used in drawer navigation)
 * File: Sidebar.ios.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import useSidebar, { sidebarMenu } from '@platform/components/navigation/Sidebar/useSidebar';
import SidebarItem from '@platform/components/navigation/SidebarItem';
import AppLogo from '@platform/components/display/AppLogo';
import Icon from '@platform/components/display/Icon';
import { getMenuIconGlyph } from '@config/sideMenu';
import {
  StyledSidebar,
  StyledSidebarHeader,
  StyledSidebarHeaderBrand,
  StyledSidebarHeaderLogo,
  StyledSidebarHeaderAppName,
  StyledCloseButton,
  StyledContentWrap,
  StyledScrollView,
  StyledSidebarContent,
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
  items = sidebarMenu,
  collapsed = false,
  pathname,
  onItemPress,
  onClose,
  isItemVisible,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const { filteredItems, expandedSections, isItemActive, toggleSection } = useSidebar({
    items: Array.isArray(items) ? items : [],
    pathname,
    onItemPress,
    isItemVisible,
  });

  const resolveLabel = (item) => {
    const key = item?.id ? `navigation.items.main.${item.id}` : '';
    const translated = key ? t(key) : '';
    return translated && translated !== key ? translated : item?.label ?? '';
  };

  const resolveHref = (item) => item?.href ?? item?.path ?? null;

  const handlePress = (item) => {
    const hasChildren = Array.isArray(item?.children) && item.children.length > 0;
    if (hasChildren) {
      if (item?.id) toggleSection(item.id);
      return;
    }

    if (onItemPress) {
      onItemPress(item);
      return;
    }

    const href = resolveHref(item);
    if (href) router.push(href);
  };

  const renderItem = (item) => {
    const id = item?.id ?? '';
    const testItemId = id ? `sidebar-item-${id}` : undefined;
    const active = isItemActive(item);

    return (
      <SidebarItem
        item={{ ...item, href: resolveHref(item), label: resolveLabel(item), testID: testItemId }}
        collapsed={collapsed}
        active={active}
        onPress={() => handlePress(item)}
      />
    );
  };

  const renderChildren = (parent) => {
    const children = Array.isArray(parent?.children) ? parent.children : [];
    if (!parent?.id) return null;
    if (!expandedSections?.[parent.id]) return null;
    return children.map((child) => (
      <React.Fragment key={child?.id ?? ''}>{renderItem(child)}</React.Fragment>
    ));
  };

  return (
    <StyledSidebar
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      {onClose ? (
        <StyledSidebarHeader>
          <StyledSidebarHeaderBrand>
            <StyledSidebarHeaderLogo accessibilityElementsHidden>
              <AppLogo size="md" />
            </StyledSidebarHeaderLogo>
            <StyledSidebarHeaderAppName>{t('app.shortName')}</StyledSidebarHeaderAppName>
          </StyledSidebarHeaderBrand>
          <StyledCloseButton
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            accessibilityHint={t('common.closeSidebarHint')}
            testID="sidebar-close"
          >
            <Icon glyph={getMenuIconGlyph('close-outline')} size="lg" decorative />
          </StyledCloseButton>
        </StyledSidebarHeader>
      ) : null}
      <StyledContentWrap>
        <StyledScrollView showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
          <StyledSidebarContent>
            {filteredItems.map((item) => (
              <React.Fragment key={item?.id ?? ''}>
                {renderItem(item)}
                {renderChildren(item)}
              </React.Fragment>
            ))}
          </StyledSidebarContent>
        </StyledScrollView>
      </StyledContentWrap>
    </StyledSidebar>
  );
};

export default SidebarIOS;

