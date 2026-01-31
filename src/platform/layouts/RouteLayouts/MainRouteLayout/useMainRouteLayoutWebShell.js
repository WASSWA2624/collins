/**
 * useMainRouteLayoutWebShell
 * Web-only shell state for the main route layout (sidebar collapse + resize).
 * File: useMainRouteLayoutWebShell.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 64;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 480;
const KEYBOARD_STEP = 16;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function useMainRouteLayoutWebShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  const dragStateRef = useRef({
    dragging: false,
    startClientX: 0,
    startWidth: DEFAULT_SIDEBAR_WIDTH,
    previousUserSelect: '',
  });

  const endDrag = useCallback(() => {
    const state = dragStateRef.current;
    if (!state.dragging) return;
    state.dragging = false;

    if (typeof document !== 'undefined' && document?.body?.style) {
      document.body.style.userSelect = state.previousUserSelect || '';
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    const state = dragStateRef.current;
    if (!state.dragging) return;
    const clientX = e?.clientX ?? 0;
    const next = clamp(state.startWidth + (clientX - state.startClientX), MIN_SIDEBAR_WIDTH, MAX_SIDEBAR_WIDTH);
    setSidebarWidth(next);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (typeof window.addEventListener !== 'function' || typeof window.removeEventListener !== 'function') {
      return undefined;
    }

    const handlePointerUp = () => endDrag();
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [endDrag, onPointerMove]);

  const startResize = useCallback(
    (e) => {
      if (sidebarCollapsed) return;
      const clientX = e?.clientX ?? 0;
      const state = dragStateRef.current;

      state.dragging = true;
      state.startClientX = clientX;
      state.startWidth = sidebarWidth;
      state.previousUserSelect = typeof document !== 'undefined' ? document?.body?.style?.userSelect || '' : '';

      if (typeof document !== 'undefined' && document?.body?.style) {
        document.body.style.userSelect = 'none';
      }

      e?.preventDefault?.();
    },
    [sidebarCollapsed, sidebarWidth]
  );

  const onResizerKeyDown = useCallback(
    (e) => {
      if (sidebarCollapsed) return;
      const key = e?.key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;

      e?.preventDefault?.();
      const delta = key === 'ArrowLeft' ? -KEYBOARD_STEP : KEYBOARD_STEP;
      setSidebarWidth((prev) => clamp(prev + delta, MIN_SIDEBAR_WIDTH, MAX_SIDEBAR_WIDTH));
    },
    [sidebarCollapsed]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
    endDrag();
  }, [endDrag]);

  const resizerProps = useMemo(
    () => ({
      onPointerDown: startResize,
      onKeyDown: onResizerKeyDown,
    }),
    [onResizerKeyDown, startResize]
  );

  return {
    sidebarCollapsed,
    sidebarWidth,
    collapsedWidth: COLLAPSED_WIDTH,
    toggleSidebar,
    resizerProps,
  };
}

