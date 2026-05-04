/**
 * Tab Component - iOS
 * Individual tab item
 * File: Tab.ios.jsx
 */
import React from 'react';
import { StyledTab, StyledTabText } from './Tab.ios.styles';

/**
 * Tab component for iOS
 * @param {Object} props - Tab props
 * @param {string} props.tabId - Unique tab identifier
 * @param {string} props.label - Tab label
 * @param {boolean} props.active - Active state
 * @param {Function} props.onPress - Press handler
 * @param {string} props.variant - Tab variant (from parent Tabs)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const TabIOS = ({
  tabId,
  label,
  active = false,
  onPress,
  variant = 'default',
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  return (
    <StyledTab
      active={active}
      variant={variant}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ selected: active }}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledTabText active={active} variant={variant}>
        {label}
      </StyledTabText>
    </StyledTab>
  );
};

export default TabIOS;

