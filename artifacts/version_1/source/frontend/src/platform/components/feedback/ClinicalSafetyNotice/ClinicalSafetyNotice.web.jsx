import React from 'react';
import Text from '@platform/components/display/Text';
import { StyledBody, StyledNotice } from './ClinicalSafetyNotice.web.styles';
import { CLINICAL_SAFETY_NOTICE_TEST_IDS } from './types';

const ClinicalSafetyNoticeWeb = ({
  title,
  message,
  secondaryMessage,
  accessibilityLabel,
  testID = CLINICAL_SAFETY_NOTICE_TEST_IDS.root,
}) => {
  if (!title && !message && !secondaryMessage) return null;

  return (
    <StyledNotice
      role="note"
      aria-label={accessibilityLabel || title}
      data-testid={testID}
      testID={testID}
    >
      <StyledBody>
        {title ? (
          <Text as="h2" variant="label" color="status.warning.text" data-testid={CLINICAL_SAFETY_NOTICE_TEST_IDS.title}>
            {title}
          </Text>
        ) : null}
        {message ? (
          <Text variant="body" color="status.warning.text" data-testid={CLINICAL_SAFETY_NOTICE_TEST_IDS.message}>
            {message}
          </Text>
        ) : null}
        {secondaryMessage ? (
          <Text variant="caption" color="status.warning.text" data-testid={CLINICAL_SAFETY_NOTICE_TEST_IDS.secondaryMessage}>
            {secondaryMessage}
          </Text>
        ) : null}
      </StyledBody>
    </StyledNotice>
  );
};

export default ClinicalSafetyNoticeWeb;
