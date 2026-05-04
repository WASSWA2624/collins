/**
 * ListItem iOS Styles
 * Styled-components for iOS platform
 * File: ListItem.ios.styles.jsx
 */
import styled from 'styled-components/native';
import Text from '@platform/components/display/Text';

const StyledListItem = styled.Pressable.withConfig({
  displayName: 'StyledListItem',
})`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledListItemContent = styled.View.withConfig({
  displayName: 'StyledListItemContent',
})`
  flex: 1;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const StyledListItemActions = styled.View.withConfig({
  displayName: 'StyledListItemActions',
})`
  flex-direction: row;
  align-items: center;
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

export {
  StyledListItem,
  StyledListItemContent,
  StyledListItemActions,
  StyledTitle,
  StyledSubtitle,
};


