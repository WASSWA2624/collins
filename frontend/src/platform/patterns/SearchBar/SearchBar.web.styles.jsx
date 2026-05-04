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
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const StyledSearchIcon = styled.span.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTextFieldWrapper = styled.div.withConfig({
  displayName: 'StyledTextFieldWrapper',
  componentId: 'StyledTextFieldWrapper',
})`
  flex: 1;
`;

export {
  StyledContainer,
  StyledSearchIcon,
  StyledTextFieldWrapper,
};



