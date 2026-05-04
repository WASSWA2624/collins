/**
 * useNetworkBanner Hook
 * Provides transient online banner visibility on reconnect.
 * File: useNetworkBanner.js
 */
import { useEffect, useRef, useState } from 'react';
import useNetwork from './useNetwork';

const DEFAULT_ONLINE_DURATION = 4000;

const useNetworkBanner = ({ duration = DEFAULT_ONLINE_DURATION } = {}) => {
  const { isOnline, isOffline, isLowQuality, networkQuality } = useNetwork();
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const timeoutRef = useRef(null);
  const wasOnlineRef = useRef(isOnline);

  useEffect(() => {
    if (isOnline && !wasOnlineRef.current) {
      setShowOnlineBanner(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowOnlineBanner(false);
        timeoutRef.current = null;
      }, duration);
    }

    if (!isOnline) {
      setShowOnlineBanner(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    wasOnlineRef.current = isOnline;
  }, [duration, isOnline]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isOnline,
    isOffline,
    isLowQuality,
    networkQuality,
    showOnlineBanner,
  };
};

export default useNetworkBanner;
