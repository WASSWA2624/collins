import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  csrfToken,
  identify,
  login,
  logout,
  me,
  plannedAuth,
  refresh,
  register,
} from './auth.controller.js';
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from './auth.validators.js';

export const authRouter = Router();

authRouter.get('/csrf-token', csrfToken);
authRouter.get('/identify', identify);
authRouter.post('/register', validateRequest(registerSchema), register);
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.post('/refresh', validateRequest(refreshSchema), refresh);
authRouter.post('/logout', validateRequest(logoutSchema), logout);
authRouter.get('/me', requireAuth, me);

authRouter.post('/forgot-password', plannedAuth('Forgot password'));
authRouter.post('/reset-password', plannedAuth('Reset password'));
authRouter.post('/change-password', requireAuth, plannedAuth('Change password'));
authRouter.post('/verify-email', plannedAuth('Email verification'));
authRouter.post('/verify-phone', plannedAuth('Phone verification'));
authRouter.post('/resend-verification', plannedAuth('Resend verification'));
authRouter.post('/mfa/verify', plannedAuth('MFA verification'));
authRouter.post('/mfa/resend', plannedAuth('MFA resend'));
