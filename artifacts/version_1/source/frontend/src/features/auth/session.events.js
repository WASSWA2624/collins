/**
 * Auth session events
 * Small in-process event channel for API-layer session expiry notifications.
 * File: session.events.js
 */

const SESSION_EXPIRED = 'SESSION_EXPIRED';
const listeners = new Set();

const subscribeAuthSessionExpired = (listener) => {
  if (typeof listener !== 'function') return () => {};
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emitAuthSessionExpired = (payload = {}) => {
  listeners.forEach((listener) => {
    listener({
      code: SESSION_EXPIRED,
      ...payload,
    });
  });
};

export { SESSION_EXPIRED, subscribeAuthSessionExpired, emitAuthSessionExpired };
