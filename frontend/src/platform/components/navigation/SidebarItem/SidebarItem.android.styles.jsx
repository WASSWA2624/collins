import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';

export const Row = styled(TouchableOpacity).withConfig({
  displayName: 'Row',
  componentId: 'Row',
  shouldForwardProp: (prop) => prop !== 'active',
})`
  flex-direction: row;
  align-items: center;
  min-height: 48px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.background.tertiary : 'transparent'};
`;

export const Icon = styled(View).withConfig({
  displayName: 'Icon',
  componentId: 'Icon',
})`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

export const Label = styled(Text).withConfig({
  displayName: 'Label',
  componentId: 'Label',
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'collapsed',
})`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme, active }) => (active ? 600 : 400)};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.primary};
`;

