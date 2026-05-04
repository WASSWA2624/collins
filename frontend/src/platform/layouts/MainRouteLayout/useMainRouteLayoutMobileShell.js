/**
 * useMainRouteLayoutMobileShell
 * Mobile-only state for sidebar drawer (open/close).
 */
import { useCallback, useState } from 'react';

export default function useMainRouteLayoutMobileShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return { sidebarOpen, toggleSidebar, closeSidebar };
}
