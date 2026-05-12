import React from 'react';
import useFacilityContextIndicator from './useFacilityContextIndicator';
import {
  StyledFacilityLabel,
  StyledFacilityMeta,
  StyledFacilitySelect,
  StyledIndicator,
  StyledStatus,
} from './FacilityContextIndicator.web.styles';

const FacilityContextIndicatorWeb = ({ testID, className, style }) => {
  const {
    t,
    activeFacilityId,
    facilityOptions,
    facilityName,
    roleLabel,
    syncStatusKey,
    syncStatusLabel,
    hasFacilityChoices,
    handleFacilityChange,
  } = useFacilityContextIndicator();

  return (
    <StyledIndicator
      role="status"
      aria-live="polite"
      aria-label={t('facilityContext.accessibilityLabel', { facility: facilityName, status: syncStatusLabel })}
      data-testid={testID}
      className={className}
      style={style}
    >
      {hasFacilityChoices ? (
        <StyledFacilitySelect
          aria-label={t('facilityContext.facilitySelectLabel')}
          value={activeFacilityId || ''}
          onChange={(event) => handleFacilityChange(event.target.value)}
        >
          <option value="">{t('facilityContext.allFacilities')}</option>
          {facilityOptions.map((option) => (
            <option key={option.facilityId} value={option.facilityId}>
              {option.facility?.name || option.facilityName || option.facilityId}
            </option>
          ))}
        </StyledFacilitySelect>
      ) : (
        <StyledFacilityLabel title={facilityName}>{facilityName}</StyledFacilityLabel>
      )}
      <StyledFacilityMeta>{roleLabel}</StyledFacilityMeta>
      <StyledStatus data-status={syncStatusKey}>{syncStatusLabel}</StyledStatus>
    </StyledIndicator>
  );
};

export default FacilityContextIndicatorWeb;
