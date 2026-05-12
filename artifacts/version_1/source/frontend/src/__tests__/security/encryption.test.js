/**
 * Encryption Tests
 * File: encryption.test.js
 */
import { decrypt, encrypt } from '@security/encryption';

describe('security/encryption', () => {
  it('throws for encrypt', async () => {
    await expect(encrypt('data')).rejects.toThrow('ENCRYPTION_NOT_IMPLEMENTED');
  });

  it('throws for decrypt', async () => {
    await expect(decrypt('data')).rejects.toThrow('ENCRYPTION_NOT_IMPLEMENTED');
  });
});
