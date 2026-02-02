/**
 * TrainingHomeScreen Web Styles
 * File: TrainingHomeScreen.web.styles.jsx
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
  gap: ${({ theme }) => theme.spacing.xl}px;
  box-sizing: border-box;
`;

const StyledPageHeader = styled.header.withConfig({
  displayName: 'StyledPageHeader',
  componentId: 'StyledPageHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPageTitle = styled.h1.withConfig({
  displayName: 'StyledPageTitle',
  componentId: 'StyledPageTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme.typography?.fontSize?.xl ?? 24}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSubtitle = styled.p.withConfig({
  displayName: 'StyledSubtitle',
  componentId: 'StyledSubtitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSearchWrap = styled.div.withConfig({
  displayName: 'StyledSearchWrap',
  componentId: 'StyledSearchWrap',
})`
  max-width: 360px;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledTopicList = styled.ul.withConfig({
  displayName: 'StyledTopicList',
  componentId: 'StyledTopicList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTopicLink = styled.a.withConfig({
  displayName: 'StyledTopicLink',
  componentId: 'StyledTopicLink',
})`
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.text.tertiary};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
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
  StyledPageHeader,
  StyledPageTitle,
  StyledSubtitle,
  StyledSearchWrap,
  StyledSection,
  StyledSectionTitle,
  StyledTopicLink,
  StyledTopicList,
};
