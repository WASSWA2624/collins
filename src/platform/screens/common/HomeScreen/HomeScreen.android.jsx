/**
 * HomeScreen Component - Android
 * File: HomeScreen.android.jsx
 */
// 1. External dependencies
import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';

// 2. Platform components
import { Text } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import {
  StyledContainer,
  StyledContent,
  StyledMessage,
  StyledOverview,
  StyledOverviewTitle,
  StyledSectionList,
  StyledSectionItem,
  StyledSectionTitle,
  StyledSectionDesc,
} from './HomeScreen.android.styles';

// 5. Component hook
import useHomeScreen from './useHomeScreen';

const SECTIONS = [
  { path: '/assessment', key: 'assessment' },
  { path: '/history', key: 'history' },
  { path: '/training', key: 'training' },
];

const HomeScreenAndroid = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { testIds } = useHomeScreen();

  const handleSectionPress = useCallback(
    (path) => () => router.push(path),
    [router]
  );

  return (
    <StyledContainer accessibilityLabel={t('home.title')} testID={testIds.screen}>
      <StyledContent>
        <Text variant="h1" testID={testIds.title}>
          {t('home.welcome.title')}
        </Text>
        <StyledMessage>
          <Text variant="body" testID={testIds.message}>
            {t('home.welcome.message')}
          </Text>
        </StyledMessage>
      </StyledContent>
      <StyledOverview accessibilityLabel={t('home.overview.title')}>
        <StyledOverviewTitle>{t('home.overview.title')}</StyledOverviewTitle>
        <StyledSectionList>
          {SECTIONS.map(({ path, key }) => (
            <StyledSectionItem
              key={key}
              onPress={handleSectionPress(path)}
              accessibilityLabel={t(`home.overview.${key}.hint`)}
              accessibilityRole="button"
            >
              <StyledSectionTitle>{t(`home.overview.${key}.title`)}</StyledSectionTitle>
              <StyledSectionDesc>{t(`home.overview.${key}.description`)}</StyledSectionDesc>
            </StyledSectionItem>
          ))}
        </StyledSectionList>
      </StyledOverview>
    </StyledContainer>
  );
};

export default HomeScreenAndroid;
