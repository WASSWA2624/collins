/**
 * useUiState Hook
 * Provides global UI state flags for shell utilities.
 * File: useUiState.js
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectFooterVisible,
  selectHeaderActionVisibility,
  selectIsHeaderHidden,
  selectIsLoading,
  selectIsSidebarCollapsed,
  selectSidebarWidth,
} from '@store/selectors';

const useUiState = () => {
  const isLoading = useSelector(selectIsLoading);
  const sidebarWidth = useSelector(selectSidebarWidth);
  const isSidebarCollapsed = useSelector(selectIsSidebarCollapsed);
  const isHeaderHidden = useSelector(selectIsHeaderHidden);
  const headerActionVisibility = useSelector(selectHeaderActionVisibility);
  const footerVisible = useSelector(selectFooterVisible);

  return useMemo(
    () => ({
      isLoading,
      sidebarWidth,
      isSidebarCollapsed,
      isHeaderHidden,
      headerActionVisibility,
      footerVisible,
    }),
    [footerVisible, headerActionVisibility, isHeaderHidden, isLoading, sidebarWidth, isSidebarCollapsed]
  );
};

export default useUiState;
