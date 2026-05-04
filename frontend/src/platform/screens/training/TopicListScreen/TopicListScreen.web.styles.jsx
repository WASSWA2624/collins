/**
 * TopicListScreen Web Styles
 * File: TopicListScreen.web.styles.jsx
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

const StyledSearchWrap = styled.div.withConfig({
  displayName: 'StyledSearchWrap',
  componentId: 'StyledSearchWrap',
})`
  max-width: 400px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledItem = styled.li.withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const StyledItemLink = styled.a.withConfig({
  displayName: 'StyledItemLink',
  componentId: 'StyledItemLink',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  cursor: pointer;
  display: block;
  &:hover, &:focus {
    text-decoration: underline;
  }
`;

const StyledEmpty = styled.div.withConfig({
  displayName: 'StyledEmpty',
  componentId: 'StyledEmpty',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
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
  StyledEmpty,
  StyledErrorBanner,
  StyledItem,
  StyledItemLink,
  StyledList,
  StyledPageHeader,
  StyledPageTitle,
  StyledSearchWrap,
};

