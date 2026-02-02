/**
 * DataSourcesScreen iOS Styles
 * File: DataSourcesScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledMetaRow = styled(View).withConfig({
  displayName: 'StyledMetaRow',
  componentId: 'StyledMetaRow',
})`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
`;

const StyledSourceItem = styled(View).withConfig({
  displayName: 'StyledSourceItem',
  componentId: 'StyledSourceItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

export { StyledContainer, StyledContent, StyledContentWrap, StyledSection, StyledMetaRow, StyledSourceItem };
