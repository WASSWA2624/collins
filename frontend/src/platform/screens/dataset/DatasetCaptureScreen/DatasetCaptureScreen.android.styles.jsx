/**
 * DatasetCaptureScreen Native styles
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureContainer',
  componentId: 'StyledDatasetCaptureContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledScroll = styled(ScrollView).withConfig({
  displayName: 'StyledDatasetCaptureScroll',
  componentId: 'StyledDatasetCaptureScroll',
})`
  flex: 1;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureContent',
  componentId: 'StyledDatasetCaptureContent',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureHeader',
  componentId: 'StyledDatasetCaptureHeader',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

const StyledSummaryGrid = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureSummaryGrid',
  componentId: 'StyledDatasetCaptureSummaryGrid',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px 0;
`;

const StyledSummaryItem = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureSummaryItem',
  componentId: 'StyledDatasetCaptureSummaryItem',
})`
  min-height: 72px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-left-width: 3px;
  border-left-color: ${({ tone, theme }) => {
    if (tone === 'success') return theme.colors.success;
    if (tone === 'warning') return theme.colors.warning;
    if (tone === 'error') return theme.colors.error;
    return theme.colors.primary;
  }};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledNotice = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureNotice',
  componentId: 'StyledDatasetCaptureNotice',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureSection',
  componentId: 'StyledDatasetCaptureSection',
})`
  padding: ${({ theme }) => theme.spacing.lg}px 0;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

const StyledSectionHeader = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureSectionHeader',
  componentId: 'StyledDatasetCaptureSectionHeader',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGrid = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureFieldGrid',
  componentId: 'StyledDatasetCaptureFieldGrid',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldShell = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureFieldShell',
  componentId: 'StyledDatasetCaptureFieldShell',
})`
  border-left-width: ${({ state }) => (state === 'missing' ? 3 : 0)}px;
  border-left-color: ${({ theme }) => theme.colors.error};
  padding-left: ${({ state, theme }) => (state === 'missing' ? theme.spacing.sm : 0)}px;
`;

const StyledWideFieldShell = StyledFieldShell;

const StyledMissingList = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureMissingList',
  componentId: 'StyledDatasetCaptureMissingList',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActionBar = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureActionBar',
  componentId: 'StyledDatasetCaptureActionBar',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

const StyledActionGroup = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureActionGroup',
  componentId: 'StyledDatasetCaptureActionGroup',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledActionBar,
  StyledActionGroup,
  StyledContainer,
  StyledContent,
  StyledFieldGrid,
  StyledFieldShell,
  StyledHeader,
  StyledMissingList,
  StyledNotice,
  StyledScroll,
  StyledSection,
  StyledSectionHeader,
  StyledSummaryGrid,
  StyledSummaryItem,
  StyledWideFieldShell,
};
