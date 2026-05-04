/**
 * List Web Styles
 * Styled-components for Web platform
 * File: List.web.styles.jsx
 */
import styled from 'styled-components';
import { View } from 'react-native';

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export { StyledList };



