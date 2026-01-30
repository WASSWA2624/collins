/**
 * DatabaseConnectivityIcon Styles - Web
 * File: DatabaseConnectivityIcon.web.styles.jsx
 */
import styled from 'styled-components';

const StyledIconWrap = styled.span.withConfig({
  displayName: 'StyledIconWrap',
  componentId: 'StyledIconWrap',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $connected }) => ($connected ? theme.colors.success : theme.colors.error)};

  & svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 767px) {
    & svg {
      width: 14px;
      height: 14px;
    }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    & svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export { StyledIconWrap };
