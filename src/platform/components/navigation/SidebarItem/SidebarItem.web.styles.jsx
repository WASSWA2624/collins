import styled from 'styled-components';

export const Row = styled.a.withConfig({
  displayName: 'Row',
  componentId: 'Row',
  shouldForwardProp: (prop) => prop !== '$collapsed' && prop !== '$active',
})`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  padding: ${({ theme, $collapsed }) =>
    $collapsed ? `${theme.spacing.xs}px` : `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.background.secondary : 'transparent')};
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${({ theme, $active }) => ($active ? theme.colors.background.secondary : theme.colors.background.tertiary)};
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
  width: 18px;
  height: 18px;
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
  font-weight: ${({ theme, $active }) => ($active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal)};
  color: inherit;
  /* Tablet/desktop: hide label when collapsed; mobile: always show */
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    display: inline;
  }
`;
