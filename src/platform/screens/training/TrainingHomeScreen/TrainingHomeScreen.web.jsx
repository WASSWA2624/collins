/**
 * TrainingHomeScreen Component - Web
 * File: TrainingHomeScreen.web.jsx
 */
import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Button, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useTrainingHomeScreen from './useTrainingHomeScreen';
import {
  StyledChecklistCard,
  StyledContainer,
  StyledErrorBanner,
  StyledSearchWrap,
  StyledSection,
  StyledSectionTitle,
  StyledTopicLink,
  StyledTopicList,
} from './TrainingHomeScreen.web.styles';
import { TRAINING_HOME_TEST_IDS } from './types';

function TopicLink({ doc, t, onNavigate }) {
  const href = `/topic/${encodeURIComponent(doc?.id ?? '')}`;
  return (
    <StyledTopicLink
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(doc?.id);
      }}
      aria-label={t('training.topics.openTopicHint')}
      data-testid={`${TRAINING_HOME_TEST_IDS.popularTopics}-${doc?.id ?? ''}`}
    >
      <Text variant="body">{doc?.title ?? doc?.id ?? ''}</Text>
    </StyledTopicLink>
  );
}

const TrainingHomeScreenWeb = () => {
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
    isSearching,
  } = useTrainingHomeScreen();

  const handleNavigateToTopic = useCallback(
    (topicId) => {
      if (topicId) router.push(`/topic/${encodeURIComponent(topicId)}`);
    },
    [router]
  );

  const handleSearchSubmit = useCallback(
    (value) => {
      search(value);
    },
    [search]
  );

  const handleBrowseAll = useCallback(() => {
    router.push('/topics');
  }, [router]);

  if (isLoading) {
    return (
      <StyledContainer aria-label={t('training.home.accessibilityLabel')} data-testid={TRAINING_HOME_TEST_IDS.screen}>
        <Text>{t('training.home.states.loading')}</Text>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      aria-label={t('training.home.accessibilityLabel')}
      data-testid={TRAINING_HOME_TEST_IDS.screen}
      role="main"
    >
      {loadError ? (
        <StyledErrorBanner data-testid={TRAINING_HOME_TEST_IDS.errorBanner}>
          <Text variant="body" color="status.error.text">{t('training.home.states.error')}</Text>
        </StyledErrorBanner>
      ) : null}
      <StyledSearchWrap>
        <TextField
          label={t('training.home.searchPlaceholder')}
          placeholder={t('training.home.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={(e) => handleSearchSubmit(e?.nativeEvent?.text ?? searchQuery)}
          accessibilityLabel={t('training.home.searchHint')}
          testID={TRAINING_HOME_TEST_IDS.search}
        />
        {searchQuery.trim() ? (
          <Button variant="outline" onPress={() => search(searchQuery)}>
            {t('common.search')}
          </Button>
        ) : null}
      </StyledSearchWrap>
      {searchResults?.length > 0 ? (
        <StyledSection aria-labelledby="search-results-heading">
          <StyledSectionTitle id="search-results-heading">{t('training.home.popularTopics')}</StyledSectionTitle>
          <StyledTopicList>
            {searchResults.map((r) => (
              <li key={`${r.type}-${r.id}`}>
                <TopicLink doc={r} t={t} onNavigate={handleNavigateToTopic} />
              </li>
            ))}
          </StyledTopicList>
        </StyledSection>
      ) : null}
      {!searchQuery.trim() && popularTopics?.length > 0 ? (
        <StyledSection aria-labelledby="popular-heading">
          <StyledSectionTitle id="popular-heading">{t('training.home.popularTopics')}</StyledSectionTitle>
          <StyledTopicList data-testid={TRAINING_HOME_TEST_IDS.popularTopics}>
            {popularTopics.map((doc) => (
              <li key={`${doc.type}-${doc.id}`}>
                <TopicLink doc={doc} t={t} onNavigate={handleNavigateToTopic} />
              </li>
            ))}
          </StyledTopicList>
        </StyledSection>
      ) : null}
      {!searchQuery.trim() && quickChecklists?.length > 0 ? (
        <StyledSection aria-labelledby="checklists-heading">
          <StyledSectionTitle id="checklists-heading">{t('training.home.quickChecklists')}</StyledSectionTitle>
          <div data-testid={TRAINING_HOME_TEST_IDS.quickChecklists}>
            {quickChecklists.map((c) => (
              <StyledChecklistCard key={c?.id}>
                <Text variant="label">{c?.title ?? c?.id ?? ''}</Text>
                <Button variant="outline" onPress={() => handleNavigateToTopic(c?.id)}>
                  {t('training.home.viewTopic')}
                </Button>
              </StyledChecklistCard>
            ))}
          </div>
        </StyledSection>
      ) : null}
      {!searchQuery.trim() && isEmpty ? (
        <div data-testid={TRAINING_HOME_TEST_IDS.empty}>
          <Text variant="body">{t('training.home.states.empty')}</Text>
        </div>
      ) : null}
      {!searchQuery.trim() && !isEmpty ? (
        <Button
          variant="outline"
          onPress={handleBrowseAll}
          accessibilityLabel={t('training.home.browseAllHint')}
          data-testid={TRAINING_HOME_TEST_IDS.browseAll}
        >
          {t('training.home.browseAll')}
        </Button>
      ) : null}
    </StyledContainer>
  );
};

export default TrainingHomeScreenWeb;
