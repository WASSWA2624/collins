/**
 * ListScaffold Android Styles
 * Styled-components for Android platform
 * File: ListScaffold.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export {
  StyledContainer,
};

