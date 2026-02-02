/**
 * useHelp (P013).
 * Searchable glossary, troubleshooting, guides; content from i18n.
 */
import { useMemo, useCallback, useState } from 'react';
import { searchHelp } from '@features/help';

export default function useHelp() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchHelp(query), [query]);

  const setSearchQuery = useCallback((q) => {
    setQuery(typeof q === 'string' ? q : '');
  }, []);

  const hasResults =
    results.glossary.length > 0 ||
    results.troubleshooting.length > 0 ||
    results.guides.length > 0;

  return useMemo(
    () => ({
      query,
      setSearchQuery,
      glossaryKeys: results.glossary,
      troubleshootingKeys: results.troubleshooting,
      guideKeys: results.guides,
      hasResults,
    }),
    [query, setSearchQuery, results, hasResults]
  );
}
