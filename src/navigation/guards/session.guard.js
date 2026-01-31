/**
 * Session Guard Hook
 *
 * Prevents navigation to session-required routes when a "current session"
 * is missing. Redirects to `/assessment` by default (route to be implemented later).
 *
 * File: session.guard.js
 */
import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectHasCurrentSession } from '@store/selectors';

export function useSessionGuard(options = {}) {
  const { redirectPath = '/assessment', skipRedirect = false } = options;

  const router = useRouter();
  const hasSession = Boolean(useSelector(selectHasCurrentSession));

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (skipRedirect) return;

    if (hasSession) {
      hasRedirected.current = false;
      return;
    }

    if (!hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(redirectPath);
    }
  }, [hasSession, redirectPath, router, skipRedirect]);

  return useMemo(() => ({ hasSession }), [hasSession]);
}

