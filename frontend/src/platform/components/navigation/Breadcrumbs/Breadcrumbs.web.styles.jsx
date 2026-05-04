/**
 * Breadcrumbs Web Styles
 * Styled-components for Web platform
 * File: Breadcrumbs.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Text, Pressable } from 'react-native';

const StyledBreadcrumbs = styled(View).withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  min-height: ${({ theme }) => theme.spacing.xxl}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
    gap: ${({ theme }) => theme.spacing.xs / 2}px;
  }
`;

const StyledBreadcrumbItem = styled(View).withConfig({
  displayName: 'StyledBreadcrumbItem',
  componentId: 'StyledBreadcrumbItem',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  white-space: nowrap;
  max-width: 200px;
  min-width: 0;

  & > *:last-child {
    font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
    font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
    font-weight: ${({ isLast }) => (isLast ? 600 : 400)};
    line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
    color: ${({ isLast, theme }) => (isLast ? theme.colors.text.primary : theme.colors.text.secondary)};
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    max-width: 120px;

    & > *:last-child {
      font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    }
  }
`;

const StyledSeparator = styled(Text).withConfig({
  displayName: 'StyledSeparator',
  componentId: 'StyledSeparator',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    margin: 0 ${({ theme }) => theme.spacing.xs / 2}px;
  }
`;

const StyledLink = styled(Pressable).withConfig({
  displayName: 'StyledLink',
  componentId: 'StyledLink',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs / 2}px ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  transition: background-color 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  max-width: 200px;
  min-width: 0;

  & > *:last-child {
    font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
    font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
    font-weight: 400;
    line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    max-width: 120px;
    padding: ${({ theme }) => theme.spacing.xs / 2}px;

    & > *:last-child {
      font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const StyledBreadcrumbIcon = styled(View).withConfig({
  displayName: 'StyledBreadcrumbIcon',
  componentId: 'StyledBreadcrumbIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.7;
`;

const StyledBreadcrumbEllipsis = styled(Text).withConfig({
  displayName: 'StyledBreadcrumbEllipsis',
  componentId: 'StyledBreadcrumbEllipsis',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  user-select: none;
  padding: 0 ${({ theme }) => theme.spacing.xs}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    padding: 0 ${({ theme }) => theme.spacing.xs / 2}px;
  }
`;

export {
  StyledBreadcrumbs,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledLink,
  StyledBreadcrumbIcon,
  StyledBreadcrumbEllipsis,
};

