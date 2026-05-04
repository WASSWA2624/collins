import crypto from 'crypto';

const normalize = (value) => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        if (value[key] !== undefined) acc[key] = normalize(value[key]);
        return acc;
      }, {});
  }
  return value;
};

export const stableStringify = (value) => JSON.stringify(normalize(value));

export const sha256 = (value) => crypto
  .createHash('sha256')
  .update(typeof value === 'string' ? value : stableStringify(value))
  .digest('hex');

export const randomToken = (bytes = 48) => crypto.randomBytes(bytes).toString('base64url');
