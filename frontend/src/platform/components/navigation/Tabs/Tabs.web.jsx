/**
 * Tabs Component - Web
 * Horizontal tab navigation (keyboard accessible)
 * File: Tabs.web.jsx
 */
import React from 'react';
import { StyledTabs } from './Tabs.web.styles';
import { VARIANTS } from './types';

/**
 * Tabs component for Web
 * @param {Object} props - Tabs props
 * @param {string} props.variant - Tabs variant (default, pills, underline)
 * @param {string} props.activeTab - Active tab ID
 * @param {Function} props.onChange - Tab change handler
 * @param {React.ReactNode} props.children - Tab components
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const TabsWeb = ({
  variant = VARIANTS.DEFAULT,
  activeTab,
  onChange,
  children,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  return (
    <StyledTabs
      variant={variant}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      className={className}
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

export default TabsWeb;

