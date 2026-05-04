/**
 * Disclaimer guard (P013 first-run acknowledgement).
 * Redirects to /disclaimer when user has not yet acknowledged the prototype disclaimer.
 * Guard runs only after persist rehydration to avoid wrongly redirecting returning users.
 */
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { selectDisclaimerGuardRedirect } from '@store/selectors';

/**
 * Hook: returns redirect path when user must acknowledge disclaimer first.
 * @returns {{ redirectTo: string | null }}
 */
export function useDisclaimerGuard() {
  const redirectTo = useSelector(selectDisclaimerGuardRedirect);
  return { redirectTo };
}

/**
 * Renders redirect to disclaimer when guard requires it; otherwise renders children.
 * Use in (main)/_layout to enforce first-run acknowledgement.
 */
export function DisclaimerGuard({ children }) {
  const { redirectTo } = useDisclaimerGuard();
  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }
  return children;
}
