/**
 * useMainRouteLayoutWebShell
 * Web-only shell state for the main route layout (sidebar collapse + resize).
 * Sidebar size and collapsed state are persisted via Redux (ui slice) and storage across sessions.
 * File: useMainRouteLayoutWebShell.js
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsSidebarCollapsed, selectSidebarWidth } from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'sidebar_collapsed';

const DEFAULT_SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 64;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 480;
const KEYBOARD_STEP = 16;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function useMainRouteLayoutWebShell() {
  const dispatch = useDispatch();
  const rawWidth = useSelector(selectSidebarWidth);
  const sidebarCollapsed = useSelector(selectIsSidebarCollapsed);
  const sidebarWidth = useMemo(
    () => clamp(rawWidth ?? DEFAULT_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH, MAX_SIDEBAR_WIDTH),
    [rawWidth]
  );

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

  const onPointerMove = useCallback(
    (e) => {
      const state = dragStateRef.current;
      if (!state.dragging) return;
      const clientX = e?.clientX ?? 0;
      const next = clamp(
        state.startWidth + (clientX - state.startClientX),
        MIN_SIDEBAR_WIDTH,
        MAX_SIDEBAR_WIDTH
      );
      dispatch(actions.setSidebarWidth(next));
    },
    [dispatch]
  );

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
      dispatch(actions.setSidebarWidth(clamp(sidebarWidth + delta, MIN_SIDEBAR_WIDTH, MAX_SIDEBAR_WIDTH)));
    },
    [dispatch, sidebarCollapsed, sidebarWidth]
  );

  const toggleSidebar = useCallback(() => {
    const nextCollapsed = !sidebarCollapsed;
    dispatch(actions.setSidebarCollapsed(nextCollapsed));
    void asyncStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(nextCollapsed));
    endDrag();
  }, [dispatch, endDrag, sidebarCollapsed]);

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

