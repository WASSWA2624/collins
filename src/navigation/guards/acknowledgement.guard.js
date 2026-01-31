/**
 * Acknowledgement Guard Hook
 *
 * Enforces first-run acknowledgement of the prototype disclaimer.
 * Redirects to `/disclaimer` when not acknowledged.
 *
 * File: acknowledgement.guard.js
 */
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectDisclaimerAcknowledged } from '@store/selectors';

export function useAcknowledgementGuard(options = {}) {
  const { redirectPath = '/disclaimer', skipRedirect = false } = options;

  const router = useRouter();
  const acknowledged = Boolean(useSelector(selectDisclaimerAcknowledged));

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (skipRedirect) return;

    if (acknowledged) {
      hasRedirected.current = false;
      return;
    }

    if (!hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(redirectPath);
    }
  }, [acknowledged, redirectPath, router, skipRedirect]);

  return { acknowledged };
}

