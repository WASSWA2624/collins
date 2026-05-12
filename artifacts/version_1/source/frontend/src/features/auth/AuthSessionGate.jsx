/**
 * AuthSessionGate
 * Starts session restoration and listens for API-layer session expiry.
 * File: AuthSessionGate.jsx
 */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as authActions } from '@store/slices/auth.slice';
import { actions as uiActions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import { loadMySettingsUseCase } from '@features/settings';
import { subscribeAuthSessionExpired } from './session.events';

const THEME_PREFERENCES = new Set(['system', 'light', 'dark', 'high-contrast']);

const AuthSessionGate = ({ children }) => {
  const dispatch = useDispatch();
  const hasRestoredSession = useSelector((state) => state?.auth?.hasRestoredSession ?? false);
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated ?? false);
  const sessionStatus = useSelector((state) => state?.auth?.sessionStatus ?? 'idle');
  const userId = useSelector((state) => state?.auth?.user?.id ?? null);
  const appliedSettingsUserRef = useRef(null);

  useEffect(() => {
    if (!hasRestoredSession && sessionStatus !== 'restoring') {
      void dispatch(authActions.restoreSession());
    }
  }, [dispatch, hasRestoredSession, sessionStatus]);

  useEffect(() => {
    const unsubscribe = subscribeAuthSessionExpired((payload) => {
      dispatch(authActions.markSessionExpired(payload));
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      appliedSettingsUserRef.current = null;
      return undefined;
    }

    if (appliedSettingsUserRef.current === userId) return undefined;
    appliedSettingsUserRef.current = userId;

    let cancelled = false;

    const applyServerDisplayPreferences = async () => {
      try {
        const settings = await loadMySettingsUseCase();
        const themePreference = settings?.displayPreferences?.themePreference;
        if (!cancelled && THEME_PREFERENCES.has(themePreference)) {
          dispatch(uiActions.setTheme(themePreference));
          void asyncStorage.setItem('theme_preference', themePreference);
        }
      } catch {
        // Settings startup sync is non-critical; the persisted local theme remains active.
      }
    };

    void applyServerDisplayPreferences();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated, userId]);

  return children;
};

export default AuthSessionGate;
