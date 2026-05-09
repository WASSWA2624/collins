import { prisma } from '../config/prisma.js';
import { conflict } from './errors.js';
import { sha256 } from './crypto.js';

export const resolveIdempotency = async ({
  tx = prisma,
  userId,
  facilityId = null,
  key,
  operation,
  payload,
}) => {
  if (!key) return { shouldRun: true, requestHash: null, existing: null };

  const requestHash = sha256({ operation, payload });
  const existing = await tx.idempotencyRecord.findUnique({
    where: { userId_key: { userId, key } },
  });

  if (!existing) return { shouldRun: true, requestHash, existing: null };

  if (existing.requestHash !== requestHash) {
    throw conflict('Idempotency key conflict: the same key was already used with a different payload', [
      { path: 'idempotencyKey', message: 'Use a new idempotency key for changed offline payloads.' },
    ], { status: 'conflict', previousOperation: existing.operation });
  }

  return {
    shouldRun: false,
    requestHash,
    existing,
    responseJson: existing.responseJson,
    facilityId: existing.facilityId || facilityId,
  };
};

export const storeIdempotencyResult = ({
  tx = prisma,
  userId,
  facilityId = null,
  key,
  operation,
  requestHash,
  responseJson,
  entityType = null,
  entityId = null,
  clientRecordId = null,
  status = 'SYNCED',
}) => {
  if (!key) return null;
  return tx.idempotencyRecord.create({
    data: {
      userId,
      facilityId,
      key,
      operation,
      requestHash,
      responseJson,
      entityType,
      entityId,
      clientRecordId,
      status,
    },
  });
};
