/**
 * DisclaimerScreen Web Styles
 * File: DisclaimerScreen.web.styles.jsx
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
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding: ${({ theme }) => theme.spacing.lg}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  &:last-of-type {
    border-bottom: none;
  }
`;

const StyledNotice = styled.div.withConfig({
  displayName: 'StyledNotice',
  componentId: 'StyledNotice',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  border-left: 4px solid ${({ theme }) => theme.colors.warning};
`;

const StyledButtonWrap = styled.div.withConfig({
  displayName: 'StyledButtonWrap',
  componentId: 'StyledButtonWrap',
})`
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  width: 100%;
`;

export { StyledContainer, StyledContent, StyledSection, StyledNotice, StyledButtonWrap };

