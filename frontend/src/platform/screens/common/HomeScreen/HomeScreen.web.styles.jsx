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

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-sizing: border-box;
`;

const StyledShell = styled.div.withConfig({
  displayName: 'StyledShell',
  componentId: 'StyledShell',
})`
  width: 100%;
  max-width: 1120px;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  box-sizing: border-box;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.lg}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  @media (max-width: 560px) {
    align-items: flex-start;
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
`;

const StyledNoticeList = styled.section.withConfig({
  displayName: 'StyledNoticeList',
  componentId: 'StyledNoticeList',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledNoticeItem = styled.div.withConfig({
  displayName: 'StyledNoticeItem',
  componentId: 'StyledNoticeItem',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-left: 4px solid ${({ theme, $severity }) => toneColor(theme, $severity)};
  background-color: ${({ theme }) => theme.colors.background.secondary};
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
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin: 0 0 ${({ theme }) => theme.spacing.md}px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledFacilityList = styled.div.withConfig({
  displayName: 'StyledFacilityList',
  componentId: 'StyledFacilityList',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFacilityButton = styled.button.withConfig({
  displayName: 'StyledFacilityButton',
  componentId: 'StyledFacilityButton',
})`
  min-height: 48px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledStatusGrid = styled.section.withConfig({
  displayName: 'StyledStatusGrid',
  componentId: 'StyledStatusGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(176px, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledStatusItem = styled.article.withConfig({
  displayName: 'StyledStatusItem',
  componentId: 'StyledStatusItem',
})`
  min-height: 104px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-top: 4px solid ${({ theme, $tone }) => toneColor(theme, $tone)};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  box-sizing: border-box;
`;

const StyledStatusLabel = styled.div.withConfig({
  displayName: 'StyledStatusLabel',
  componentId: 'StyledStatusLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  text-transform: uppercase;
`;

const StyledStatusValue = styled.div.withConfig({
  displayName: 'StyledStatusValue',
  componentId: 'StyledStatusValue',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  overflow-wrap: anywhere;
`;

const StyledStatusDetail = styled.div.withConfig({
  displayName: 'StyledStatusDetail',
  componentId: 'StyledStatusDetail',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActionGrid = styled.div.withConfig({
  displayName: 'StyledActionGrid',
  componentId: 'StyledActionGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionItem = styled.a.withConfig({
  displayName: 'StyledActionItem',
  componentId: 'StyledActionItem',
})`
  position: relative;
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : theme.colors.background.tertiary)};
  border-left-width: ${({ $emphasis }) => ($emphasis === 'primary' ? 4 : 1)}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
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
          background-color: ${theme.colors.background.primary};
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
          transform: translateY(-2px);
        }

        &:active {
          opacity: 1;
          background-color: ${theme.colors.background.secondary};
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

const StyledActionBody = styled.div.withConfig({
  displayName: 'StyledActionBody',
  componentId: 'StyledActionBody',
})`
  min-width: 0;
`;

const StyledActionTitle = styled.div.withConfig({
  displayName: 'StyledActionTitle',
  componentId: 'StyledActionTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledActionMeta = styled.div.withConfig({
  displayName: 'StyledActionMeta',
  componentId: 'StyledActionMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

export {
  StyledActionBody,
  StyledActionGrid,
  StyledActionItem,
  StyledActionMeta,
  StyledActionTitle,
  StyledContainer,
  StyledFacilityButton,
  StyledFacilityList,
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
  StyledStatusItem,
  StyledStatusLabel,
  StyledStatusValue,
};
