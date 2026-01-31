/**
 * AssessmentEntryScreen Component - iOS
 * File: AssessmentEntryScreen.ios.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components
import { Button, Text } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import {
  StyledActions,
  StyledContainer,
  StyledContent,
} from './AssessmentEntryScreen.ios.styles';

// 5. Component hook
import useAssessmentEntryScreen from './useAssessmentEntryScreen';

const AssessmentEntryScreenIOS = () => {
  const { t } = useI18n();
  const { handleStart } = useAssessmentEntryScreen();

  return (
    <StyledContainer accessibilityLabel={t('assessment.entry.title')} testID="assessment-entry-screen">
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="assessment-entry-title">
          {t('assessment.entry.title')}
        </Text>
        <Text variant="body" testID="assessment-entry-description">
          {t('assessment.entry.description')}
        </Text>
        <StyledActions>
          <Button
            variant="primary"
            size="large"
            onPress={handleStart}
            accessibilityRole="button"
            accessibilityLabel={t('assessment.entry.start')}
            accessibilityHint={t('assessment.entry.startHint')}
            testID="assessment-entry-start"
          >
            {t('assessment.entry.start')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default AssessmentEntryScreenIOS;

