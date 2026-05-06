/**
 * DatasetCaptureScreen Web styles
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledDatasetCaptureContainer',
  componentId: 'StyledDatasetCaptureContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureContent',
  componentId: 'StyledDatasetCaptureContent',
})`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledDatasetCaptureHeader',
  componentId: 'StyledDatasetCaptureHeader',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.lg}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSummaryGrid = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureSummaryGrid',
  componentId: 'StyledDatasetCaptureSummaryGrid',
})`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px 0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const StyledProgressSection = styled.nav.withConfig({
  displayName: 'StyledDatasetCaptureProgressSection',
  componentId: 'StyledDatasetCaptureProgressSection',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px 0 0;
`;

const StyledProgressHeader = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureProgressHeader',
  componentId: 'StyledDatasetCaptureProgressHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledProgressTrack = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureProgressTrack',
  componentId: 'StyledDatasetCaptureProgressTrack',
})`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledProgressFill = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureProgressFill',
  componentId: 'StyledDatasetCaptureProgressFill',
})`
  width: ${({ $percent }) => Math.max(0, Math.min(100, $percent || 0))}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const StyledStepList = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureStepList',
  componentId: 'StyledDatasetCaptureStepList',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStepItem = styled.button.withConfig({
  displayName: 'StyledDatasetCaptureStepItem',
  componentId: 'StyledDatasetCaptureStepItem',
})`
  min-height: 64px;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-content: start;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ $active, $complete, theme }) => {
    if ($active) return theme.colors.primary;
    if ($complete) return theme.colors.success;
    return theme.colors.background.tertiary;
  }};
  border-left-width: 3px;
  background-color: ${({ $active, theme }) => (
    $active ? theme.colors.background.secondary : theme.colors.background.primary
  )};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  &:disabled {
    cursor: default;
  }
`;

const StyledSummaryItem = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureSummaryItem',
  componentId: 'StyledDatasetCaptureSummaryItem',
})`
  min-height: 72px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-left: 3px solid ${({ $tone, theme }) => {
    if ($tone === 'success') return theme.colors.success;
    if ($tone === 'warning') return theme.colors.warning;
    if ($tone === 'error') return theme.colors.error;
    return theme.colors.primary;
  }};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  box-sizing: border-box;
`;

const StyledNotice = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureNotice',
  componentId: 'StyledDatasetCaptureNotice',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledDatasetCaptureSection',
  componentId: 'StyledDatasetCaptureSection',
})`
  padding: ${({ theme }) => theme.spacing.xl}px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSectionHeader = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureSectionHeader',
  componentId: 'StyledDatasetCaptureSectionHeader',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGrid = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureFieldGrid',
  componentId: 'StyledDatasetCaptureFieldGrid',
})`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFieldShell = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureFieldShell',
  componentId: 'StyledDatasetCaptureFieldShell',
})`
  min-width: 0;
  border-left: 3px solid ${({ $state, theme }) => (
    $state === 'missing' ? theme.colors.error : 'transparent'
  )};
  padding-left: ${({ $state, theme }) => ($state === 'missing' ? theme.spacing.sm : 0)}px;
`;

const StyledWideFieldShell = styled(StyledFieldShell).withConfig({
  displayName: 'StyledDatasetCaptureWideFieldShell',
  componentId: 'StyledDatasetCaptureWideFieldShell',
})`
  grid-column: span 3;

  @media (max-width: 980px) {
    grid-column: span 2;
  }

  @media (max-width: 640px) {
    grid-column: span 1;
  }
`;

const StyledMissingList = styled.ul.withConfig({
  displayName: 'StyledDatasetCaptureMissingList',
  componentId: 'StyledDatasetCaptureMissingList',
})`
  margin: ${({ theme }) => theme.spacing.sm}px 0 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActionBar = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureActionBar',
  componentId: 'StyledDatasetCaptureActionBar',
})`
  position: sticky;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledActionGroup = styled.div.withConfig({
  displayName: 'StyledDatasetCaptureActionGroup',
  componentId: 'StyledDatasetCaptureActionGroup',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
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
  StyledSection,
  StyledSectionHeader,
  StyledStepItem,
  StyledStepList,
  StyledSummaryGrid,
  StyledSummaryItem,
  StyledWideFieldShell,
};
