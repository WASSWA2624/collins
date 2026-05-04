/**
 * Dropdown Component - Android
 * Select menu, action menu
 * File: Dropdown.android.jsx
 */
import React from 'react';
import { StyledDropdown, StyledDropdownTrigger, StyledDropdownMenu, StyledDropdownItem } from './Dropdown.android.styles';
import useDropdown from './useDropdown';

/**
 * Dropdown component for Android
 * @param {Object} props - Dropdown props
 * @param {string|React.ReactNode} props.trigger - Trigger element/content
 * @param {Array<DropdownItem>} props.items - Dropdown items
 * @param {boolean} props.open - Controlled open state
 * @param {Function} props.onOpenChange - Open state change handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const DropdownAndroid = ({
  trigger,
  items = [],
  open: controlledOpen,
  onOpenChange,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { open: internalOpen, toggle, close } = useDropdown({
    defaultOpen: false,
    onOpenChange,
  });
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  return (
    <StyledDropdown testID={testID} style={style} {...rest}>
      <StyledDropdownTrigger
        onPress={toggle}
        accessibilityRole="button"
        accessibilityExpanded={open}
        accessibilityLabel={accessibilityLabel || 'Dropdown menu'}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {trigger}
      </StyledDropdownTrigger>
      {open && (
        <StyledDropdownMenu testID={testID ? `${testID}-menu` : undefined}>
          {items.map((item, index) => (
            <StyledDropdownItem
              key={item.value || index}
              onPress={() => {
                if (!item.disabled && item.onPress) {
                  item.onPress(item.value);
                  close();
                }
              }}
              disabled={item.disabled}
              accessibilityRole="menuitem"
              accessibilityLabel={item.label}
              testID={testID ? `${testID}-item-${index}` : undefined}
            >
              {item.label}
            </StyledDropdownItem>
          ))}
        </StyledDropdownMenu>
      )}
    </StyledDropdown>
  );
};

export default DropdownAndroid;

