/**
 * HomeScreen Component - Android
 * File: HomeScreen.android.jsx
 */
// 1. External dependencies
import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';

// 2. Platform components
import { Text } from '@platform/components';
import { AppLogo } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import {
  StyledContainer,
  StyledContent,
  StyledLogoArea,
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

const HomeScreenAndroid = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { testIds, sections } = useHomeScreen();

  const handleSectionPress = useCallback(
    (path) => () => router.push(path),
    [router]
  );

  return (
    <StyledContainer accessibilityLabel={t('home.title')} testID={testIds.screen}>
      <StyledContent>
        <StyledLogoArea>
          <AppLogo size="lg" accessibilityLabel={t('home.welcome.logoLabel')} testID="home-logo" />
        </StyledLogoArea>
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
          {sections.map(({ path, id }) => (
            <StyledSectionItem
              key={id}
              onPress={handleSectionPress(path)}
              accessibilityLabel={t('home.overview.goTo', { name: t(`navigation.items.main.${id}`) })}
              accessibilityRole="button"
            >
              <StyledSectionTitle>{t(`navigation.items.main.${id}`)}</StyledSectionTitle>
              <StyledSectionDesc>{t(`home.overview.${id}.description`)}</StyledSectionDesc>
            </StyledSectionItem>
          ))}
        </StyledSectionList>
      </StyledOverview>
    </StyledContainer>
  );
};

export default HomeScreenAndroid;
