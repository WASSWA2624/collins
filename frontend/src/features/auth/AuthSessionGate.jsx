/**
 * AuthSessionGate
 * Starts session restoration and listens for API-layer session expiry.
 * File: AuthSessionGate.jsx
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as authActions } from '@store/slices/auth.slice';
import { subscribeAuthSessionExpired } from './session.events';

const AuthSessionGate = ({ children }) => {
  const dispatch = useDispatch();
  const hasRestoredSession = useSelector((state) => state?.auth?.hasRestoredSession ?? false);
  const sessionStatus = useSelector((state) => state?.auth?.sessionStatus ?? 'idle');

  useEffect(() => {
    if (!hasRestoredSession && sessionStatus !== 'restoring') {
      void dispatch(authActions.restoreSession());
    }
  }, [dispatch, hasRestoredSession, sessionStatus]);

  useEffect(() => {
    const unsubscribe = subscribeAuthSessionExpired((payload) => {
      dispatch(authActions.markSessionExpired(payload));
    });
    return unsubscribe;
  }, [dispatch]);

  return children;
};

export default AuthSessionGate;

