import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from '../utils/errors.js';

export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized());
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (_error) {
    return next(unauthorized('Invalid or expired token'));
  }
};

export const requireAnyTokenRole = (...roles) => (req, _res, next) => {
  const userRoles = Array.isArray(req.user?.roles) ? req.user.roles : [];
  const allowed = roles.some((role) => userRoles.includes(role));

  if (!allowed) return next(forbidden());
  return next();
};

export const requireAnyRole = requireAnyTokenRole;
