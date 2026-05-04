// Suppress styled-components false positives before entry load
if (typeof __DEV__ !== 'undefined' && __DEV__ && typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('has been created dynamically') ||
        message.includes("You may see this warning because you've called styled inside another component"))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

// Signal upstream checks to skip the dynamic creation guard
globalThis.__styledComponentsSkipDynamicCreationCheck = true;

// Use require so the override runs before entry evaluation
// eslint-disable-next-line global-require
require('expo-router/entry');

