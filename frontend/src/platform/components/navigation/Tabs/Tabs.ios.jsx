/**
 * Tabs Component - iOS
 * Horizontal tab navigation
 * File: Tabs.ios.jsx
 */
import React from 'react';
import { StyledTabs } from './Tabs.ios.styles';
import { VARIANTS } from './types';

/**
 * Tabs component for iOS
 * @param {Object} props - Tabs props
 * @param {string} props.variant - Tabs variant (default, pills, underline)
 * @param {string} props.activeTab - Active tab ID
 * @param {Function} props.onChange - Tab change handler
 * @param {React.ReactNode} props.children - Tab components
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const TabsIOS = ({
  variant = VARIANTS.DEFAULT,
  activeTab,
  onChange,
  children,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  return (
    <StyledTabs
      variant={variant}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            variant,
            active: child.props.tabId === activeTab,
            onPress: () => onChange && onChange(child.props.tabId),
          });
        }
        return child;
      })}
    </StyledTabs>
  );
};

export default TabsIOS;

