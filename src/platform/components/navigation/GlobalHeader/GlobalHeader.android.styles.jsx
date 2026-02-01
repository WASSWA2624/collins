/**
 * GlobalHeader Component Styles - Android
 * Styled-components for GlobalHeader Android implementation
 * File: GlobalHeader.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable } from 'react-native';

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme, topInset }) => theme.spacing.md + (topInset || 0)}px;
  elevation: 3;
`;

const StyledHeaderRow = styled(View).withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'StyledHeaderRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledLeadingSlot = styled(View).withConfig({
  displayName: 'StyledLeadingSlot',
  componentId: 'StyledLeadingSlot',
})`
  flex-direction: row;
  align-items: center;
`;

const StyledTitleGroup = styled(View).withConfig({
  displayName: 'StyledTitleGroup',
  componentId: 'StyledTitleGroup',
})`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTitleBlock = styled(View).withConfig({
  displayName: 'StyledTitleBlock',
  componentId: 'StyledTitleBlock',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActionsGroup = styled(View).withConfig({
  displayName: 'StyledActionsGroup',
  componentId: 'StyledActionsGroup',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledUtilityGroup = styled(View).withConfig({
  displayName: 'StyledUtilityGroup',
  componentId: 'StyledUtilityGroup',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const StyledActionButton = styled(Pressable).withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: 0;
  min-height: 44px;
  min-width: 44px;
  border-radius: ${({ theme, isCircular }) =>
    isCircular ? theme.radius.full : theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme, isPrimary }) =>
    isPrimary ? theme.colors.primary : theme.colors.background.tertiary};
  background-color: ${({ theme, isPrimary }) =>
    isPrimary ? theme.colors.primary : theme.colors.background.secondary};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
`;

const StyledActionIcon = styled(View).withConfig({
  displayName: 'StyledActionIcon',
  componentId: 'StyledActionIcon',
})`
  align-items: center;
  justify-content: center;
`;

const StyledBreadcrumbsRow = styled(View).withConfig({
  displayName: 'StyledBreadcrumbsRow',
  componentId: 'StyledBreadcrumbsRow',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledHeader,
  StyledHeaderRow,
  StyledLeadingSlot,
  StyledTitleGroup,
  StyledTitleBlock,
  StyledActionsGroup,
  StyledUtilityGroup,
  StyledActionButton,
  StyledActionIcon,
  StyledBreadcrumbsRow,
};
