/**
 * GlobalFooter Component Styles - Web
 * Minimal compact footer styles
 * File: GlobalFooter.web.styles.jsx
 */
import styled from 'styled-components';

const FOOTER_HEIGHT_PX = 40;

const StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  flex-shrink: 0;
  height: ${FOOTER_HEIGHT_PX}px;
  min-height: ${FOOTER_HEIGHT_PX}px;
  max-height: ${FOOTER_HEIGHT_PX}px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: 0 ${({ theme }) => theme.spacing.sm}px;
  box-sizing: border-box;
  overflow: hidden;
`;

const StyledFooterRow = styled.div.withConfig({
  displayName: 'StyledFooterRow',
  componentId: 'StyledFooterRow',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  /* Fixed-height footer: keep single line, no wrapping. */
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledFooterBrand = styled.span.withConfig({
  displayName: 'StyledFooterBrand',
  componentId: 'StyledFooterBrand',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledFooterAppName = styled.span.withConfig({
  displayName: 'StyledFooterAppName',
  componentId: 'StyledFooterAppName',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledFooterLogo = styled.span.withConfig({
  displayName: 'StyledFooterLogo',
  componentId: 'StyledFooterLogo',
})`
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.bold ?? 600};
  font-size: 10px;
  flex-shrink: 0;
  letter-spacing: -0.3px;
  text-transform: uppercase;
`;

const StyledFooterCopyright = styled.span.withConfig({
  displayName: 'StyledFooterCopyright',
  componentId: 'StyledFooterCopyright',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledFooterSeparator = styled.span.withConfig({
  displayName: 'StyledFooterSeparator',
  componentId: 'StyledFooterSeparator',
})`
  color: ${({ theme }) => theme.colors.text.tertiary};
  user-select: none;
`;

const StyledFooterLink = styled.a.withConfig({
  displayName: 'StyledFooterLink',
  componentId: 'StyledFooterLink',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

/* Legacy exports for Auth/Patient variants if needed */
const StyledFooterContent = styled.div.withConfig({
  displayName: 'StyledFooterContent',
  componentId: 'StyledFooterContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const StyledStatusGroup = styled.div.withConfig({
  displayName: 'StyledStatusGroup',
  componentId: 'StyledStatusGroup',
})`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatusBadge = styled.div.withConfig({
  displayName: 'StyledStatusBadge',
  componentId: 'StyledStatusBadge',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, tone }) => {
    if (tone === 'success') return theme.colors.success;
    if (tone === 'warning') return theme.colors.warning;
    if (tone === 'error') return theme.colors.error;
    return theme.colors.background.tertiary;
  }};
`;

const StyledEnvironmentInfo = styled.span.withConfig({
  displayName: 'StyledEnvironmentInfo',
  componentId: 'StyledEnvironmentInfo',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledLegalLinks = styled.div.withConfig({
  displayName: 'StyledLegalLinks',
  componentId: 'StyledLegalLinks',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;

const StyledLegalLink = styled.a.withConfig({
  displayName: 'StyledLegalLink',
  componentId: 'StyledLegalLink',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  min-height: 44px;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledLegalButton = styled.button.withConfig({
  displayName: 'StyledLegalButton',
  componentId: 'StyledLegalButton',
})`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  min-height: 44px;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledLegalText = styled.span.withConfig({
  displayName: 'StyledLegalText',
  componentId: 'StyledLegalText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  min-height: 44px;
  display: inline-flex;
  align-items: center;
`;

const StyledQuickActionsGroup = styled.div.withConfig({
  displayName: 'StyledQuickActionsGroup',
  componentId: 'StyledQuickActionsGroup',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: wrap;
`;

const StyledQuickActionButton = styled.button.withConfig({
  displayName: 'StyledQuickActionButton',
  componentId: 'StyledQuickActionButton',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid
    ${({ theme, isPrimary }) => (isPrimary ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, isPrimary }) =>
    isPrimary ? theme.colors.primary : theme.colors.background.primary};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme, isPrimary }) =>
      isPrimary ? theme.colors.primary : theme.colors.background.tertiary};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledQuickActionIcon = styled.span.withConfig({
  displayName: 'StyledQuickActionIcon',
  componentId: 'StyledQuickActionIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledQuickActionsSlot = styled.div.withConfig({
  displayName: 'StyledQuickActionsSlot',
  componentId: 'StyledQuickActionsSlot',
})`
  display: flex;
  align-items: center;
  width: 100%;
`;

export {
  StyledFooter,
  StyledFooterRow,
  StyledFooterBrand,
  StyledFooterAppName,
  StyledFooterLogo,
  StyledFooterCopyright,
  StyledFooterLink,
  StyledFooterSeparator,
  StyledFooterContent,
  StyledStatusGroup,
  StyledStatusBadge,
  StyledEnvironmentInfo,
  StyledLegalLinks,
  StyledLegalLink,
  StyledLegalButton,
  StyledLegalText,
  StyledQuickActionsGroup,
  StyledQuickActionButton,
  StyledQuickActionIcon,
  StyledQuickActionsSlot,
};

