/**
 * Dropdown Component - iOS
 * Select menu, action menu
 * File: Dropdown.ios.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledDropdown,
  StyledDropdownTrigger,
  StyledDropdownMenu,
  StyledDropdownItem,
  StyledDropdownItemText,
  StyledDropdownSearchInput,
  StyledDropdownEmptyText,
} from './Dropdown.ios.styles';
import useDropdown from './useDropdown';

/**
 * Dropdown component for iOS
 * @param {Object} props - Dropdown props
 * @param {string|React.ReactNode} props.trigger - Trigger element/content
 * @param {Array<DropdownItem>} props.items - Dropdown items
 * @param {boolean} props.open - Controlled open state
 * @param {Function} props.onOpenChange - Open state change handler
 * @param {boolean} props.searchable - Whether to show a search field
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const DropdownIOS = ({
  trigger,
  items = [],
  open: controlledOpen,
  onOpenChange,
  searchable = true,
  searchPlaceholder,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const { open: internalOpen, toggle, close } = useDropdown({
    defaultOpen: false,
    onOpenChange,
  });
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const [searchQuery, setSearchQuery] = React.useState('');
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

  React.useEffect(() => {
    if (!open) setSearchQuery('');
  }, [open]);

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
          {searchable ? (
            <StyledDropdownSearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={finalSearchPlaceholder}
              accessibilityLabel={finalSearchPlaceholder}
              testID={testID ? `${testID}-search` : undefined}
            />
          ) : null}
          {visibleItems.length === 0 ? (
            <StyledDropdownEmptyText>{t('common.noResults')}</StyledDropdownEmptyText>
          ) : (
            visibleItems.map(({ item, index }) => (
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
                <StyledDropdownItemText>{item.label}</StyledDropdownItemText>
              </StyledDropdownItem>
            ))
          )}
        </StyledDropdownMenu>
      )}
    </StyledDropdown>
  );
};

export default DropdownIOS;
