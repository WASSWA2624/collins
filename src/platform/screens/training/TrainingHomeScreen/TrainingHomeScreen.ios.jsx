/**
 * TrainingHomeScreen Component - iOS
 * File: TrainingHomeScreen.ios.jsx
 */
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useTrainingHomeScreen from './useTrainingHomeScreen';
import {
  StyledContainer,
  StyledContentWrap,
  StyledErrorBanner,
  StyledPageHeader,
  StyledPageTitle,
  StyledSearchWrap,
  StyledSection,
  StyledSectionTitle,
  StyledTopicRow,
} from './TrainingHomeScreen.ios.styles';
import { TRAINING_HOME_TEST_IDS } from './types';

const TrainingHomeScreenIos = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    popularTopics,
    loadError,
    isLoading,
    isEmpty,
    searchQuery,
    setSearchQuery,
    searchResults,
    search,
  } = useTrainingHomeScreen();

  const handleNavigateToTopic = useCallback(
    (topicId) => {
      if (topicId) router.push(`/topic/${encodeURIComponent(topicId)}`);
    },
    [router]
  );

  const handleBrowseAll = useCallback(() => router.push('/topics'), [router]);

  if (isLoading) {
    return (
      <StyledContainer accessibilityLabel={t('training.home.accessibilityLabel')} testID={TRAINING_HOME_TEST_IDS.screen}>
        <Text>{t('training.home.states.loading')}</Text>
      </StyledContainer>
    );
  }

  const showSearchResults = searchQuery.trim() && (searchResults?.length ?? 0) > 0;
  const showTopics = !searchQuery.trim() && (popularTopics?.length ?? 0) > 0;
  const displayTopics = showSearchResults ? searchResults : popularTopics;
  const sectionTitleKey = showSearchResults ? 'training.home.searchResults' : 'training.home.topicsSection';

  return (
    <StyledContainer
      accessibilityLabel={t('training.home.accessibilityLabel')}
      testID={TRAINING_HOME_TEST_IDS.screen}
    >
      <StyledContentWrap>
        <StyledPageHeader>
          <StyledPageTitle>
            <Text variant="label">{t('training.home.title')}</Text>
          </StyledPageTitle>
          <Text variant="caption" color="text.secondary">{t('training.home.subtitle')}</Text>
        </StyledPageHeader>
        {loadError ? (
          <StyledErrorBanner testID={TRAINING_HOME_TEST_IDS.errorBanner}>
            <Text variant="body" color="status.error.text">{t('training.home.states.error')}</Text>
          </StyledErrorBanner>
        ) : null}
        <StyledSearchWrap>
          <TextField
            label={t('training.home.searchPlaceholder')}
            placeholder={t('training.home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel={t('training.home.searchHint')}
            testID={TRAINING_HOME_TEST_IDS.search}
          />
          <Button variant="outline" onPress={() => search(searchQuery)}>
            {t('common.search')}
          </Button>
        </StyledSearchWrap>
        {(showSearchResults || showTopics) && displayTopics?.length > 0 ? (
          <StyledSection>
            <StyledSectionTitle>
              <Text variant="label">{t(sectionTitleKey)}</Text>
            </StyledSectionTitle>
            <View testID={TRAINING_HOME_TEST_IDS.popularTopics}>
              {displayTopics.map((doc) => (
                <TouchableOpacity
                  key={`${doc.type}-${doc.id}`}
                  onPress={() => handleNavigateToTopic(doc?.id)}
                  accessibilityLabel={t('training.topics.openTopicHint')}
                  testID={`${TRAINING_HOME_TEST_IDS.popularTopics}-${doc?.id ?? ''}`}
                >
                  <StyledTopicRow>
                    <Text variant="body">{doc?.title ?? doc?.id ?? ''}</Text>
                  </StyledTopicRow>
                </TouchableOpacity>
              ))}
            </View>
          </StyledSection>
        ) : null}
        {!searchQuery.trim() && isEmpty ? (
          <StyledSection testID={TRAINING_HOME_TEST_IDS.empty}>
            <Text variant="body">{t('training.home.states.empty')}</Text>
          </StyledSection>
        ) : null}
        {!searchQuery.trim() && !isEmpty ? (
          <Button
            variant="outline"
            onPress={handleBrowseAll}
            accessibilityLabel={t('training.home.browseAllHint')}
            testID={TRAINING_HOME_TEST_IDS.browseAll}
          >
            {t('training.home.browseAll')}
          </Button>
        ) : null}
      </StyledContentWrap>
    </StyledContainer>
  );
};

export default TrainingHomeScreenIos;
