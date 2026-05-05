import styled from 'styled-components';

const StyledNotice = styled.section.withConfig({
  displayName: 'StyledClinicalSafetyNotice',
  componentId: 'StyledClinicalSafetyNotice',
})`
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-left-width: 4px;
  background-color: ${({ theme }) => theme.colors.status.warning.background};
  color: ${({ theme }) => theme.colors.status.warning.text};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const StyledBody = styled.div.withConfig({
  displayName: 'StyledClinicalSafetyNoticeBody',
  componentId: 'StyledClinicalSafetyNoticeBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export { StyledBody, StyledNotice };

