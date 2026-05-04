/**
 * List Component - iOS
 * Virtualized list container
 * File: List.ios.jsx
 */
// 1. External dependencies
import React from 'react';
import { FlatList } from 'react-native';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledList } from './List.ios.styles';

/**
 * List component for iOS
 * @param {Object} props - List props
 * @param {React.ReactNode} props.children - List items
 * @param {Array} props.data - Data array (for FlatList)
 * @param {Function} props.renderItem - Render function (for FlatList)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ListIOS = ({
  children,
  data,
  renderItem,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const defaultLabel = t('common.list');

  // If data and renderItem are provided, use FlatList for virtualization
  if (data && renderItem) {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        accessibilityRole="list"
        accessibilityLabel={accessibilityLabel || defaultLabel}
        testID={testID}
        style={style}
        {...rest}
      />
    );
  }

  // Otherwise, render children directly
  return (
    <StyledList
      accessibilityRole="list"
      accessibilityLabel={accessibilityLabel || defaultLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      {children}
    </StyledList>
  );
};

export default ListIOS;

