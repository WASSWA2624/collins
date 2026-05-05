/**
 * Onboarding use cases.
 * Returns steps for UI and persists setup metadata when available.
 */
import { handleError } from '@errors';
import { getOnboardingStepOrder } from './onboarding.rules';
import {
  acknowledgeClinicalSafetyApi,
  getOnboardingConfigApi,
  getOnboardingStateApi,
  updateOnboardingStateApi,
} from './onboarding.api';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const unwrap = (res) => res?.data?.data ?? res?.data;

const getOnboardingSteps = () => {
  const order = getOnboardingStepOrder();
  return order.map((id, index) => ({ id, order: index }));
};

const getOnboardingStepIds = () => getOnboardingSteps().map((s) => s.id);

const getOnboardingConfigUseCase = async () =>
  execute(async () => unwrap(await getOnboardingConfigApi()) ?? null);

const getOnboardingStateUseCase = async () =>
  execute(async () => unwrap(await getOnboardingStateApi())?.state ?? null);

const updateOnboardingStateUseCase = async (payload) =>
  execute(async () => unwrap(await updateOnboardingStateApi(payload))?.state ?? null);

const acknowledgeClinicalSafetyUseCase = async ({ deviceId } = {}) =>
  execute(async () => {
    const response = await acknowledgeClinicalSafetyApi({
      acknowledged: true,
      clientAcknowledgedAt: new Date().toISOString(),
      ...(deviceId ? { deviceId } : {}),
    });
    return unwrap(response) ?? null;
  });

export {
  acknowledgeClinicalSafetyUseCase,
  getOnboardingConfigUseCase,
  getOnboardingStateUseCase,
  getOnboardingSteps,
  getOnboardingStepIds,
  updateOnboardingStateUseCase,
};
