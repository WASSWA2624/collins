/**
 * HomeScreen Component - Android
 * File: HomeScreen.android.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components
import { Text } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import { StyledContainer, StyledContent, StyledMessage } from './HomeScreen.android.styles';

// 5. Component hook
import useHomeScreen from './useHomeScreen';

const HomeScreenAndroid = () => {
  const { t } = useI18n();
  const { testIds } = useHomeScreen();

  return (
    <StyledContainer accessibilityLabel={t('home.title')} testID={testIds.screen}>
      <StyledContent>
        <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
          {t('home.welcome.title')}
        </Text>
        <StyledMessage>
          <Text variant="body" testID={testIds.message}>
            {t('home.welcome.message')}
          </Text>
        </StyledMessage>
      </StyledContent>
    </StyledContainer>
  );
};

export default HomeScreenAndroid;
