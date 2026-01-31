import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';

export const Row = styled(TouchableOpacity).withConfig({
  displayName: 'Row',
  componentId: 'Row',
})`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

export const Icon = styled(View).withConfig({
  displayName: 'Icon',
  componentId: 'Icon',
})`
  width: ${({ theme }) => theme.spacing.md}px;
  height: ${({ theme }) => theme.spacing.md}px;
`;

export const Label = styled(Text).withConfig({
  displayName: 'Label',
  componentId: 'Label',
})`
  margin-left: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

