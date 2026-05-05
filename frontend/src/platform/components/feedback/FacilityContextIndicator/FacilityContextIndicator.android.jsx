import React from 'react';
import Text from '@platform/components/display/Text';
import useFacilityContextIndicator from './useFacilityContextIndicator';
import {
  StyledIndicator,
  StyledMetaRow,
  StyledStatusDot,
} from './FacilityContextIndicator.android.styles';

const FacilityContextIndicatorAndroid = ({ testID, style }) => {
  const { t, facilityName, roleLabel, syncStatusKey, syncStatusLabel } = useFacilityContextIndicator();

  return (
    <StyledIndicator
      accessibilityRole="none"
      accessibilityLabel={t('facilityContext.accessibilityLabel', { facility: facilityName, status: syncStatusLabel })}
      testID={testID}
      style={style}
    >
      <Text variant="label" numberOfLines={1}>{facilityName}</Text>
      <StyledMetaRow>
        <Text variant="caption" color="text.secondary" numberOfLines={1}>{roleLabel}</Text>
        <StyledStatusDot $status={syncStatusKey} />
        <Text variant="caption" color="text.secondary" numberOfLines={1}>{syncStatusLabel}</Text>
      </StyledMetaRow>
    </StyledIndicator>
  );
};

export default FacilityContextIndicatorAndroid;
