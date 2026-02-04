/**
 * TopicDetailScreen Web Styles
 * File: TopicDetailScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
  box-sizing: border-box;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTopicTitle = styled.h1.withConfig({
  displayName: 'StyledTopicTitle',
  componentId: 'StyledTopicTitle',
})`
  margin: 0 0 ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography?.fontSize?.xl ?? 24}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSectionHeader = styled.button.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'StyledSectionHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  &:hover, &:focus {
    text-decoration: underline;
  }
`;

const StyledSectionContent = styled.div.withConfig({
  displayName: 'StyledSectionContent',
  componentId: 'StyledSectionContent',
})`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

const StyledChecklistItem = styled.li.withConfig({
  displayName: 'StyledChecklistItem',
  componentId: 'StyledChecklistItem',
})`
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  list-style: disc;
  margin-left: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledErrorBanner = styled.div.withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.error?.background ?? '#FFEBEE'};
  color: ${({ theme }) => theme.colors.status?.error?.text ?? '#C62828'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

export {
  StyledContainer,
  StyledErrorBanner,
  StyledHeader,
  StyledSection,
  StyledSectionContent,
  StyledSectionHeader,
  StyledTopicTitle,
  StyledChecklistItem,
};

