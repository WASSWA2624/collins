/**
 * useDatabaseHealth Hook
 * Monitors backend database connectivity via health endpoint.
 * File: useDatabaseHealth.js
 */
import { useCallback, useEffect, useState } from 'react';
import { endpoints } from '@config';
import useNetwork from './useNetwork';

const HEALTH_POLL_MS = 30000;

const useDatabaseHealth = () => {
  const { isOffline } = useNetwork();
  const [isConnected, setIsConnected] = useState(true);

  const check = useCallback(async () => {
    if (typeof fetch === 'undefined') return;
    const url = endpoints.HEALTH;
    try {
      const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) });
      const ok = res.ok;
      const data = res.ok && res.headers.get('content-type')?.includes('json') ? await res.json() : {};
      const dbOk = data?.database === 'ok' || data?.database === true || (ok && typeof data.database === 'undefined');
      setIsConnected(ok && (dbOk || typeof data.database === 'undefined'));
    } catch {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (isOffline) {
      setIsConnected(false);
      return;
    }
    check();
    const id = setInterval(check, HEALTH_POLL_MS);
    return () => clearInterval(id);
  }, [isOffline, check]);

  return { isConnected };
};

export default useDatabaseHealth;
