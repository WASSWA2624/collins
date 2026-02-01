/**
 * useTrainingContent
 * Loads offline training content and search; delegates to training feature.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadTrainingContentUseCase, searchTrainingContentUseCase } from '@features/training';
import { buildTrainingDocuments, TRAINING_DOC_TYPES } from '@features/training';

function getTopicFromContent(content, topicId) {
  if (!content || typeof topicId !== 'string' || !topicId.trim()) return null;
  const id = topicId.trim();
  const ps = Array.isArray(content.protocolSections) ? content.protocolSections : [];
  const section = ps.find((s) => s?.id === id);
  if (section) return { type: TRAINING_DOC_TYPES.protocol, id: section.id, title: section.title, body: section.body, tags: section.tags, raw: section };

  const checklists = Array.isArray(content.checklists) ? content.checklists : [];
  const checklist = checklists.find((c) => c?.id === id);
  if (checklist) return { type: TRAINING_DOC_TYPES.checklist, id: checklist.id, title: checklist.title, items: checklist.items, tags: checklist.tags, raw: checklist };

  const glossary = Array.isArray(content.glossary) ? content.glossary : [];
  const entry = glossary.find((g) => g?.term === id);
  if (entry) return { type: TRAINING_DOC_TYPES.glossary, id: entry.term, title: entry.term, body: entry.definition, tags: entry.tags, raw: entry };

  const faqs = Array.isArray(content.faqs) ? content.faqs : [];
  const faq = faqs.find((f) => f?.id === id);
  if (faq) return { type: TRAINING_DOC_TYPES.faq, id: faq.id, title: faq.question, body: faq.answer, tags: faq.tags, raw: faq };

  return null;
}

export default function useTrainingContent(options = {}) {
  const { topicId = null } = options;
  const [content, setContent] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await loadTrainingContentUseCase();
      setContent(data);
    } catch (err) {
      setLoadError(err?.code ?? 'TRAINING_LOAD_ERROR');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const topics = useMemo(() => {
    if (!content) return [];
    return buildTrainingDocuments(content);
  }, [content]);

  const topic = useMemo(() => {
    if (!content || !topicId) return null;
    return getTopicFromContent(content, topicId);
  }, [content, topicId]);

  const search = useCallback(async (query) => {
    const q = typeof query === 'string' ? query : searchQuery;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return [];
    }
    setIsSearching(true);
    try {
      const results = await searchTrainingContentUseCase({ query: q, limit: 20 });
      setSearchResults(Array.isArray(results) ? results : []);
      return results;
    } catch {
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const popularTopics = useMemo(() => topics.slice(0, 6), [topics]);
  const quickChecklists = useMemo(() => {
    if (!content || !Array.isArray(content.checklists)) return [];
    return content.checklists.slice(0, 3);
  }, [content]);

  return {
    content,
    topics,
    topic,
    loadError,
    isLoading,
    searchQuery,
    setSearchQuery,
    searchResults,
    search,
    isSearching,
    popularTopics,
    quickChecklists,
    refetch: loadContent,
  };
}
