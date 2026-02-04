/**
 * DisclaimerLayout - Android
 * Minimal layout for disclaimer screen: centered header, no sidebar/TabBar
 * File: DisclaimerLayout.android.jsx
 */
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '@platform/components/display/Text';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledHeader,
  StyledHeaderTitle,
  StyledContent,
} from './DisclaimerLayout.android.styles';

const DisclaimerLayoutAndroid = ({ children, accessibilityLabel, testID }) => {
  const { t } = useI18n();
  const { top: topInset } = useSafeAreaInsets();

  return (
    <StyledContainer
      accessibilityLabel={accessibilityLabel ?? t('settings.disclaimer.screen.label')}
      testID={testID ?? 'disclaimer-layout'}
    >
      <StyledHeader topInset={topInset}>
        <StyledHeaderTitle>
          <Text variant="h2" testID="disclaimer-title">{t('settings.disclaimer.title')}</Text>
        </StyledHeaderTitle>
      </StyledHeader>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default DisclaimerLayoutAndroid;
