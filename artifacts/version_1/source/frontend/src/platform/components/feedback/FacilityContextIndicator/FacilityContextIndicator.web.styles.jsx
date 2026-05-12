import styled from 'styled-components';

const StyledIndicator = styled.div.withConfig({
  displayName: 'FacilityContextIndicator',
  componentId: 'FacilityContextIndicator',
})`
  display: grid;
  grid-template-columns: minmax(96px, 180px) auto;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.xs}px;
  row-gap: 0;
  min-width: 0;
  max-width: 360px;
  padding: 2px ${({ theme }) => theme.spacing.xs}px;
  border-left: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: 767px) {
    grid-template-columns: minmax(76px, 1fr) auto;
    max-width: 220px;
    padding: 0 4px;
  }
`;

const StyledFacilityLabel = styled.span.withConfig({
  displayName: 'FacilityContextLabel',
  componentId: 'FacilityContextLabel',
})`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.2;
`;

const StyledFacilitySelect = styled.select.withConfig({
  displayName: 'FacilityContextSelect',
  componentId: 'FacilityContextSelect',
})`
  min-width: 0;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.2;
  padding: 1px 4px;
`;

const StyledFacilityMeta = styled.span.withConfig({
  displayName: 'FacilityContextMeta',
  componentId: 'FacilityContextMeta',
})`
  grid-column: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledStatus = styled.span.withConfig({
  displayName: 'FacilityContextStatus',
  componentId: 'FacilityContextStatus',
})`
  grid-row: 1 / span 2;
  grid-column: 2;
  justify-self: end;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export {
  StyledFacilityLabel,
  StyledFacilityMeta,
  StyledFacilitySelect,
  StyledIndicator,
  StyledStatus,
};
