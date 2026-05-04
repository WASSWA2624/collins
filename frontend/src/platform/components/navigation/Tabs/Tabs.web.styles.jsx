/**
 * Tabs Web Styles
 * Styled-components for Web platform
 * File: Tabs.web.styles.jsx
 */
import styled from 'styled-components';
import { View } from 'react-native';

const StyledTabs = styled(View).withConfig({
  displayName: 'StyledTabs',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${({ variant }) => (variant === 'underline' ? 1 : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export { StyledTabs };



