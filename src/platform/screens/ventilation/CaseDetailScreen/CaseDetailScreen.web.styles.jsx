/**
 * CaseDetailScreen Web Styles
 * File: CaseDetailScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl}px;
  box-sizing: border-box;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSectionTitle = styled.h3.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin: 0 0 ${({ theme }) => theme.spacing.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledBlock = styled.div.withConfig({
  displayName: 'StyledBlock',
  componentId: 'StyledBlock',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledWarningBox = styled.div.withConfig({
  displayName: 'StyledWarningBox',
  componentId: 'StyledWarningBox',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left: 4px solid ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledListItem = styled.li.withConfig({
  displayName: 'StyledListItem',
  componentId: 'StyledListItem',
})`
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  &:last-child { border-bottom: none; }
`;

const StyledNotFound = styled.div.withConfig({
  displayName: 'StyledNotFound',
  componentId: 'StyledNotFound',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export {
  StyledBlock,
  StyledContainer,
  StyledList,
  StyledListItem,
  StyledNotFound,
  StyledSection,
  StyledSectionTitle,
  StyledWarningBox,
};
