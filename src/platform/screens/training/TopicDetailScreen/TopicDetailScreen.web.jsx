/**
 * TopicDetailScreen Component - Web
 * File: TopicDetailScreen.web.jsx
 */
import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Button, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useTopicDetailScreen from './useTopicDetailScreen';
import {
  StyledContainer,
  StyledErrorBanner,
  StyledHeader,
  StyledSection,
  StyledSectionContent,
  StyledSectionHeader,
  StyledTopicTitle,
  StyledChecklistItem,
} from './TopicDetailScreen.web.styles';
import { TOPIC_DETAIL_TEST_IDS } from './types';

const TopicDetailScreenWeb = ({ topicId }) => {
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
      <StyledContainer aria-label={t('training.topicDetail.accessibilityLabel')} data-testid={TOPIC_DETAIL_TEST_IDS.screen}>
        <Text>{t('training.topicDetail.states.loading')}</Text>
      </StyledContainer>
    );
  }

  if (notFound || !topic) {
    return (
      <StyledContainer
        aria-label={t('training.topicDetail.accessibilityLabel')}
        data-testid={TOPIC_DETAIL_TEST_IDS.screen}
        role="main"
      >
        <Button
          variant="outline"
          onPress={handleBack}
          accessibilityLabel={t('training.topicDetail.backToTopicsHint')}
          data-testid={TOPIC_DETAIL_TEST_IDS.backButton}
        >
          {t('training.topicDetail.backToTopics')}
        </Button>
        <div data-testid={TOPIC_DETAIL_TEST_IDS.notFound}>
          <Text variant="body">{t('training.topicDetail.notFound')}</Text>
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      aria-label={t('training.topicDetail.accessibilityLabel')}
      data-testid={TOPIC_DETAIL_TEST_IDS.screen}
      role="main"
    >
      {loadError ? (
        <StyledErrorBanner data-testid={TOPIC_DETAIL_TEST_IDS.errorBanner}>
          <Text variant="body" color="status.error.text">{t('training.topicDetail.states.error')}</Text>
        </StyledErrorBanner>
      ) : null}
      <StyledHeader>
        <Button
          variant="outline"
          onPress={handleBack}
          accessibilityLabel={t('training.topicDetail.backToTopicsHint')}
          data-testid={TOPIC_DETAIL_TEST_IDS.backButton}
        >
          {t('training.topicDetail.backToTopics')}
        </Button>
      </StyledHeader>
      <StyledTopicTitle data-testid={TOPIC_DETAIL_TEST_IDS.title}>
        {topic.title ?? topic.id ?? ''}
      </StyledTopicTitle>
      {sections.map((section) => {
        const isExpanded = expandedSections.has(section.key);
        return (
          <StyledSection key={section.key} data-testid={`${TOPIC_DETAIL_TEST_IDS.section}-${section.key}`}>
            {section.title ? (
              <StyledSectionHeader
                type="button"
                onClick={() => toggleSection(section.key)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? t('training.topicDetail.collapse') : t('training.topicDetail.expand')}
                data-testid={TOPIC_DETAIL_TEST_IDS.collapse}
              >
                <Text variant="label">{section.title}</Text>
                <Text variant="caption">{isExpanded ? t('training.topicDetail.collapse') : t('training.topicDetail.expand')}</Text>
              </StyledSectionHeader>
            ) : null}
            {isExpanded ? (
              <StyledSectionContent>
                {section.content ? (
                  <Text variant="body" data-testid={TOPIC_DETAIL_TEST_IDS.body}>
                    {section.content}
                  </Text>
                ) : null}
                {Array.isArray(section.items)
                  ? (
                    <ul>
                      {section.items.map((item, idx) => (
                        <StyledChecklistItem
                          key={item?.id ?? idx}
                          data-testid={`${TOPIC_DETAIL_TEST_IDS.checklistItem}-${idx}`}
                        >
                          <Text variant="body">{item?.text ?? ''}</Text>
                        </StyledChecklistItem>
                      ))}
                    </ul>
                  )
                  : null}
              </StyledSectionContent>
            ) : null}
          </StyledSection>
        );
      })}
    </StyledContainer>
  );
};

export default TopicDetailScreenWeb;
