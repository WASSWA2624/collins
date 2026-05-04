/**
 * ListItem Component - Web
 * List item with actions, avatar, metadata
 * File: ListItem.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (direct import to avoid require cycle)
import Avatar from '@platform/components/display/Avatar';

// 4. Styles (relative import - platform-specific)
import {
  StyledListItem,
  StyledListItemContent,
  StyledListItemActions,
  StyledTitle,
  StyledSubtitle,
} from './ListItem.web.styles';

/**
 * ListItem component for Web
 * @param {Object} props - ListItem props
 * @param {React.ReactNode} props.children - List item content
 * @param {string|Object} props.avatar - Avatar source or props
 * @param {string} props.title - List item title
 * @param {string} props.subtitle - List item subtitle
 * @param {React.ReactNode} props.actions - Action buttons/components
 * @param {Function} props.onPress - Press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ListItemWeb = ({
  children,
  avatar,
  title,
  subtitle,
  actions,
  onPress,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const content = children || (
    <>
      {avatar && (
        <Avatar
          source={typeof avatar === 'string' ? avatar : avatar.source}
          name={typeof avatar === 'object' ? avatar.name : undefined}
          size="medium"
        />
      )}
      <StyledListItemContent>
        {title && <StyledTitle variant="body">{title}</StyledTitle>}
        {subtitle && <StyledSubtitle variant="caption">{subtitle}</StyledSubtitle>}
      </StyledListItemContent>
      {actions && <StyledListItemActions>{actions}</StyledListItemActions>}
    </>
  );

  return (
    <StyledListItem
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'listitem'}
      accessibilityLabel={accessibilityLabel || title}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {content}
    </StyledListItem>
  );
};

export default ListItemWeb;

