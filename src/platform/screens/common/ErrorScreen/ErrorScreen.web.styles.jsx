/**
 * ErrorScreen Web Styles
 * Styled-components for Web platform
 * File: ErrorScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledErrorContainer = styled.main.withConfig({
  displayName: 'StyledErrorContainer',
  componentId: 'StyledErrorContainer',
})`
  width: 100%;
  min-height: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledMessageSection = styled.div.withConfig({
  displayName: 'StyledMessageSection',
  componentId: 'StyledMessageSection',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledButtonGroup = styled.div.withConfig({
  displayName: 'StyledButtonGroup',
  componentId: 'StyledButtonGroup',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 400px;
`;

const StyledContentWrapper = styled.div.withConfig({
  displayName: 'StyledContentWrapper',
  componentId: 'StyledContentWrapper',
})`
  flex: 1;
  min-height: 0;
  width: 100%;
`;

const StyledScrollViewContent = styled.div.withConfig({
  displayName: 'StyledScrollViewContent',
  componentId: 'StyledScrollViewContent',
})`
  flex-grow: 1;
`;

const StyledMessageWrapper = styled.div.withConfig({
  displayName: 'StyledMessageWrapper',
  componentId: 'StyledMessageWrapper',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledErrorContainer,
  StyledContent,
  StyledMessageSection,
  StyledButtonGroup,
  StyledContentWrapper,
  StyledScrollViewContent,
  StyledMessageWrapper,
};

