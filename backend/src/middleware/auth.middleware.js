import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { forbidden, unauthorized } from '../utils/errors.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

const verifyAccessToken = async (token) => {
  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw unauthorized('Invalid or expired token');
  }

  if (!decoded?.sub || !decoded?.sid) {
    throw unauthorized('Invalid or expired session');
  }

  const session = await prisma.refreshSession.findFirst({
    where: {
      id: decoded.sid,
      userId: decoded.sub,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: { select: { id: true, status: true } } },
  });

  if (!session) throw unauthorized('Invalid or expired session');
  if (session.user.status !== 'ACTIVE') throw forbidden('User account is not active');

  return { decoded, session };
};

export const requireAuth = async (req, _res, next) => {
  const token = getBearerToken(req);
  if (!token) return next(unauthorized());

  try {
    const { decoded, session } = await verifyAccessToken(token);
    req.user = decoded;
    req.authSession = session;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const optionalAuth = async (req, _res, next) => {
  const token = getBearerToken(req);
  if (!token) return next();

  try {
    const { decoded, session } = await verifyAccessToken(token);
    req.user = decoded;
    req.authSession = session;
  } catch {
    req.user = undefined;
    req.authSession = undefined;
  }

  return next();
};

export const requireAnyTokenRole = (...roles) => (req, _res, next) => {
  const userRoles = Array.isArray(req.user?.roles) ? req.user.roles : [];
  const allowed = roles.some((role) => userRoles.includes(role));

  if (!allowed) return next(forbidden());
  return next();
};

export const requireAnyRole = requireAnyTokenRole;
