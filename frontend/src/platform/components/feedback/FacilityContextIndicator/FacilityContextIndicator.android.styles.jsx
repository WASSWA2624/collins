import styled from 'styled-components/native';

const StyledIndicator = styled.View.withConfig({
  displayName: 'FacilityContextIndicator',
  componentId: 'FacilityContextIndicator',
})`
  flex-shrink: 1;
  min-width: 0;
  max-width: 180px;
  padding: 0 4px;
  border-radius: 0;
`;

const StyledMetaRow = styled.View.withConfig({
  displayName: 'FacilityContextMetaRow',
  componentId: 'FacilityContextMetaRow',
})`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

const getStatusColor = ({ theme, $status }) => {
  if ($status === 'offline') return theme.colors.error;
  if ($status === 'syncing' || $status === 'unstable') return theme.colors.warning;
  return theme.colors.success;
};

const StyledStatusDot = styled.View.withConfig({
  displayName: 'FacilityContextStatusDot',
  componentId: 'FacilityContextStatusDot',
})`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${getStatusColor};
`;

export { StyledIndicator, StyledMetaRow, StyledStatusDot };
