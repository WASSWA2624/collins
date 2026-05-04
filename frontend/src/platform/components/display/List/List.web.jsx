/**
 * List Component - Web
 * Virtualized list container
 * File: List.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledList } from './List.web.styles';

/**
 * List component for Web
 * @param {Object} props - List props
 * @param {React.ReactNode} props.children - List items
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ListWeb = ({
  children,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();

  return (
    <StyledList
      accessibilityRole="list"
      accessibilityLabel={accessibilityLabel || t('common.list')}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </StyledList>
  );
};

export default ListWeb;

