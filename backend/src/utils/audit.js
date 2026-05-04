import { prisma } from '../config/prisma.js';
import { sha256 } from './crypto.js';
import { stripUndefined } from './object.js';

const getClientIp = (req) => req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || req?.ip || null;

export const buildAuditContext = (req) => ({
  userId: req?.user?.sub || null,
  requestId: req?.id || null,
  ipHash: getClientIp(req) ? sha256(getClientIp(req)) : null,
});

export const writeAudit = async ({
  tx = prisma,
  userId = null,
  facilityId = null,
  action,
  entityType,
  entityId = null,
  beforeJson = null,
  afterJson = null,
  reason = null,
  requestId = null,
  ipHash = null,
}) => tx.auditLog.create({
  data: stripUndefined({
    userId,
    facilityId,
    action,
    entityType,
    entityId,
    beforeJson,
    afterJson,
    reason,
    requestId,
    ipHash,
  }),
});
