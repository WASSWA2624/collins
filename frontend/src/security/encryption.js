/**
 * Encryption Helpers
 * For sensitive offline data
 * File: encryption.js
 */
// NOTE:
// We intentionally do NOT implement "fake encryption". Until a vetted crypto
// implementation is approved (dependency-policy.mdc), these helpers are stubs.
// Call sites must treat this as "not available" and fail safely.

const encrypt = async () => {
  throw new Error('ENCRYPTION_NOT_IMPLEMENTED');
};

const decrypt = async () => {
  throw new Error('ENCRYPTION_NOT_IMPLEMENTED');
};

export { encrypt, decrypt };

