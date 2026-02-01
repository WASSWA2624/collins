/**
 * TopicListScreen Component - Web
 * File: TopicListScreen.web.jsx
 */
import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useTopicListScreen from './useTopicListScreen';
import {
  StyledContainer,
  StyledEmpty,
  StyledErrorBanner,
  StyledItem,
  StyledItemLink,
  StyledList,
  StyledSearchWrap,
} from './TopicListScreen.web.styles';
import { TOPIC_LIST_TEST_IDS } from './types';

const TopicListScreenWeb = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    topics,
    loadError,
    isLoading,
    isEmpty,
    searchQuery,
    setSearchQuery,
  } = useTopicListScreen();

  const handleOpenTopic = useCallback(
    (topicId) => {
      if (topicId) router.push(`/topic/${encodeURIComponent(topicId)}`);
    },
    [router]
  );

  if (isLoading) {
    return (
      <StyledContainer aria-label={t('training.topics.accessibilityLabel')} data-testid={TOPIC_LIST_TEST_IDS.screen}>
        <Text>{t('training.topics.states.loading')}</Text>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      aria-label={t('training.topics.accessibilityLabel')}
      data-testid={TOPIC_LIST_TEST_IDS.screen}
      role="main"
    >
      {loadError ? (
        <StyledErrorBanner data-testid={TOPIC_LIST_TEST_IDS.errorBanner}>
          <Text variant="body" color="status.error.text">{t('training.topics.states.error')}</Text>
        </StyledErrorBanner>
      ) : null}
      <StyledSearchWrap>
        <TextField
          label={t('training.topics.searchPlaceholder')}
          placeholder={t('training.topics.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel={t('training.topics.searchHint')}
          testID={TOPIC_LIST_TEST_IDS.search}
        />
      </StyledSearchWrap>
      {isEmpty ? (
        <StyledEmpty data-testid={TOPIC_LIST_TEST_IDS.empty}>
          <Text variant="body">{t('training.topics.empty')}</Text>
        </StyledEmpty>
      ) : (
        <StyledList aria-label={t('training.topics.title')} data-testid={TOPIC_LIST_TEST_IDS.list} role="list">
          {topics.map((doc) => (
            <StyledItem
              key={`${doc.type}-${doc.id}`}
              data-testid={`${TOPIC_LIST_TEST_IDS.item}-${doc?.id ?? ''}`}
              role="listitem"
            >
              <StyledItemLink
                href={`/topic/${encodeURIComponent(doc?.id ?? '')}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenTopic(doc?.id);
                }}
                aria-label={t('training.topics.openTopicHint')}
              >
                <Text variant="body">{doc?.title ?? doc?.id ?? ''}</Text>
              </StyledItemLink>
            </StyledItem>
          ))}
        </StyledList>
      )}
    </StyledContainer>
  );
};

export default TopicListScreenWeb;
