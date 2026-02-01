/**
 * useSessionGuard
 * Redirects to /assessment when no ventilation session exists.
 * Used by session route layout to guard recommendation/monitoring/case routes.
 */
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import {
  selectVentilationSessionId,
  selectVentilationHydrating,
} from '@store/selectors';

/**
 * @returns {{ hasSession: boolean, isReady: boolean }}
 */
export default function useSessionGuard() {
  const router = useRouter();
  const sessionId = useSelector(selectVentilationSessionId);
  const isHydrating = useSelector(selectVentilationHydrating);

  const hasSession = Boolean(sessionId?.trim());
  const isReady = !isHydrating;

  useEffect(() => {
    if (isReady && !hasSession) {
      router.replace('/assessment');
    }
  }, [hasSession, isReady, router]);

  return { hasSession, isReady };
}
