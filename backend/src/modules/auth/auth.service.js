import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { randomToken, sha256 } from '../../utils/crypto.js';
import { unauthorized, forbidden, conflict } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';

const REFRESH_TOKEN_DAYS = 30;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const getApprovedMemberships = (userId) => prisma.facilityMembership.findMany({
  where: { userId, status: 'APPROVED' },
  select: {
    id: true,
    facilityId: true,
    role: true,
    status: true,
    facility: {
      select: {
        id: true,
        name: true,
        registryCode: true,
        district: true,
        region: true,
        verificationStatus: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
});

const signAccessToken = (user, memberships = []) => jwt.sign(
  {
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: [...new Set(memberships.map((membership) => membership.role))],
    facilities: [...new Set(memberships.map((membership) => membership.facilityId))],
  },
  env.jwtSecret,
  { expiresIn: env.jwtExpiresIn }
);

const createRefreshSession = async (tx, userId) => {
  const refreshToken = randomToken();
  const expiresAt = new Date(Date.now() + (REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000));
  await tx.refreshSession.create({
    data: {
      userId,
      tokenHash: sha256(refreshToken),
      expiresAt,
    },
  });
  return { refreshToken, expiresAt };
};

const buildAuthPayload = async (user, tx = prisma) => {
  const memberships = await tx.facilityMembership.findMany({
    where: { userId: user.id, status: 'APPROVED' },
    select: { id: true, facilityId: true, role: true, status: true },
  });
  const { refreshToken, expiresAt } = await createRefreshSession(tx, user.id);
  const token = signAccessToken(user, memberships);

  return {
    user,
    memberships,
    token,
    accessToken: token,
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
};

export const registerUser = async ({ name, email, phone, password }, auditContext = {}) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw conflict('A user with this email already exists');

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: await hashPassword(password),
      },
      select: publicUserSelect,
    });

    await writeAudit({
      tx,
      ...auditContext,
      action: 'AUTH_REGISTER',
      entityType: 'User',
      entityId: user.id,
      afterJson: { id: user.id, email: user.email },
    });

    return buildAuthPayload(user, tx);
  });
};

export const loginUser = async ({ email, password }, auditContext = {}) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw unauthorized('Invalid email or password');
  }

  if (user.status !== 'ACTIVE') throw forbidden('User account is not active');

  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return prisma.$transaction(async (tx) => {
    const payload = await buildAuthPayload(publicUser, tx);
    await writeAudit({
      tx,
      ...auditContext,
      userId: user.id,
      action: 'AUTH_LOGIN',
      entityType: 'User',
      entityId: user.id,
      afterJson: { email: user.email },
    });
    return payload;
  });
};

export const refreshUserToken = async ({ refreshToken }, auditContext = {}) => {
  const tokenHash = sha256(refreshToken);
  const session = await prisma.refreshSession.findUnique({
    where: { tokenHash },
    include: { user: { select: publicUserSelect } },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    throw unauthorized('Invalid or expired refresh token');
  }

  if (session.user.status !== 'ACTIVE') throw forbidden('User account is not active');

  return prisma.$transaction(async (tx) => {
    await tx.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    const payload = await buildAuthPayload(session.user, tx);
    await writeAudit({
      tx,
      ...auditContext,
      userId: session.user.id,
      action: 'AUTH_REFRESH',
      entityType: 'User',
      entityId: session.user.id,
    });
    return payload;
  });
};

export const logoutUser = async ({ refreshToken } = {}, auditContext = {}) => {
  if (!refreshToken) return { revoked: false };
  const result = await prisma.refreshSession.updateMany({
    where: { tokenHash: sha256(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });

  if (auditContext.userId) {
    await writeAudit({
      ...auditContext,
      action: 'AUTH_LOGOUT',
      entityType: 'User',
      entityId: auditContext.userId,
    });
  }

  return { revoked: result.count > 0 };
};

export const getCurrentUser = async (userId) => {
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) return null;
  const memberships = await getApprovedMemberships(userId);
  return { ...user, memberships };
};
