/**
 * HomeScreen Component - Web
 * File: HomeScreen.web.jsx
 */
// 1. External dependencies
import React from 'react';

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
} from './HomeScreen.web.styles';

// 5. Component hook
import useHomeScreen from './useHomeScreen';

const HomeScreenWeb = () => {
  const { t } = useI18n();
  const { testIds, sections } = useHomeScreen();

  return (
    <StyledContainer aria-label={t('home.title')} testID={testIds.screen}>
      <StyledContent>
        <StyledLogoArea>
          <AppLogo size="lg" accessibilityLabel={t('home.welcome.logoLabel')} testID="home-logo" />
        </StyledLogoArea>
        <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
          {t('home.welcome.title')}
        </Text>
        <StyledMessage>
          <Text variant="body" testID={testIds.message}>
            {t('home.welcome.message')}
          </Text>
        </StyledMessage>
      </StyledContent>
      <StyledOverview aria-labelledby="home-overview-title">
        <StyledOverviewTitle id="home-overview-title">{t('home.overview.title')}</StyledOverviewTitle>
        <StyledSectionList role="list">
          {sections.map(({ path, id }) => (
            <StyledSectionItem
              key={id}
              href={path}
              role="listitem"
              aria-label={t('home.overview.goTo', { name: t(`navigation.items.main.${id}`) })}
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

export default HomeScreenWeb;
