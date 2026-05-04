/**
 * Breadcrumbs iOS Styles
 * Styled-components for iOS platform
 * File: Breadcrumbs.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Text, Pressable } from 'react-native';

const StyledBreadcrumbs = styled(View).withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledBreadcrumbItem = styled(Text).withConfig({
  displayName: 'StyledBreadcrumbItem',
  componentId: 'StyledBreadcrumbItem',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ isLast }) => (isLast ? 600 : 400)};
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
  color: ${({ isLast, theme }) => (isLast ? theme.colors.text.primary : theme.colors.text.secondary)};
`;

const StyledSeparator = styled(Text).withConfig({
  displayName: 'StyledSeparator',
  componentId: 'StyledSeparator',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-horizontal: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledLink = styled(Pressable).withConfig({
  displayName: 'StyledLink',
  componentId: 'StyledLink',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: 400;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export {
  StyledBreadcrumbs,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledLink,
};
