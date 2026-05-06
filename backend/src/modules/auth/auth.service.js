import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { MEMBERSHIP_ROLES } from '../../constants/roles.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { randomToken, sha256 } from '../../utils/crypto.js';
import { unauthorized, forbidden, conflict, notFound } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { createInitialOnboardingState } from '../onboarding/onboarding.service.js';
import { buildAuthContext, resolveRequestedFacilityId } from './auth.presenter.js';

const REFRESH_TOKEN_DAYS = 30;
const AUTO_APPROVED_REGISTRATION_ROLES = new Set([
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
]);

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

const registrationFacilitySelect = {
  id: true,
  registryCode: true,
  name: true,
  district: true,
  region: true,
  type: true,
  ownership: true,
  verificationStatus: true,
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

const buildAuthPayload = async (user, { tx = prisma, requestedFacilityId = null } = {}) => {
  const memberships = await tx.facilityMembership.findMany({
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
  });
  const onboardingState = await tx.onboardingState.findUnique({
    where: { userId: user.id },
    select: authOnboardingStateSelect,
  });
  const context = buildAuthContext({ user, memberships, requestedFacilityId });
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

const resolveRegistrationFacility = async (tx, {
  facilityId,
  facilityName,
  facilityDistrict,
  facilityRegion,
  facilityType,
  facilityOwnership,
} = {}, userId, auditContext = {}) => {
  if (facilityId) {
    const facility = await tx.facility.findUnique({
      where: { id: facilityId },
      select: registrationFacilitySelect,
    });
    if (!facility) throw notFound('Facility not found');
    return facility;
  }

  if (!facilityName) return null;

  const existing = await tx.facility.findFirst({
    where: {
      name: facilityName,
      ...(facilityDistrict ? { district: facilityDistrict } : {}),
    },
    select: registrationFacilitySelect,
  });
  if (existing) return existing;

  const facility = await tx.facility.create({
    data: {
      name: facilityName,
      ...(facilityDistrict ? { district: facilityDistrict } : {}),
      ...(facilityRegion ? { region: facilityRegion } : {}),
      ...(facilityType ? { type: facilityType } : { type: 'Hospital' }),
      ...(facilityOwnership ? { ownership: facilityOwnership } : {}),
    },
    select: registrationFacilitySelect,
  });

  await writeAudit({
    tx,
    ...auditContext,
    userId,
    facilityId: facility.id,
    action: 'FACILITY_CREATE_FROM_REGISTRATION',
    entityType: 'Facility',
    entityId: facility.id,
    afterJson: facility,
  });

  return facility;
};

const getRegistrationMembershipApproval = (role, userId) => {
  const autoApproved = AUTO_APPROVED_REGISTRATION_ROLES.has(role);
  return {
    status: autoApproved ? 'APPROVED' : 'PENDING',
    approvedByUserId: autoApproved ? userId : null,
    auditAction: autoApproved
      ? 'FACILITY_MEMBERSHIP_AUTO_APPROVE_REGISTRATION'
      : 'FACILITY_MEMBERSHIP_REQUEST',
  };
};

export const registerUser = async ({
  name,
  email,
  phone,
  password,
  facilityId,
  facilityName,
  facilityDistrict,
  facilityRegion,
  facilityType,
  facilityOwnership,
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

    const selectedFacility = await resolveRegistrationFacility(tx, {
      facilityId,
      facilityName,
      facilityDistrict,
      facilityRegion,
      facilityType,
      facilityOwnership,
    }, user.id, auditContext);

    if (selectedFacility) {
      const membershipApproval = getRegistrationMembershipApproval(requestedRole, user.id);
      const membership = await tx.facilityMembership.create({
        data: {
          userId: user.id,
          facilityId: selectedFacility.id,
          role: requestedRole,
          status: membershipApproval.status,
          ...(membershipApproval.approvedByUserId ? { approvedByUserId: membershipApproval.approvedByUserId } : {}),
        },
        include: { facility: true },
      });

      await writeAudit({
        tx,
        ...auditContext,
        userId: user.id,
        facilityId: selectedFacility.id,
        action: membershipApproval.auditAction,
        entityType: 'FacilityMembership',
        entityId: membership.id,
        afterJson: {
          role: membership.role,
          status: membership.status,
          approvedByUserId: membership.approvedByUserId || null,
        },
      });
    }

    await createInitialOnboardingState(tx, user.id, {
      ...(selectedFacility ? {
        selectedFacilityId: selectedFacility.id,
        requestedRole,
      } : {}),
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
        selectedFacilityId: selectedFacility?.id || null,
        requestedRole: selectedFacility ? requestedRole : null,
      },
    });

    return buildAuthPayload(user, { tx });
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
  const memberships = await getApprovedMemberships(userId);
  const onboardingState = await prisma.onboardingState.findUnique({
    where: { userId },
    select: authOnboardingStateSelect,
  });
  const context = buildAuthContext({ user, memberships, requestedFacilityId });
  return { ...context.user, onboardingState };
};
