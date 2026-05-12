/**
 * AppFrame Hook
 * Shared slot visibility logic for AppFrame
 * File: useAppFrame.js
 */

import { useMemo } from 'react';

const useAppFrame = ({ header, footer, sidebar, breadcrumbs, overlay, banner }) => {
  return useMemo(() => {
    return {
      hasHeader: Boolean(header),
      hasFooter: Boolean(footer),
      hasSidebar: Boolean(sidebar),
      hasBreadcrumbs: Boolean(breadcrumbs),
      hasOverlay: Boolean(overlay),
      hasBanner: Boolean(banner),
    };
  }, [banner, breadcrumbs, footer, header, overlay, sidebar]);
};

export default useAppFrame;
