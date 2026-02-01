/**
 * useTopicDetailScreen
 * Shared logic for Topic detail screen; delegates to useTrainingContent.
 */
import { useMemo, useState, useCallback } from 'react';
import useTrainingContent from '@hooks/useTrainingContent';

export default function useTopicDetailScreen(topicId) {
  const { topic, content, loadError, isLoading } = useTrainingContent({ topicId });
  const [expandedSections, setExpandedSections] = useState(new Set(['main', 'checklist']));

  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  }, []);

  const sections = useMemo(() => {
    if (!topic) return [];
    const out = [];
    if (topic.body) out.push({ key: 'main', title: null, content: topic.body });
    if (Array.isArray(topic.items) && topic.items.length > 0) {
      out.push({
        key: 'checklist',
        title: topic.title,
        content: null,
        items: topic.items,
      });
    }
    return out;
  }, [topic]);

  const notFound = !isLoading && !loadError && !topic && topicId;

  return {
    topic,
    content,
    loadError,
    isLoading,
    notFound,
    sections,
    expandedSections,
    toggleSection,
  };
}
