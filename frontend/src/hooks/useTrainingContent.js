/**
 * useTrainingContent
 * Loads offline training content and search; delegates to training feature.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadTrainingContentUseCase, searchTrainingContentUseCase } from '@features/training';
import { buildTrainingDocuments, isTrainingAudienceVisible, TRAINING_DOC_TYPES } from '@features/training';
import useAuth from './useAuth';

function getTopicFromContent(content, topicId, options = {}) {
  if (!content || typeof topicId !== 'string' || !topicId.trim()) return null;
  const id = topicId.trim();

  const remoteTopics = Array.isArray(content.topics) ? content.topics : [];
  const remoteTopic = remoteTopics.find((s) => s?.id === id && isTrainingAudienceVisible(s, options.roles));
  if (remoteTopic) {
    return {
      type: TRAINING_DOC_TYPES.protocol,
      id: remoteTopic.id,
      title: remoteTopic.title,
      body: remoteTopic.body,
      summary: remoteTopic.summary,
      workflow: remoteTopic.workflow,
      tags: remoteTopic.tags,
      raw: remoteTopic,
    };
  }

  const ps = Array.isArray(content.protocolSections) ? content.protocolSections : [];
  const section = ps.find((s) => s?.id === id && isTrainingAudienceVisible(s, options.roles));
  if (section) {
    return {
      type: TRAINING_DOC_TYPES.protocol,
      id: section.id,
      title: section.title,
      body: section.body,
      summary: section.summary,
      workflow: section.workflow,
      tags: section.tags,
      raw: section,
    };
  }

  const checklists = Array.isArray(content.checklists) ? content.checklists : [];
  const checklist = checklists.find((c) => c?.id === id && isTrainingAudienceVisible(c, options.roles));
  if (checklist) {
    return {
      type: TRAINING_DOC_TYPES.checklist,
      id: checklist.id,
      title: checklist.title,
      workflow: checklist.workflow,
      items: checklist.items,
      tags: checklist.tags,
      raw: checklist,
    };
  }

  const glossary = Array.isArray(content.glossary) ? content.glossary : [];
  const entry = glossary.find((g) => g?.term === id && isTrainingAudienceVisible(g, options.roles));
  if (entry) {
    return {
      type: TRAINING_DOC_TYPES.glossary,
      id: entry.term,
      title: entry.term,
      workflow: entry.workflow,
      body: entry.definition,
      tags: entry.tags,
      raw: entry,
    };
  }

  const faqs = Array.isArray(content.faqs) ? content.faqs : [];
  const faq = faqs.find((f) => f?.id === id && isTrainingAudienceVisible(f, options.roles));
  if (faq) {
    return {
      type: TRAINING_DOC_TYPES.faq,
      id: faq.id,
      title: faq.question,
      workflow: faq.workflow,
      body: faq.answer,
      tags: faq.tags,
      raw: faq,
    };
  }

  return null;
}

export default function useTrainingContent(options = {}) {
  const { topicId = null, roles = null, workflow = null } = options;
  const auth = useAuth();
  const effectiveRoles = roles ?? auth.roles ?? [];
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
    return buildTrainingDocuments(content, { roles: effectiveRoles, workflow });
  }, [content, effectiveRoles, workflow]);

  const topic = useMemo(() => {
    if (!content || !topicId) return null;
    return getTopicFromContent(content, topicId, { roles: effectiveRoles });
  }, [content, topicId, effectiveRoles]);

  const search = useCallback(async (query) => {
    const q = typeof query === 'string' ? query : searchQuery;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return [];
    }
    setIsSearching(true);
    try {
      const results = await searchTrainingContentUseCase({
        query: q,
        roles: effectiveRoles,
        workflow,
        limit: 20,
      });
      setSearchResults(Array.isArray(results) ? results : []);
      return results;
    } catch {
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [effectiveRoles, searchQuery, workflow]);

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
