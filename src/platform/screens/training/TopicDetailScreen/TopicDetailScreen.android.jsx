/**
 * TopicDetailScreen Component - Android
 * File: TopicDetailScreen.android.jsx
 */
import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useTopicDetailScreen from './useTopicDetailScreen';
import {
  StyledContainer,
  StyledErrorBanner,
  StyledHeader,
  StyledScroll,
  StyledSection,
  StyledSectionContent,
  StyledChecklistItem,
} from './TopicDetailScreen.android.styles';
import { TOPIC_DETAIL_TEST_IDS } from './types';

const TopicDetailScreenAndroid = ({ topicId }) => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    topic,
    loadError,
    isLoading,
    notFound,
    sections,
    expandedSections,
    toggleSection,
  } = useTopicDetailScreen(topicId);

  const handleBack = useCallback(() => router.push('/topics'), [router]);

  if (isLoading) {
    return (
      <StyledContainer accessibilityLabel={t('training.topicDetail.accessibilityLabel')} testID={TOPIC_DETAIL_TEST_IDS.screen}>
        <Text>{t('training.topicDetail.states.loading')}</Text>
      </StyledContainer>
    );
  }

  if (notFound || !topic) {
    return (
      <StyledContainer
        accessibilityLabel={t('training.topicDetail.accessibilityLabel')}
        testID={TOPIC_DETAIL_TEST_IDS.screen}
      >
        <Button
          variant="outline"
          onPress={handleBack}
          accessibilityLabel={t('training.topicDetail.backToTopicsHint')}
          testID={TOPIC_DETAIL_TEST_IDS.backButton}
        >
          {t('training.topicDetail.backToTopics')}
        </Button>
        <Text variant="body" testID={TOPIC_DETAIL_TEST_IDS.notFound}>
          {t('training.topicDetail.notFound')}
        </Text>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      accessibilityLabel={t('training.topicDetail.accessibilityLabel')}
      testID={TOPIC_DETAIL_TEST_IDS.screen}
    >
      <StyledScroll>
        {loadError ? (
          <StyledErrorBanner testID={TOPIC_DETAIL_TEST_IDS.errorBanner}>
            <Text variant="body" color="status.error.text">{t('training.topicDetail.states.error')}</Text>
          </StyledErrorBanner>
        ) : null}
        <StyledHeader>
          <Button
            variant="outline"
            onPress={handleBack}
            accessibilityLabel={t('training.topicDetail.backToTopicsHint')}
            testID={TOPIC_DETAIL_TEST_IDS.backButton}
          >
            {t('training.topicDetail.backToTopics')}
          </Button>
        </StyledHeader>
        <Text variant="label" testID={TOPIC_DETAIL_TEST_IDS.title}>
          {topic.title ?? topic.id ?? ''}
        </Text>
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.key);
          return (
            <StyledSection key={section.key} testID={`${TOPIC_DETAIL_TEST_IDS.section}-${section.key}`}>
              {section.title ? (
                <TouchableOpacity
                  onPress={() => toggleSection(section.key)}
                  accessibilityLabel={isExpanded ? t('training.topicDetail.collapse') : t('training.topicDetail.expand')}
                  accessibilityRole="button"
                  testID={TOPIC_DETAIL_TEST_IDS.collapse}
                >
                  <Text variant="label">{section.title}</Text>
                  <Text variant="caption">{isExpanded ? t('training.topicDetail.collapse') : t('training.topicDetail.expand')}</Text>
                </TouchableOpacity>
              ) : null}
              {isExpanded ? (
                <StyledSectionContent>
                  {section.content ? (
                    <Text variant="body" testID={TOPIC_DETAIL_TEST_IDS.body}>
                      {section.content}
                    </Text>
                  ) : null}
                  {Array.isArray(section.items)
                    ? section.items.map((item, idx) => (
                        <StyledChecklistItem key={item?.id ?? idx} testID={`${TOPIC_DETAIL_TEST_IDS.checklistItem}-${idx}`}>
                          <Text variant="body">{item?.text ?? ''}</Text>
                        </StyledChecklistItem>
                      ))
                    : null}
                </StyledSectionContent>
              ) : null}
            </StyledSection>
          );
        })}
      </StyledScroll>
    </StyledContainer>
  );
};

export default TopicDetailScreenAndroid;
