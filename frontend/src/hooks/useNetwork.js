/**
 * useNetwork Hook
 * Provides network connectivity state
 * File: useNetwork.js
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectIsLowQuality,
  selectIsOffline,
  selectIsOnline,
  selectIsSyncing,
  selectNetworkQuality,
} from '@store/selectors';

const useNetwork = () => {
  const isOnline = useSelector(selectIsOnline);
  const isOffline = useSelector(selectIsOffline);
  const isSyncing = useSelector(selectIsSyncing);
  const networkQuality = useSelector(selectNetworkQuality);
  const isLowQuality = useSelector(selectIsLowQuality);

  return useMemo(
    () => ({
      isOnline,
      isOffline,
      isSyncing,
      networkQuality,
      isLowQuality,
    }),
    [isOnline, isOffline, isSyncing, networkQuality, isLowQuality]
  );
};

export default useNetwork;

