import styled from 'styled-components';

export const Row = styled.a.withConfig({
  displayName: 'Row',
  componentId: 'Row',
  shouldForwardProp: (prop) => prop !== '$collapsed' && prop !== '$active',
})`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  min-height: 44px;
  padding: ${({ theme, $collapsed }) =>
    $collapsed ? `${theme.spacing.xs}px` : `${theme.spacing.sm}px ${theme.spacing.md}px`};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.background.tertiary)};
  border-left-width: 4px;
  border-radius: 0;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.background.secondary : theme.colors.background.primary};
  box-shadow: ${({ $active }) => ($active ? 'inset 0 0 0 1px rgba(0, 122, 255, 0.08)' : 'none')};
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.background.secondary : theme.colors.background.tertiary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const IconWrapper = styled.span.withConfig({
  displayName: 'IconWrapper',
  componentId: 'IconWrapper',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: inherit;
`;

export const Label = styled.span.withConfig({
  displayName: 'Label',
  componentId: 'Label',
  shouldForwardProp: (prop) => prop !== '$collapsed' && prop !== '$active',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  color: inherit;
  /* Tablet/desktop: hide label when collapsed; mobile: always show */
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    display: inline;
  }
`;

