/**
 * useOnboarding (P013).
 * Exposes onboarding steps and current step navigation; content from i18n.
 */
import { useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  acknowledgeClinicalSafetyUseCase,
  getOnboardingSteps,
  getNextStepId,
  getPreviousStepId,
  isFirstStep,
  isLastStep,
  updateOnboardingStateUseCase,
} from '@features/onboarding';
import {
  selectClinicalSafetyAcknowledged,
  selectIsAuthenticated,
  selectUser,
} from '@store/selectors';
import { actions as uiActions } from '@store/slices/ui.slice';

const INITIAL_STEP = 'clinicalSafety';
const SERVER_COMPLETED_STEPS = Object.freeze([
  'WELCOME',
  'CLINICAL_SAFETY',
  'USER_SETUP',
  'FACILITY_SELECTION',
  'COMPLETED',
]);

export default function useOnboarding() {
  const dispatch = useDispatch();
  const clinicalSafetyAcknowledged = useSelector(selectClinicalSafetyAcknowledged);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [currentStepId, setCurrentStepId] = useState(INITIAL_STEP);
  const [isPersistingSafety, setIsPersistingSafety] = useState(false);
  const [syncErrorCode, setSyncErrorCode] = useState(null);

  const steps = useMemo(() => getOnboardingSteps(), []);
  const nextStepId = useMemo(() => getNextStepId(currentStepId), [currentStepId]);
  const prevStepId = useMemo(() => getPreviousStepId(currentStepId), [currentStepId]);
  const isFirst = useMemo(() => isFirstStep(currentStepId), [currentStepId]);
  const isLast = useMemo(() => isLastStep(currentStepId), [currentStepId]);

  const goNext = useCallback(() => {
    const next = getNextStepId(currentStepId);
    if (next) setCurrentStepId(next);
  }, [currentStepId]);

  const goBack = useCallback(() => {
    const prev = getPreviousStepId(currentStepId);
    if (prev) setCurrentStepId(prev);
  }, [currentStepId]);

  const setClinicalSafetyAcknowledged = useCallback(
    async (acknowledged) => {
      const nextValue = Boolean(acknowledged);
      dispatch(uiActions.setClinicalSafetyAcknowledged(nextValue));
      setSyncErrorCode(null);

      if (!nextValue || !isAuthenticated) return;

      setIsPersistingSafety(true);
      try {
        await acknowledgeClinicalSafetyUseCase();
      } catch {
        setSyncErrorCode('ONBOARDING_ACK_SYNC_FAILED');
      } finally {
        setIsPersistingSafety(false);
      }
    },
    [dispatch, isAuthenticated]
  );

  const completeOnboarding = useCallback(async () => {
    if (!clinicalSafetyAcknowledged) return false;

    dispatch(uiActions.completeOnboarding());

    const selectedFacilityId = user?.activeFacility?.facilityId || user?.activeFacility?.id || null;
    if (isAuthenticated && selectedFacilityId) {
      try {
        await updateOnboardingStateUseCase({
          currentStep: 'COMPLETED',
          completedSteps: SERVER_COMPLETED_STEPS,
          selectedFacilityId,
        });
      } catch {
        setSyncErrorCode('ONBOARDING_STATE_SYNC_FAILED');
      }
    }

    return true;
  }, [clinicalSafetyAcknowledged, dispatch, isAuthenticated, user]);

  return useMemo(
    () => ({
      steps,
      currentStepId,
      nextStepId,
      prevStepId,
      isFirst,
      isLast,
      clinicalSafetyAcknowledged,
      isPersistingSafety,
      syncErrorCode,
      canComplete: clinicalSafetyAcknowledged,
      goNext,
      goBack,
      setClinicalSafetyAcknowledged,
      completeOnboarding,
    }),
    [
      steps,
      currentStepId,
      nextStepId,
      prevStepId,
      isFirst,
      isLast,
      clinicalSafetyAcknowledged,
      isPersistingSafety,
      syncErrorCode,
      goNext,
      goBack,
      setClinicalSafetyAcknowledged,
      completeOnboarding,
    ]
  );
}
