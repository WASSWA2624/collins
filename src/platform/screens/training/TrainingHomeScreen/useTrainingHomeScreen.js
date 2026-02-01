/**
 * useTrainingHomeScreen
 * Shared logic for Training home screen; delegates to useTrainingContent.
 */
import useTrainingContent from '@hooks/useTrainingContent';

export default function useTrainingHomeScreen() {
  const {
    content,
    topics,
    popularTopics,
    quickChecklists,
    loadError,
    isLoading,
    searchQuery,
    setSearchQuery,
    searchResults,
    search,
    isSearching,
    refetch,
  } = useTrainingContent({});

  const isEmpty = !isLoading && !loadError && Array.isArray(topics) && topics.length === 0;

  return {
    content,
    topics,
    popularTopics,
    quickChecklists,
    loadError,
    isLoading,
    isEmpty,
    searchQuery,
    setSearchQuery,
    searchResults,
    search,
    isSearching,
    refetch,
  };
}
