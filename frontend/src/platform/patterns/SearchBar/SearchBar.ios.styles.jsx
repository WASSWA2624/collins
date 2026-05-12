/**
 * SearchBar iOS Styles
 * Styled-components for iOS platform
 * File: SearchBar.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
`;

const StyledSearchIcon = styled.Text.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 22px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
`;

const StyledClearButtonWrapper = styled.View.withConfig({
  displayName: 'StyledClearButtonWrapper',
  componentId: 'StyledClearButtonWrapper',
})`
  min-width: 30px;
  min-height: 30px;
  align-items: center;
  justify-content: center;
`;

export {
  StyledContainer,
  StyledSearchIcon,
  StyledClearButtonWrapper,
};
