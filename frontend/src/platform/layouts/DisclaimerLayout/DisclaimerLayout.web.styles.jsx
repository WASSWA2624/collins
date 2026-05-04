/**
 * DisclaimerLayout Web Styles
 * File: DisclaimerLayout.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'DisclaimerLayout_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'DisclaimerLayout_StyledHeader',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledHeaderTitle = styled.div.withConfig({
  displayName: 'StyledHeaderTitle',
  componentId: 'DisclaimerLayout_StyledHeaderTitle',
})`
  display: flex;
  justify-content: center;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'DisclaimerLayout_StyledContent',
})`
  flex: 1;
`;

export { StyledContainer, StyledHeader, StyledHeaderTitle, StyledContent };
