/**
 * Analytics Tracker
 * Fire-and-forget analytics
 * File: tracker.js
 */
import { featureFlags } from '@config';

const trackEvent = (eventName, properties = {}) => {
  if (!featureFlags.ANALYTICS_ENABLED) return;

  // Fire-and-forget (no-op until an analytics provider is approved and integrated)
  void Promise.resolve({ eventName, properties }).catch(() => undefined);
};

const trackScreen = (screenName, properties = {}) => {
  trackEvent('screen_view', { screen_name: screenName, ...properties });
};

export { trackEvent, trackScreen };

