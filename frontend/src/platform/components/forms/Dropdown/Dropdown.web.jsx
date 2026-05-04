/**
 * Dropdown Component - Web
 * Select menu, action menu
 * File: Dropdown.web.jsx
 */
// 1. External dependencies
import React, { useEffect, useRef } from 'react';

// 2. Platform components (from barrel file) - N/A for Dropdown

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledDropdown, StyledDropdownTrigger, StyledDropdownMenu, StyledDropdownItem } from './Dropdown.web.styles';

// 5. Component-specific hook (relative import)
import useDropdown from './useDropdown';

// 6. Types and constants (relative import) - N/A for Dropdown

/**
 * Dropdown item structure
 * @typedef {Object} DropdownItem
 * @property {string} label - Item label
 * @property {string} value - Item value
 * @property {Function} onPress - Press handler
 * @property {boolean} disabled - Disabled state
 */

/**
 * Dropdown component for Web
 * @param {Object} props - Dropdown props
 * @param {string|React.ReactNode} props.trigger - Trigger element/content
 * @param {Array<DropdownItem>} props.items - Dropdown items
 * @param {boolean} props.open - Controlled open state
 * @param {Function} props.onOpenChange - Open state change handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const DropdownWeb = ({
  trigger,
  items = [],
  open: controlledOpen,
  onOpenChange,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const { open: internalOpen, toggle, close } = useDropdown({
    defaultOpen: false,
    onOpenChange,
  });
  const dropdownRef = useRef(null);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, close]);

  return (
    <StyledDropdown ref={dropdownRef} testID={testID} className={className} style={style} {...rest}>
      <StyledDropdownTrigger
        onPress={toggle}
        accessibilityRole="button"
        accessibilityExpanded={open}
        accessibilityLabel={accessibilityLabel || t('common.dropdownMenu')}
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

export default DropdownWeb;

