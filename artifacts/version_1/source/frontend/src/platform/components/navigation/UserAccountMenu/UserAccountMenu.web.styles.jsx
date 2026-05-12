/**
 * UserAccountMenu Web Styles
 * File: UserAccountMenu.web.styles.jsx
 */
import styled from 'styled-components';

const getStatusColor = ({ theme, $status }) => {
  if ($status === 'offline') return theme.colors.error;
  if ($status === 'syncing' || $status === 'unstable') return theme.colors.warning;
  return theme.colors.success;
};

const StyledAccountMenu = styled.div.withConfig({
  displayName: 'StyledAccountMenu',
  componentId: 'StyledAccountMenu',
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
`;

const StyledAvatarButton = styled.button.withConfig({
  displayName: 'StyledAvatarButton',
  componentId: 'StyledAvatarButton',
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledStatusDot = styled.span.withConfig({
  displayName: 'StyledStatusDot',
  componentId: 'StyledStatusDot',
  shouldForwardProp: (prop) => prop !== '$status',
})`
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 10px;
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 2px solid ${({ theme }) => theme.colors.background.primary};
  background-color: ${getStatusColor};
`;

const StyledMenu = styled.div.withConfig({
  displayName: 'StyledMenu',
  componentId: 'StyledMenu',
})`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm}px);
  right: 0;
  width: 288px;
  max-width: calc(100vw - ${({ theme }) => theme.spacing.md * 2}px);
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
  z-index: 1200;
  overflow: hidden;

  @media (max-width: 767px) {
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 58px);
    right: ${({ theme }) => theme.spacing.sm}px;
    width: min(288px, calc(100vw - ${({ theme }) => theme.spacing.md}px));
  }
`;

const StyledMenuHeader = styled.div.withConfig({
  displayName: 'StyledMenuHeader',
  componentId: 'StyledMenuHeader',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledIdentityText = styled.div.withConfig({
  displayName: 'StyledIdentityText',
  componentId: 'StyledIdentityText',
})`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
`;

const StyledTruncatedText = styled.span.withConfig({
  displayName: 'StyledTruncatedText',
  componentId: 'StyledTruncatedText',
})`
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledMenuBody = styled.div.withConfig({
  displayName: 'StyledMenuBody',
  componentId: 'StyledMenuBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const StyledMenuField = styled.div.withConfig({
  displayName: 'StyledMenuField',
  componentId: 'StyledMenuField',
})`
  display: grid;
  grid-template-columns: minmax(90px, auto) 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledFieldLabel = styled.span.withConfig({
  displayName: 'StyledFieldLabel',
  componentId: 'StyledFieldLabel',
})`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.2;
`;

const StyledFieldValue = styled.span.withConfig({
  displayName: 'StyledFieldValue',
  componentId: 'StyledFieldValue',
})`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: 1.25;
`;

const StyledStatusValue = styled(StyledFieldValue).withConfig({
  displayName: 'StyledStatusValue',
  componentId: 'StyledStatusValue',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledInlineStatusDot = styled.span.withConfig({
  displayName: 'StyledInlineStatusDot',
  componentId: 'StyledInlineStatusDot',
  shouldForwardProp: (prop) => prop !== '$status',
})`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${getStatusColor};
  flex: 0 0 auto;
`;

const StyledFacilitySelect = styled.select.withConfig({
  displayName: 'StyledFacilitySelect',
  componentId: 'StyledFacilitySelect',
})`
  min-width: 0;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: 1.2;
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledMenuDivider = styled.div.withConfig({
  displayName: 'StyledMenuDivider',
  componentId: 'StyledMenuDivider',
})`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledLogoutButton = styled.button.withConfig({
  displayName: 'StyledLogoutButton',
  componentId: 'StyledLogoutButton',
})`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 0;
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.error};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

export {
  StyledAccountMenu,
  StyledAvatarButton,
  StyledFacilitySelect,
  StyledFieldLabel,
  StyledFieldValue,
  StyledIdentityText,
  StyledInlineStatusDot,
  StyledLogoutButton,
  StyledMenu,
  StyledMenuBody,
  StyledMenuDivider,
  StyledMenuField,
  StyledMenuHeader,
  StyledStatusDot,
  StyledStatusValue,
  StyledTruncatedText,
};
