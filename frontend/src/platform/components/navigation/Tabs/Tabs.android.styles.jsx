/**
 * Tabs Android Styles
 * Styled-components for Android platform
 * File: Tabs.android.styles.jsx
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


