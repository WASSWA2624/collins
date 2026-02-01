/**
 * TopicListScreen Component - iOS
 * File: TopicListScreen.ios.jsx
 */
import React, { useCallback } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useTopicListScreen from './useTopicListScreen';
import {
  StyledContainer,
  StyledEmpty,
  StyledErrorBanner,
  StyledItem,
  StyledSearchWrap,
} from './TopicListScreen.ios.styles';
import { TOPIC_LIST_TEST_IDS } from './types';

const TopicListScreenIos = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { topics, loadError, isLoading, isEmpty, searchQuery, setSearchQuery } = useTopicListScreen();

  const handleOpenTopic = useCallback(
    (topicId) => {
      if (topicId) router.push(`/topic/${encodeURIComponent(topicId)}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handleOpenTopic(item?.id)}
        accessibilityLabel={t('training.topics.openTopicHint')}
        testID={`${TOPIC_LIST_TEST_IDS.item}-${item?.id ?? ''}`}
      >
        <StyledItem>
          <Text variant="body">{item?.title ?? item?.id ?? ''}</Text>
        </StyledItem>
      </TouchableOpacity>
    ),
    [handleOpenTopic, t]
  );

  if (isLoading) {
    return (
      <StyledContainer accessibilityLabel={t('training.topics.accessibilityLabel')} testID={TOPIC_LIST_TEST_IDS.screen}>
        <Text>{t('training.topics.states.loading')}</Text>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      accessibilityLabel={t('training.topics.accessibilityLabel')}
      testID={TOPIC_LIST_TEST_IDS.screen}
    >
      {loadError ? (
        <StyledErrorBanner testID={TOPIC_LIST_TEST_IDS.errorBanner}>
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
        <StyledEmpty testID={TOPIC_LIST_TEST_IDS.empty}>
          <Text variant="body">{t('training.topics.empty')}</Text>
        </StyledEmpty>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => `${item?.type}-${item?.id}`}
          renderItem={renderItem}
          testID={TOPIC_LIST_TEST_IDS.list}
          listKey="topic-list"
        />
      )}
    </StyledContainer>
  );
};

export default TopicListScreenIos;
