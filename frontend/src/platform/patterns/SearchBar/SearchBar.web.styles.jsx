/**
 * SearchBar Web Styles
 * Styled-components for Web platform
 * File: SearchBar.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
`;

const StyledSearchIcon = styled.span.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  min-width: 22px;
  height: 22px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: 22px;
`;

const StyledClearButton = styled.span.withConfig({
  displayName: 'StyledClearButton',
  componentId: 'StyledClearButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  button {
    min-width: 30px;
    min-height: 30px;
    padding: 0;
    border-radius: 0;
  }
`;

export { StyledClearButton, StyledContainer, StyledSearchIcon };
