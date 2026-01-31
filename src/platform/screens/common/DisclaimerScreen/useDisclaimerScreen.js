/**
 * useDisclaimerScreen
 * Shared logic for DisclaimerScreen.
 * File: useDisclaimerScreen.js
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '@store/slices/ui.slice';
import { selectDisclaimerAcknowledged } from '@store/selectors';

export default function useDisclaimerScreen() {
  const dispatch = useDispatch();
  const acknowledged = Boolean(useSelector(selectDisclaimerAcknowledged));

  const handleAcknowledge = useCallback(() => {
    dispatch(actions.setDisclaimerAcknowledged(true));
  }, [dispatch]);

  return { acknowledged, handleAcknowledge };
}

