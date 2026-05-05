/**
 * First-run onboarding guard.
 * Sends users to the in-flow onboarding safety acknowledgement before app workflows.
 */
import { useSelector } from 'react-redux';
import { Redirect, usePathname } from 'expo-router';
import { selectOnboardingGuardRedirect } from '@store/selectors';

const ONBOARDING_PATH = '/onboarding';

export function useOnboardingGuard() {
  const pathname = usePathname();
  const redirectTo = useSelector(selectOnboardingGuardRedirect);
  const isOnboardingRoute = pathname === ONBOARDING_PATH || pathname?.endsWith('/onboarding');

  return { redirectTo: isOnboardingRoute ? null : redirectTo };
}

export function OnboardingGuard({ children }) {
  const { redirectTo } = useOnboardingGuard();
  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }
  return children;
}

