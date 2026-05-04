/**
 * Breadcrumbs Component - iOS
 * Navigation path indicator
 * File: Breadcrumbs.ios.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
import Text from '@platform/components/display/Text';
import { useI18n } from '@hooks';
import {
  StyledBreadcrumbs,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledLink,
} from './Breadcrumbs.ios.styles';

/**
 * Breadcrumbs component for iOS
 * @param {Object} props - Breadcrumbs props
 * @param {Array<BreadcrumbItem>} props.items - Array of breadcrumb items
 * @param {string} props.separator - Separator character (default: '/')
 * @param {Function} props.onItemPress - Item press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const BreadcrumbsIOS = ({
  items = [],
  separator = '/',
  onItemPress,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();

  if (!items || items.length === 0) return null;

  const handleItemPress = (item, index) => {
    if (onItemPress) {
      onItemPress(item, index);
    } else if (item.href) {
      router.push(item.href);
    } else if (item.onPress) {
      item.onPress(item);
    }
  };

  return (
    <StyledBreadcrumbs
      accessibilityLabel={accessibilityLabel || t('navigation.breadcrumbs.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const hasLink = !isLast && (item.href || item.onPress || onItemPress);

        return (
          <React.Fragment key={index}>
            {index > 0 && <StyledSeparator>{separator}</StyledSeparator>}
            {hasLink ? (
              <StyledLink
                onPress={() => handleItemPress(item, index)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                testID={testID ? `${testID}-item-${index}` : undefined}
              >
                <Text>{item.label}</Text>
              </StyledLink>
            ) : (
              <StyledBreadcrumbItem
                isLast={isLast}
                accessibilityRole="text"
                accessibilityLabel={item.label}
              >
                {item.label}
              </StyledBreadcrumbItem>
            )}
          </React.Fragment>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export default BreadcrumbsIOS;
