/**
 * SystemBanner Web Styles
 * Styled-components for Web platform
 * File: SystemBanner.web.styles.jsx
 */
import styled from 'styled-components';
import { BANNER_VARIANTS } from '@utils/shellBanners';

const getVariantColors = (variant, theme) => {
  if (variant === BANNER_VARIANTS.MAINTENANCE) {
    return {
      background: theme.colors.status.error.background,
      text: theme.colors.status.error.text,
      border: theme.colors.error,
    };
  }
  if (variant === BANNER_VARIANTS.LOW_QUALITY) {
    return {
      background: theme.colors.status.warning.background,
      text: theme.colors.status.warning.text,
      border: theme.colors.warning,
    };
  }
  if (variant === BANNER_VARIANTS.OFFLINE) {
    return {
      background: theme.colors.status.warning.background,
      text: theme.colors.status.warning.text,
      border: theme.colors.warning,
    };
  }
  if (variant === BANNER_VARIANTS.ONLINE) {
    return {
      background: theme.colors.success,
      text: theme.colors.onPrimary || theme.colors.text.inverse,
      border: theme.colors.success,
    };
  }
  return {
    background: theme.colors.primary,
    text: theme.colors.onPrimary || theme.colors.text.inverse,
    border: theme.colors.primary,
  };
};

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
  border: 1px solid ${({ variant, theme }) => getVariantColors(variant, theme).border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ variant, theme }) => getVariantColors(variant, theme).background};
  color: ${({ variant, theme }) => getVariantColors(variant, theme).text};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  min-height: ${({ theme }) => theme.spacing.xl + theme.spacing.sm}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 2px 6px rgba(0, 0, 0, 0.08)'};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex: 1;
  min-width: 0;
`;

const StyledTitle = styled.div.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.mediumWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const StyledMessage = styled.div.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActionButton = styled.button.withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mediumWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  cursor: pointer;
  min-height: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledDismissButton = styled.button.withConfig({
  displayName: 'StyledDismissButton',
  componentId: 'StyledDismissButton',
})`
  background: transparent;
  border: none;
  color: inherit;
  font-family: ${({ theme }) => theme.typography.fontFamily.mediumWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  cursor: pointer;
  min-height: ${({ theme }) => theme.spacing.xl}px;
`;

export {
  StyledActions,
  StyledActionButton,
  StyledBanner,
  StyledContent,
  StyledDismissButton,
  StyledMessage,
  StyledTitle,
};

