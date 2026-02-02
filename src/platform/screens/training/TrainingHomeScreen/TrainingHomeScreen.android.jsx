/**
 * TrainingHomeScreen Component - Android
 * File: TrainingHomeScreen.android.jsx
 */
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useTrainingHomeScreen from './useTrainingHomeScreen';
import {
  StyledChecklistCard,
  StyledContainer,
  StyledContentWrap,
  StyledErrorBanner,
  StyledSearchWrap,
  StyledSection,
  StyledSectionTitle,
  StyledTopicRow,
} from './TrainingHomeScreen.android.styles';
import { TRAINING_HOME_TEST_IDS } from './types';

const TrainingHomeScreenAndroid = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    popularTopics,
    quickChecklists,
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

  const displayTopics = searchQuery.trim() ? searchResults : popularTopics;

  return (
    <StyledContainer
      accessibilityLabel={t('training.home.accessibilityLabel')}
      testID={TRAINING_HOME_TEST_IDS.screen}
    >
      <StyledContentWrap>
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
        {displayTopics?.length > 0 ? (
          <StyledSection>
            <StyledSectionTitle>
              <Text variant="label">{t('training.home.popularTopics')}</Text>
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
        {!searchQuery.trim() && quickChecklists?.length > 0 ? (
          <StyledSection>
            <StyledSectionTitle>
              <Text variant="label">{t('training.home.quickChecklists')}</Text>
            </StyledSectionTitle>
            <View testID={TRAINING_HOME_TEST_IDS.quickChecklists}>
              {quickChecklists.map((c) => (
                <StyledChecklistCard key={c?.id}>
                  <Text variant="label">{c?.title ?? c?.id ?? ''}</Text>
                  <Button variant="outline" onPress={() => handleNavigateToTopic(c?.id)}>
                    {t('training.home.viewTopic')}
                  </Button>
                </StyledChecklistCard>
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

export default TrainingHomeScreenAndroid;
