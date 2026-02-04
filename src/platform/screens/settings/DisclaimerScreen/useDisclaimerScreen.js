/**
 * useDisclaimerScreen
 * Shared logic: intendedUse from dataset, acknowledgement via store + storage.
 */
import { useCallback, useMemo } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import {
  getDefaultVentilationDataset,
  getVentilationDatasetIntendedUse,
} from '@features/ventilation/ventilation.model';
import { selectDisclaimerAcknowledged } from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import { DISCLAIMER_TEST_IDS } from './types';

const STORAGE_KEY = 'disclaimer_acknowledged';

export default function useDisclaimerScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const acknowledged = useSelector(selectDisclaimerAcknowledged);
  const dataset = getDefaultVentilationDataset();
  const intendedUse = useMemo(
    () => getVentilationDatasetIntendedUse(dataset),
    [dataset]
  );

  const acknowledge = useCallback(() => {
    dispatch(actions.setDisclaimerAcknowledged(true));
    void asyncStorage.setItem(STORAGE_KEY, 'true');
    router.replace('/(main)');
  }, [dispatch, router]);

  const decline = useCallback(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      BackHandler.exitApp();
    }
    // Web: no exit; user can close the tab
  }, []);

  return useMemo(
    () => ({
      testIds: DISCLAIMER_TEST_IDS,
      intendedUse,
      acknowledged,
      acknowledge,
      decline,
    }),
    [intendedUse, acknowledged, acknowledge, decline]
  );
}
