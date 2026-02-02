/**
 * HomeScreen Component - Web
 * File: HomeScreen.web.jsx
 */
// 1. External dependencies
import React from 'react';

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
} from './HomeScreen.web.styles';

// 5. Component hook
import useHomeScreen from './useHomeScreen';

const SECTIONS = [
  { path: '/assessment', key: 'assessment' },
  { path: '/history', key: 'history' },
  { path: '/training', key: 'training' },
];

const HomeScreenWeb = () => {
  const { t } = useI18n();
  const { testIds } = useHomeScreen();

  return (
    <StyledContainer aria-label={t('home.title')} testID={testIds.screen}>
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
      <StyledOverview aria-labelledby="home-overview-title">
        <StyledOverviewTitle id="home-overview-title">{t('home.overview.title')}</StyledOverviewTitle>
        <StyledSectionList role="list">
          {SECTIONS.map(({ path, key }) => (
            <StyledSectionItem
              key={key}
              href={path}
              role="listitem"
              aria-label={t(`home.overview.${key}.hint`)}
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

export default HomeScreenWeb;
