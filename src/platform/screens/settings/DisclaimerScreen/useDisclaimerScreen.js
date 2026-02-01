/**
 * useDisclaimerScreen
 * Shared logic: intendedUse from dataset, acknowledgement via store + storage.
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const acknowledged = useSelector(selectDisclaimerAcknowledged);
  const dataset = getDefaultVentilationDataset();
  const intendedUse = useMemo(
    () => getVentilationDatasetIntendedUse(dataset),
    [dataset]
  );

  const acknowledge = useCallback(() => {
    dispatch(actions.setDisclaimerAcknowledged(true));
    void asyncStorage.setItem(STORAGE_KEY, 'true');
  }, [dispatch]);

  return useMemo(
    () => ({
      testIds: DISCLAIMER_TEST_IDS,
      intendedUse,
      acknowledged,
      acknowledge,
    }),
    [intendedUse, acknowledged, acknowledge]
  );
}
