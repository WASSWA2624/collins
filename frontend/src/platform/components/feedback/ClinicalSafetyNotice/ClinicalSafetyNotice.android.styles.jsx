import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledNotice = styled(View).withConfig({
  displayName: 'StyledClinicalSafetyNotice',
  componentId: 'StyledClinicalSafetyNotice',
})`
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-left-width: 4px;
  background-color: ${({ theme }) => theme.colors.status.warning.background};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const StyledBody = styled(View).withConfig({
  displayName: 'StyledClinicalSafetyNoticeBody',
  componentId: 'StyledClinicalSafetyNoticeBody',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export { StyledBody, StyledNotice };

