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
import {
  StyledDropdown,
  StyledDropdownTrigger,
  StyledDropdownMenu,
  StyledDropdownItem,
  StyledDropdownItemText,
  StyledDropdownSearchInput,
  StyledDropdownEmptyText,
} from './Dropdown.web.styles';

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
 * @param {boolean} props.searchable - Whether to show a search field
 * @param {string} props.searchPlaceholder - Search input placeholder
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
  searchable = true,
  searchPlaceholder,
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const finalSearchPlaceholder = searchPlaceholder || t('common.searchPlaceholder');
  const visibleItems = React.useMemo(() => {
    const rows = items.map((item, index) => ({ item, index }));
    const query = String(searchQuery || '').trim().toLowerCase();
    if (!searchable || !query) return rows;
    return rows.filter(({ item }) =>
      [item.label, item.value]
        .some((entry) => String(entry || '').toLowerCase().includes(query))
    );
  }, [items, searchable, searchQuery]);

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

  useEffect(() => {
    if (!open) setSearchQuery('');
  }, [open]);

  return (
    <StyledDropdown ref={dropdownRef} data-testid={testID} className={className} style={style} {...rest}>
      <StyledDropdownTrigger
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={accessibilityLabel || t('common.dropdownMenu')}
        data-testid={testID ? `${testID}-trigger` : undefined}
      >
        {trigger}
      </StyledDropdownTrigger>
      {open && (
        <StyledDropdownMenu data-testid={testID ? `${testID}-menu` : undefined}>
          {searchable ? (
            <StyledDropdownSearchInput
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => event.stopPropagation()}
              placeholder={finalSearchPlaceholder}
              aria-label={finalSearchPlaceholder}
              data-testid={testID ? `${testID}-search` : undefined}
              autoFocus
            />
          ) : null}
          {visibleItems.length === 0 ? (
            <StyledDropdownEmptyText>{t('common.noResults')}</StyledDropdownEmptyText>
          ) : (
            visibleItems.map(({ item, index }) => (
              <StyledDropdownItem
                key={item.value || index}
                type="button"
                onClick={() => {
                  if (!item.disabled && item.onPress) {
                    item.onPress(item.value);
                    close();
                  }
                }}
                disabled={item.disabled}
                role="menuitem"
                aria-label={item.label}
                data-testid={testID ? `${testID}-item-${index}` : undefined}
              >
                <StyledDropdownItemText>{item.label}</StyledDropdownItemText>
              </StyledDropdownItem>
            ))
          )}
        </StyledDropdownMenu>
      )}
    </StyledDropdown>
  );
};

export default DropdownWeb;

