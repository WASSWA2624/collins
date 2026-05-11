import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export const hashPassword = (password) => bcrypt.hash(password, env.bcryptSaltRounds);

export const verifyPassword = (password, passwordHash) => bcrypt.compare(password, passwordHash);
