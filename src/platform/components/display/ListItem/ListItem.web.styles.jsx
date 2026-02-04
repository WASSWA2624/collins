/**
 * ListItem Web Styles
 * Styled-components for Web platform
 * File: ListItem.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Pressable } from 'react-native';
import Text from '@platform/components/display/Text';

const StyledListItem = styled(Pressable).withConfig({
  displayName: 'StyledListItem',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:hover {
    ${({ disabled, theme }) => {
      if (disabled) return '';
      return `background-color: ${theme.colors.background.secondary};`;
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }

  &:last-child {
    border-bottom-width: 0;
  }
`;

const StyledListItemContent = styled(View).withConfig({
  displayName: 'StyledListItemContent',
})`
  flex: 1;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTitle = styled(Text).withConfig({
  displayName: 'StyledTitle',
})`
  font-weight: 600;
`;

const StyledSubtitle = styled(Text).withConfig({
  displayName: 'StyledSubtitle',
})`
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledListItemActions = styled(View).withConfig({
  displayName: 'StyledListItemActions',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledListItem,
  StyledListItemContent,
  StyledListItemActions,
  StyledTitle,
  StyledSubtitle,
};



