/**
 * Fallback UI Styles
 * Theme-driven styled-components for the ErrorBoundary fallback UI.
 * File: fallback.ui.styles.jsx
 */
import styled from 'styled-components/native';
import { Pressable, Text, View } from 'react-native';
import lightTheme from '@theme/light.theme';

const fallbackTheme = lightTheme;

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme?.spacing?.lg ?? fallbackTheme.spacing.lg)}px;
  background-color: ${({ theme }) =>
    theme?.colors?.background?.primary ?? fallbackTheme.colors.background.primary};
`;

const StyledTitle = styled(Text).withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-size: ${({ theme }) => (theme?.typography?.fontSize?.xl ?? fallbackTheme.typography.fontSize.xl)}px;
  color: ${({ theme }) => theme?.colors?.text?.primary ?? fallbackTheme.colors.text.primary};
  margin-bottom: ${({ theme }) => (theme?.spacing?.sm ?? fallbackTheme.spacing.sm)}px;
  text-align: center;
  font-weight: ${({ theme }) =>
    theme?.typography?.fontWeight?.semibold ?? fallbackTheme.typography.fontWeight.semibold};
`;

const StyledMessage = styled(Text).withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  font-size: ${({ theme }) => (theme?.typography?.fontSize?.sm ?? fallbackTheme.typography.fontSize.sm)}px;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? fallbackTheme.colors.text.secondary};
  margin-bottom: ${({ theme }) => (theme?.spacing?.md ?? fallbackTheme.spacing.md)}px;
  text-align: center;
`;

const StyledRetryButton = styled(Pressable).withConfig({
  displayName: 'StyledRetryButton',
  componentId: 'StyledRetryButton',
})`
  background-color: ${({ theme }) => theme?.colors?.primary ?? fallbackTheme.colors.primary};
  padding: ${({ theme }) =>
    `${theme?.spacing?.sm ?? fallbackTheme.spacing.sm}px ${theme?.spacing?.lg ?? fallbackTheme.spacing.lg}px`};
  border-radius: ${({ theme }) => (theme?.radius?.md ?? fallbackTheme.radius.md)}px;
  min-height: 44px;
  min-width: 44px;
  align-items: center;
  justify-content: center;
`;

const StyledRetryText = styled(Text).withConfig({
  displayName: 'StyledRetryText',
  componentId: 'StyledRetryText',
})`
  color: ${({ theme }) => theme?.colors?.onPrimary ?? fallbackTheme.colors.onPrimary};
  font-size: ${({ theme }) => (theme?.typography?.fontSize?.md ?? fallbackTheme.typography.fontSize.md)}px;
  font-weight: ${({ theme }) =>
    theme?.typography?.fontWeight?.medium ?? fallbackTheme.typography.fontWeight.medium};
`;

export {
  StyledContainer,
  StyledTitle,
  StyledMessage,
  StyledRetryButton,
  StyledRetryText,
};

