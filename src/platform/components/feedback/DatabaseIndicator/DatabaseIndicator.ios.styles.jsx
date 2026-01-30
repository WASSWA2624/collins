/**
 * DatabaseIndicator Styles - iOS
 * File: DatabaseIndicator.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledIndicator = styled.View.withConfig({
  displayName: 'StyledIndicator',
  componentId: 'StyledIndicator',
})`
  flex-direction: row;
  align-items: center;
  padding: 2px 6px;
`;

export { StyledIndicator };
