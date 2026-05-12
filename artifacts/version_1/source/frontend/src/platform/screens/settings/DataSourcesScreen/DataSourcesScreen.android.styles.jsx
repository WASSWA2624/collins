/**
 * DataSourcesScreen Android Styles
 * File: DataSourcesScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledMetaRow = styled(View).withConfig({
  displayName: 'StyledMetaRow',
  componentId: 'StyledMetaRow',
})`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
`;

const StyledSourceItem = styled(View).withConfig({
  displayName: 'StyledSourceItem',
  componentId: 'StyledSourceItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

const StyledCaptureGrid = styled(View).withConfig({
  displayName: 'StyledCaptureGrid',
  componentId: 'StyledCaptureGrid',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldShell = styled(View).withConfig({
  displayName: 'StyledFieldShell',
  componentId: 'StyledFieldShell',
})`
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left-width: 3px;
  border-left-color: ${({ state, theme }) => {
    if (state === 'missing') return theme.colors.error;
    if (state === 'uncertain') return theme.colors.warning;
    return theme.colors.background.tertiary ?? theme.colors.background.secondary;
  }};
`;

const StyledInlineNotice = styled(View).withConfig({
  displayName: 'StyledInlineNotice',
  componentId: 'StyledInlineNotice',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActionRow = styled(View).withConfig({
  displayName: 'StyledActionRow',
  componentId: 'StyledActionRow',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledActionRow,
  StyledCaptureGrid,
  StyledContainer,
  StyledContent,
  StyledContentWrap,
  StyledFieldShell,
  StyledInlineNotice,
  StyledList,
  StyledMetaRow,
  StyledSection,
  StyledSourceItem,
};
