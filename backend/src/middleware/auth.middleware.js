import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    const error = new Error('Authentication required');
    error.status = 401;
    return next(error);
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (_error) {
    const error = new Error('Invalid or expired token');
    error.status = 401;
    return next(error);
  }
};

export const requireAnyRole = (...roles) => (req, _res, next) => {
  const userRoles = Array.isArray(req.user?.roles) ? req.user.roles : [];
  const allowed = roles.some((role) => userRoles.includes(role));

  if (!allowed) {
    const error = new Error('Insufficient permissions');
    error.status = 403;
    return next(error);
  }

  return next();
};
