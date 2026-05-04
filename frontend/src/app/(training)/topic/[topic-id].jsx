/**
 * Topic Detail Route
 * (training)/topic/[topic-id] - 11.S.9 Topic detail
 */
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TopicDetailScreen } from '@platform/screens';

export default function TopicDetailRoute() {
  const { 'topic-id': topicId } = useLocalSearchParams();
  return <TopicDetailScreen topicId={topicId} />;
}
