/**
 * HomeScreen Web Styles
 * File: HomeScreen.web.styles.jsx
 */
import styled from 'styled-components';

const toneColor = (theme, tone) => {
  if (tone === 'error') return theme.colors.error;
  if (tone === 'warning') return theme.colors.warning;
  if (tone === 'success') return theme.colors.success;
  return theme.colors.primary;
};

const pageBackground = (theme) => {
  if (theme.mode === 'dark' || theme.mode === 'high-contrast') return theme.colors.background.primary;
  return '#F8FAFC';
};

const surfaceColor = (theme) => {
  if (theme.mode === 'dark') return theme.colors.background.secondary;
  return theme.colors.background.primary;
};

const softSurfaceColor = (theme) => {
  if (theme.mode === 'dark') return theme.colors.background.tertiary;
  if (theme.mode === 'high-contrast') return theme.colors.background.primary;
  return '#F8FAFC';
};

const selectedSurfaceColor = (theme) => {
  if (theme.mode === 'dark') return 'rgba(0, 122, 255, 0.18)';
  if (theme.mode === 'high-contrast') return theme.colors.background.primary;
  return '#EAF3FF';
};

const toneSurfaceColor = (theme, tone) => {
  if (tone === 'error') return theme.colors.status.error.background;
  if (tone === 'warning') return theme.colors.status.warning.background;
  if (tone === 'success') return theme.colors.status.success.background;
  return selectedSurfaceColor(theme);
};

const softShadow = (theme) => {
  if (theme.mode === 'dark' || theme.mode === 'high-contrast') return 'none';
  return '0 10px 24px rgba(15, 23, 42, 0.07)';
};

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => pageBackground(theme)};
  box-sizing: border-box;
`;

const StyledShell = styled.div.withConfig({
  displayName: 'StyledShell',
  componentId: 'StyledShell',
})`
  width: 100%;
  max-width: 1180px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.xl}px;
  box-sizing: border-box;

  @media (max-width: 560px) {
    gap: ${({ theme }) => theme.spacing.md}px;
    padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  }
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
  box-shadow: ${({ theme }) => softShadow(theme)};

  @media (max-width: 560px) {
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm}px;
  }
`;

const StyledLogoArea = styled.div.withConfig({
  displayName: 'StyledLogoArea',
  componentId: 'StyledLogoArea',
})`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledHeaderCopy = styled.div.withConfig({
  displayName: 'StyledHeaderCopy',
  componentId: 'StyledHeaderCopy',
})`
  min-width: 0;
`;

const StyledMessage = styled.p.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  margin: ${({ theme }) => theme.spacing.xs}px 0 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: 1.5;
  max-width: 680px;
`;

const StyledNoticeList = styled.section.withConfig({
  displayName: 'StyledNoticeList',
  componentId: 'StyledNoticeList',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNoticeItem = styled.div.withConfig({
  displayName: 'StyledNoticeItem',
  componentId: 'StyledNoticeItem',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-left: 4px solid ${({ theme, $severity }) => toneColor(theme, $severity)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
`;

const StyledNoticeMessage = styled.p.withConfig({
  displayName: 'StyledNoticeMessage',
  componentId: 'StyledNoticeMessage',
})`
  flex: 1;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: 1.4;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  min-width: 0;
`;

const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin: 0 0 ${({ theme }) => theme.spacing.sm}px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.3;
`;

const StyledFacilityPanel = styled.section.withConfig({
  displayName: 'StyledFacilityPanel',
  componentId: 'StyledFacilityPanel',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
  box-shadow: ${({ theme }) => softShadow(theme)};
`;

const StyledFacilityHeader = styled.div.withConfig({
  displayName: 'StyledFacilityHeader',
  componentId: 'StyledFacilityHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFacilitySelectWrap = styled.div.withConfig({
  displayName: 'StyledFacilitySelectWrap',
  componentId: 'StyledFacilitySelectWrap',
})`
  width: 100%;
`;

const StyledFacilitySummary = styled.p.withConfig({
  displayName: 'StyledFacilitySummary',
  componentId: 'StyledFacilitySummary',
})`
  margin: ${({ theme }) => theme.spacing.xs}px 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

const StyledDashboardGrid = styled.div.withConfig({
  displayName: 'StyledDashboardGrid',
  componentId: 'StyledDashboardGrid',
})`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: ${({ theme }) => theme.spacing.lg}px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StyledStatusGrid = styled.section.withConfig({
  displayName: 'StyledStatusGrid',
  componentId: 'StyledStatusGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const StyledStatusItem = styled.article.withConfig({
  displayName: 'StyledStatusItem',
  componentId: 'StyledStatusItem',
})`
  min-height: 88px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-left: 3px solid ${({ theme, $tone }) => toneColor(theme, $tone)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
  box-sizing: border-box;
`;

const StyledStatusHeader = styled.div.withConfig({
  displayName: 'StyledStatusHeader',
  componentId: 'StyledStatusHeader',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledStatusIcon = styled.span.withConfig({
  displayName: 'StyledStatusIcon',
  componentId: 'StyledStatusIcon',
})`
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme, $tone }) => toneColor(theme, $tone)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $tone }) => toneSurfaceColor(theme, $tone)};
  color: ${({ theme, $tone }) => toneColor(theme, $tone)};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const StyledStatusLabel = styled.div.withConfig({
  displayName: 'StyledStatusLabel',
  componentId: 'StyledStatusLabel',
})`
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  line-height: 1.25;
`;

const StyledStatusValue = styled.div.withConfig({
  displayName: 'StyledStatusValue',
  componentId: 'StyledStatusValue',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  overflow-wrap: anywhere;
  line-height: 1.25;
`;

const StyledStatusDetail = styled.div.withConfig({
  displayName: 'StyledStatusDetail',
  componentId: 'StyledStatusDetail',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: 1.35;
`;

const StyledActionGrid = styled.div.withConfig({
  displayName: 'StyledActionGrid',
  componentId: 'StyledActionGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (min-width: 901px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const StyledActionItem = styled.a.withConfig({
  displayName: 'StyledActionItem',
  componentId: 'StyledActionItem',
})`
  position: relative;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : theme.colors.background.tertiary)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? selectedSurfaceColor(theme) : surfaceColor(theme))};
  color: inherit;
  text-decoration: none;
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.58)};
  pointer-events: ${({ $enabled }) => ($enabled ? 'auto' : 'none')};
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
  box-sizing: border-box;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  transition:
    background-color ${({ theme }) => theme.animations.duration.fast}ms ${({ theme }) => theme.animations.easing.easeOut},
    border-color ${({ theme }) => theme.animations.duration.fast}ms ${({ theme }) => theme.animations.easing.easeOut},
    box-shadow ${({ theme }) => theme.animations.duration.fast}ms ${({ theme }) => theme.animations.easing.easeOut},
    transform ${({ theme }) => theme.animations.duration.fast}ms ${({ theme }) => theme.animations.easing.easeOut};

  &:visited,
  &:hover,
  &:active {
    color: inherit;
    text-decoration: none;
  }

  ${({ $enabled, theme }) =>
    $enabled
      ? `
        &:hover {
          border-color: ${theme.colors.primary};
          background-color: ${selectedSurfaceColor(theme)};
          box-shadow: ${theme.mode === 'dark' || theme.mode === 'high-contrast' ? 'none' : '0 8px 18px rgba(15, 23, 42, 0.10)'};
          transform: translateY(-1px);
        }

        &:active {
          opacity: 1;
          background-color: ${surfaceColor(theme)};
          box-shadow: 0 3px 8px rgba(15, 23, 42, 0.10);
          transform: translateY(0);
        }
      `
      : ''}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StyledActionIcon = styled.span.withConfig({
  displayName: 'StyledActionIcon',
  componentId: 'StyledActionIcon',
})`
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : theme.colors.background.tertiary)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : softSurfaceColor(theme))};
  color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.onPrimary : theme.colors.text.secondary)};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.72)};
`;

const StyledActionBody = styled.div.withConfig({
  displayName: 'StyledActionBody',
  componentId: 'StyledActionBody',
})`
  min-width: 0;
  flex: 1;
`;

const StyledActionTitle = styled.div.withConfig({
  displayName: 'StyledActionTitle',
  componentId: 'StyledActionTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

const StyledActionMeta = styled.div.withConfig({
  displayName: 'StyledActionMeta',
  componentId: 'StyledActionMeta',
})`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: 1.35;
`;

export {
  StyledActionBody,
  StyledActionGrid,
  StyledActionIcon,
  StyledActionItem,
  StyledActionMeta,
  StyledActionTitle,
  StyledContainer,
  StyledDashboardGrid,
  StyledFacilityHeader,
  StyledFacilityPanel,
  StyledFacilitySelectWrap,
  StyledFacilitySummary,
  StyledHeader,
  StyledHeaderCopy,
  StyledLogoArea,
  StyledMessage,
  StyledNoticeItem,
  StyledNoticeList,
  StyledNoticeMessage,
  StyledSection,
  StyledSectionTitle,
  StyledShell,
  StyledStatusDetail,
  StyledStatusGrid,
  StyledStatusHeader,
  StyledStatusIcon,
  StyledStatusItem,
  StyledStatusLabel,
  StyledStatusValue,
};
