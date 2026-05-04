/**
 * useTopicListScreen
 * Shared logic for Topic list screen; delegates to useTrainingContent.
 */
import { useMemo, useState } from 'react';
import useTrainingContent from '@hooks/useTrainingContent';
import { TRAINING_DOC_TYPES } from '@features/training';

const TYPE_LABEL_KEYS = {
  [TRAINING_DOC_TYPES.protocol]: 'training.topics.typeProtocol',
  [TRAINING_DOC_TYPES.checklist]: 'training.topics.typeChecklist',
  [TRAINING_DOC_TYPES.glossary]: 'training.topics.typeGlossary',
  [TRAINING_DOC_TYPES.faq]: 'training.topics.typeFaq',
};

export default function useTopicListScreen() {
  const { topics, loadError, isLoading, searchQuery, setSearchQuery } = useTrainingContent({});
  const [typeFilter, setTypeFilter] = useState(null);

  const filteredTopics = useMemo(() => {
    let list = Array.isArray(topics) ? topics : [];
    if (typeFilter) {
      list = list.filter((doc) => doc?.type === typeFilter);
    }
    if (typeof searchQuery === 'string' && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (doc) =>
          (doc?.title ?? '').toLowerCase().includes(q) ||
          (doc?.body ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [topics, typeFilter, searchQuery]);

  const isEmpty = !isLoading && !loadError && filteredTopics.length === 0;

  return {
    topics: filteredTopics,
    loadError,
    isLoading,
    isEmpty,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    typeLabelKeys: TYPE_LABEL_KEYS,
  };
}
