import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { randomToken, sha256 } from '../../utils/crypto.js';
import { unauthorized, forbidden, conflict, notFound } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { MEMBERSHIP_ROLES } from '../../constants/roles.js';
import { createInitialOnboardingState } from '../onboarding/onboarding.service.js';
import { buildAuthContext, resolveRequestedFacilityId } from './auth.presenter.js';

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

const authOnboardingStateSelect = {
  id: true,
  status: true,
  currentStep: true,
  completedStepsJson: true,
  selectedFacilityId: true,
  requestedRole: true,
  clinicalSafetyAcknowledgedAt: true,
  clinicalSafetyAcknowledgementVersion: true,
  clinicalSafetyStatementHash: true,
  completedAt: true,
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

const getTokenExpiresAt = (token) => {
  const decoded = jwt.decode(token);
  return decoded?.exp ? new Date(decoded.exp * 1000) : null;
};

const signAccessToken = ({ user, memberships, roles, permissions, activeFacility }, sessionId) => jwt.sign(
  {
    sub: user.id,
    sid: sessionId,
    email: user.email,
    name: user.name,
    roles,
    permissions,
    facilities: [...new Set(memberships.map((membership) => membership.facilityId))],
    activeFacilityId: activeFacility?.facilityId || null,
  },
  env.jwtSecret,
  { expiresIn: env.jwtExpiresIn }
);

const createRefreshSession = async (tx, userId) => {
  const refreshToken = randomToken();
  const expiresAt = new Date(Date.now() + (REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000));
  const session = await tx.refreshSession.create({
    data: {
      userId,
      tokenHash: sha256(refreshToken),
      expiresAt,
    },
  });
  return { refreshToken, sessionId: session.id, expiresAt };
};

const resolveSettingsFacilityId = ({ requestedFacilityId, memberships, userSettings }) => {
  const savedActiveFacilityId = userSettings?.activeFacilityId || null;
  const savedFacilityIsAllowed =
    savedActiveFacilityId &&
    memberships.some((membership) => membership.facilityId === savedActiveFacilityId);

  return requestedFacilityId || (savedFacilityIsAllowed ? savedActiveFacilityId : null);
};

const buildAuthPayload = async (user, { tx = prisma, requestedFacilityId = null } = {}) => {
  const [memberships, onboardingState, userSettings] = await Promise.all([
    tx.facilityMembership.findMany({
      where: { userId: user.id, status: 'APPROVED' },
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
    }),
    tx.onboardingState.findUnique({
      where: { userId: user.id },
      select: authOnboardingStateSelect,
    }),
    tx.userSettings.findUnique({
      where: { userId: user.id },
      select: { activeFacilityId: true },
    }),
  ]);
  const resolvedFacilityId = resolveSettingsFacilityId({ requestedFacilityId, memberships, userSettings });
  const context = buildAuthContext({ user, memberships, requestedFacilityId: resolvedFacilityId });
  const { refreshToken, sessionId, expiresAt } = await createRefreshSession(tx, user.id);
  const token = signAccessToken(context, sessionId);
  const accessTokenExpiresAt = getTokenExpiresAt(token);
  const userWithSessionContext = { ...context.user, onboardingState };

  return {
    ...context,
    user: userWithSessionContext,
    token,
    accessToken: token,
    refreshToken,
    tokens: {
      accessToken: token,
      refreshToken,
      tokenType: 'Bearer',
      accessTokenExpiresAt,
      refreshTokenExpiresAt: expiresAt,
    },
    session: {
      accessTokenExpiresAt,
      refreshTokenExpiresAt: expiresAt,
    },
    accessTokenExpiresAt,
    refreshTokenExpiresAt: expiresAt,
    onboardingState,
  };
};

export const registerUser = async ({
  name,
  email,
  phone,
  password,
  facilityId,
  requestedRole = MEMBERSHIP_ROLES.CLINICIAN,
}, auditContext = {}) => {
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

    const facility = await tx.facility.findUnique({
      where: { id: facilityId },
      select: {
        id: true,
        name: true,
        registryCode: true,
        district: true,
        region: true,
        verificationStatus: true,
      },
    });
    if (!facility) throw notFound('Facility not found');

    await createInitialOnboardingState(tx, user.id, {
      status: 'IN_PROGRESS',
      currentStep: 'CLINICAL_SAFETY',
      selectedFacilityId: facility.id,
      requestedRole,
    });

    const membership = await tx.facilityMembership.create({
      data: {
        userId: user.id,
        facilityId: facility.id,
        role: requestedRole,
        status: 'APPROVED',
      },
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId: user.id,
      facilityId: facility.id,
      action: 'FACILITY_MEMBERSHIP_AUTO_APPROVE_REGISTRATION',
      entityType: 'FacilityMembership',
      entityId: membership.id,
      afterJson: {
        role: membership.role,
        status: membership.status,
      },
    });

    await writeAudit({
      tx,
      ...auditContext,
      action: 'AUTH_REGISTER',
      entityType: 'User',
      entityId: user.id,
      afterJson: {
        id: user.id,
        email: user.email,
        selectedFacilityId: facility.id,
        requestedRole,
      },
    });

    return buildAuthPayload(user, { tx, requestedFacilityId: facility.id });
  });
};

export const loginUser = async ({ email, password, activeFacilityId, facilityId }, auditContext = {}) => {
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
  const requestedFacilityId = resolveRequestedFacilityId({ activeFacilityId, facilityId });

  return prisma.$transaction(async (tx) => {
    const payload = await buildAuthPayload(publicUser, { tx, requestedFacilityId });
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

export const refreshUserToken = async ({ refreshToken, activeFacilityId, facilityId }, auditContext = {}) => {
  const tokenHash = sha256(refreshToken);
  const session = await prisma.refreshSession.findUnique({
    where: { tokenHash },
    include: { user: { select: publicUserSelect } },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    throw unauthorized('Invalid or expired refresh token');
  }

  if (session.user.status !== 'ACTIVE') throw forbidden('User account is not active');

  const requestedFacilityId = resolveRequestedFacilityId({ activeFacilityId, facilityId });

  return prisma.$transaction(async (tx) => {
    const revokedAt = new Date();
    const revokeResult = await tx.refreshSession.updateMany({
      where: { id: session.id, revokedAt: null, expiresAt: { gt: revokedAt } },
      data: { revokedAt },
    });
    if (revokeResult.count !== 1) throw unauthorized('Invalid or expired refresh token');

    const payload = await buildAuthPayload(session.user, { tx, requestedFacilityId });
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

export const logoutUser = async ({ refreshToken, sessionId } = {}, auditContext = {}) => {
  const selectors = [
    refreshToken ? { tokenHash: sha256(refreshToken) } : null,
    sessionId ? { id: sessionId, ...(auditContext.userId ? { userId: auditContext.userId } : {}) } : null,
  ].filter(Boolean);

  if (!selectors.length) return { revoked: false };

  const result = await prisma.refreshSession.updateMany({
    where: { revokedAt: null, OR: selectors },
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

export const getCurrentUser = async (userId, requestedFacilityId = null) => {
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) return null;
  const [memberships, onboardingState, userSettings] = await Promise.all([
    getApprovedMemberships(userId),
    prisma.onboardingState.findUnique({
      where: { userId },
      select: authOnboardingStateSelect,
    }),
    prisma.userSettings.findUnique({
      where: { userId },
      select: { activeFacilityId: true },
    }),
  ]);
  const resolvedFacilityId = resolveSettingsFacilityId({ requestedFacilityId, memberships, userSettings });
  const context = buildAuthContext({ user, memberships, requestedFacilityId: resolvedFacilityId });
  return { ...context.user, onboardingState };
};
