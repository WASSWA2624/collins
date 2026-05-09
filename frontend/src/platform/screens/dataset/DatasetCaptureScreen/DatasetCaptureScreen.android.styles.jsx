/**
 * DatasetCaptureScreen Native styles
 */
import styled from 'styled-components/native';
import { Pressable, ScrollView, View } from 'react-native';

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
  width: 100%;
  max-width: 960px;
  align-self: center;
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

const StyledProgressSection = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureProgressSection',
  componentId: 'StyledDatasetCaptureProgressSection',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px 0 0;
`;

const StyledProgressHeader = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureProgressHeader',
  componentId: 'StyledDatasetCaptureProgressHeader',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledProgressTrack = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureProgressTrack',
  componentId: 'StyledDatasetCaptureProgressTrack',
})`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

const StyledProgressFill = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureProgressFill',
  componentId: 'StyledDatasetCaptureProgressFill',
})`
  width: ${({ percent }) => Math.max(0, Math.min(100, percent || 0))}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const StyledStepList = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureStepList',
  componentId: 'StyledDatasetCaptureStepList',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStepScroll = styled(ScrollView).withConfig({
  displayName: 'StyledDatasetCaptureStepScroll',
  componentId: 'StyledDatasetCaptureStepScroll',
})``;

const StyledStepItem = styled(Pressable).withConfig({
  displayName: 'StyledDatasetCaptureStepItem',
  componentId: 'StyledDatasetCaptureStepItem',
})`
  min-height: 76px;
  width: 176px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-left-width: 3px;
  border-color: ${({ active, complete, status, theme }) => {
    if (active) return theme.colors.primary;
    if (status === 'invalid') return theme.colors.error;
    if (status === 'missing') return theme.colors.warning;
    if (complete) return theme.colors.success;
    return theme.colors.background.tertiary ?? theme.colors.background.secondary;
  }};
  background-color: ${({ active, theme }) => (
    active ? theme.colors.background.secondary : theme.colors.background.primary
  )};
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
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldShell = styled(View).withConfig({
  displayName: 'StyledDatasetCaptureFieldShell',
  componentId: 'StyledDatasetCaptureFieldShell',
})`
  width: ${({ columns }) => (columns > 1 ? '48%' : '100%')};
  min-width: 0;
  border-left-width: ${({ state }) => (state === 'missing' ? 3 : 0)}px;
  border-left-color: ${({ theme }) => theme.colors.error};
  padding-left: ${({ state, theme }) => (state === 'missing' ? theme.spacing.sm : 0)}px;
`;

const StyledWideFieldShell = styled(StyledFieldShell).withConfig({
  displayName: 'StyledDatasetCaptureWideFieldShell',
  componentId: 'StyledDatasetCaptureWideFieldShell',
})`
  width: 100%;
`;

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
  StyledProgressFill,
  StyledProgressHeader,
  StyledProgressSection,
  StyledProgressTrack,
  StyledScroll,
  StyledSection,
  StyledSectionHeader,
  StyledStepItem,
  StyledStepList,
  StyledStepScroll,
  StyledSummaryGrid,
  StyledSummaryItem,
  StyledWideFieldShell,
};
