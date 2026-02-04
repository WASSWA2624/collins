/**
 * TrainingHomeScreen Component - Web
 * Merged: Getting started (onboarding) + Training topics.
 * File: TrainingHomeScreen.web.jsx
 */
import React, { useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Button, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useOnboardingScreen from '@platform/screens/onboarding/OnboardingScreen/useOnboardingScreen';
import useTrainingHomeScreen from './useTrainingHomeScreen';
import {
  StyledContainer,
  StyledErrorBanner,
  StyledGettingStartedSection,
  StyledGettingStartedTitle,
  StyledGettingStartedActions,
  StyledPageHeader,
  StyledPageTitle,
  StyledSubtitle,
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
  const trainingSectionRef = useRef(null);
  const {
    currentStepId,
    stepTitle,
    stepBody,
    isFirst,
    isLast,
    goNext,
    goBack,
  } = useOnboardingScreen();
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

  const handleOnboardingDone = useCallback(() => {
    trainingSectionRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, []);
  const handleOnboardingBack = useCallback(() => {
    if (isFirst) router.back();
    else goBack();
  }, [isFirst, router, goBack]);

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

  const showSearchResults = searchQuery.trim() && searchResults?.length > 0;
  const showTopics = !searchQuery.trim() && popularTopics?.length > 0;
  const listToShow = showSearchResults ? searchResults : popularTopics;
  const sectionHeadingId = showSearchResults ? 'search-results-heading' : 'topics-heading';
  const sectionTitleKey = showSearchResults ? 'training.home.searchResults' : 'training.home.topicsSection';

  return (
    <StyledContainer
      aria-label={t('training.home.accessibilityLabel')}
      data-testid={TRAINING_HOME_TEST_IDS.screen}
      role="main"
    >
      <StyledPageHeader>
        <StyledPageTitle>{t('training.home.title')}</StyledPageTitle>
        <StyledSubtitle>{t('training.home.subtitle')}</StyledSubtitle>
      </StyledPageHeader>
      <StyledGettingStartedSection aria-labelledby="getting-started-heading">
        <StyledGettingStartedTitle id="getting-started-heading">
          {t('navigation.items.main.onboarding')}
        </StyledGettingStartedTitle>
        <Text as="h3" variant="h3">{stepTitle(currentStepId)}</Text>
        <Text variant="body">{stepBody(currentStepId)}</Text>
        <StyledGettingStartedActions>
          <Button variant="outline" onPress={handleOnboardingBack} accessibilityLabel={t('settings.onboarding.actions.back')}>
            {t('settings.onboarding.actions.back')}
          </Button>
          {isLast ? (
            <Button variant="primary" onPress={handleOnboardingDone} accessibilityLabel={t('settings.onboarding.actions.done')}>
              {t('settings.onboarding.actions.done')}
            </Button>
          ) : (
            <Button variant="primary" onPress={goNext} accessibilityLabel={t('settings.onboarding.actions.next')}>
              {t('settings.onboarding.actions.next')}
            </Button>
          )}
        </StyledGettingStartedActions>
      </StyledGettingStartedSection>
      <div ref={trainingSectionRef}>
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
      {showSearchResults || showTopics ? (
        <StyledSection aria-labelledby={sectionHeadingId}>
          <StyledSectionTitle id={sectionHeadingId}>{t(sectionTitleKey)}</StyledSectionTitle>
          <StyledTopicList data-testid={TRAINING_HOME_TEST_IDS.popularTopics}>
            {listToShow.map((doc) => (
              <li key={`${doc.type}-${doc.id}`}>
                <TopicLink doc={doc} t={t} onNavigate={handleNavigateToTopic} />
              </li>
            ))}
          </StyledTopicList>
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
      </div>
    </StyledContainer>
  );
};

export default TrainingHomeScreenWeb;
