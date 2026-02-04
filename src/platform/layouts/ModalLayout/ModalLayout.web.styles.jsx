/**
 * ModalLayout Web Styles
 * Styled-components for Web platform
 * File: ModalLayout.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  min-height: ${({ theme }) => theme.spacing.xl * 6.25}px;
`;

export {
  StyledContainer,
};



