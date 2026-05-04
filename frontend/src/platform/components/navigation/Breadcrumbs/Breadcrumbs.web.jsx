/**
 * Breadcrumbs Component - Web
 * Navigation path indicator with responsive truncation
 * File: Breadcrumbs.web.jsx
 */
import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import Text from '@platform/components/display/Text';
import Icon from '@platform/components/display/Icon';
import { useI18n } from '@hooks';
import breakpoints from '@theme/breakpoints';
import {
  StyledBreadcrumbs,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledLink,
  StyledBreadcrumbIcon,
  StyledBreadcrumbEllipsis,
} from './Breadcrumbs.web.styles';

/**
 * Breadcrumb item structure
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - Breadcrumb label
 * @property {string} [href] - Link URL (optional for current item)
 * @property {string|React.ReactNode} [icon] - Icon for breadcrumb item
 * @property {Function} [onPress] - Press handler (alternative to href)
 */

/**
 * Breadcrumbs component for Web
 * @param {Object} props - Breadcrumbs props
 * @param {Array<BreadcrumbItem>} props.items - Array of breadcrumb items
 * @param {string} props.separator - Separator character (default: '/')
 * @param {Function} props.onItemPress - Item press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const BreadcrumbsWeb = ({
  items = [],
  separator = '/',
  onItemPress,
  accessibilityLabel,
  testID,
  className,
  style,
  maxItems = 5, // Maximum items to show before truncation
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < breakpoints.tablet;

  if (!items || items.length === 0) return null;

  // Truncate breadcrumbs on mobile or when too many items
  const displayItems = useMemo(() => {
    if (items.length <= maxItems && !isMobile) {
      return items;
    }

    // On mobile or when too many items, show: first, ellipsis, last 2 items
    if (items.length <= 2) {
      return items;
    }

    // Show first item, ellipsis, and last 2 items
    const first = items[0];
    const lastTwo = items.slice(-2);
    return [
      first,
      { label: '...', isEllipsis: true },
      ...lastTwo,
    ];
  }, [items, maxItems, isMobile]);

  const handleItemPress = (item, index) => {
    if (onItemPress) {
      onItemPress(item, index);
    } else if (item.href) {
      router.push(item.href);
    } else if (item.onPress) {
      item.onPress(item);
    }
  };

  const handleItemKeyDown = (event, item, index) => {
    // Handle Enter and Space keys for keyboard navigation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const isLast = index === displayItems.length - 1;
      if (!isLast && !item.isEllipsis) {
        handleItemPress(item, index);
      }
    }
  };

  return (
    <StyledBreadcrumbs
      accessibilityRole="navigation"
      accessibilityLabel={accessibilityLabel || t('navigation.breadcrumbs.title')}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.isEllipsis;
        const hasLink = !isLast && !isEllipsis && (item.href || item.onPress || onItemPress);

        return (
          <React.Fragment key={index}>
            {index > 0 && <StyledSeparator>{separator}</StyledSeparator>}
            {isEllipsis ? (
              <StyledBreadcrumbEllipsis aria-hidden="true">
                {item.label}
              </StyledBreadcrumbEllipsis>
            ) : hasLink ? (
              <StyledLink
                href={item.href}
                onPress={() => handleItemPress(item, index)}
                onKeyDown={(event) => handleItemKeyDown(event, item, index)}
                accessibilityRole="link"
                accessibilityLabel={item.label}
                testID={testID ? `${testID}-item-${index}` : undefined}
              >
                {item.icon && (
                  <StyledBreadcrumbIcon>
                    <Icon glyph={item.icon} size="xs" decorative />
                  </StyledBreadcrumbIcon>
                )}
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {item.label}
                </Text>
              </StyledLink>
            ) : (
              <StyledBreadcrumbItem
                isLast={isLast}
                accessibilityRole="text"
                accessibilityLabel={item.label}
              >
                {item.icon && (
                  <StyledBreadcrumbIcon>
                    <Icon glyph={item.icon} size="xs" decorative />
                  </StyledBreadcrumbIcon>
                )}
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {item.label}
                </Text>
              </StyledBreadcrumbItem>
            )}
          </React.Fragment>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export default BreadcrumbsWeb;
