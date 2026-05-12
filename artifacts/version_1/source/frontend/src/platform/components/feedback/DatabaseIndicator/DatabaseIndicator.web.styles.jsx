/**
 * DatabaseIndicator Styles - Web
 * File: DatabaseIndicator.web.styles.jsx
 */
import styled from 'styled-components';

const StyledIndicator = styled.div.withConfig({
  displayName: 'StyledIndicator',
  componentId: 'StyledIndicator',
})`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm ?? 4}px;
  background-color: transparent;
  border: none;
  white-space: nowrap;

  @media (max-width: 767px) {
    padding: 2px 4px;
    gap: 2px;
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 2px 5px;
  }
`;

export { StyledIndicator };
