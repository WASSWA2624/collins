/**
 * Tabs iOS Styles
 * Styled-components for iOS platform
 * File: Tabs.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledTabs = styled.View.withConfig({
  displayName: 'StyledTabs',
})`
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${({ variant }) => (variant === 'underline' ? 1 : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledTabs,
};


