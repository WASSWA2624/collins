import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const signToken = (user, roles = []) => jwt.sign(
  {
    sub: user.id,
    email: user.email,
    name: user.name,
    roles,
  },
  env.jwtSecret,
  { expiresIn: env.jwtExpiresIn }
);

export const registerUser = async ({ name, email, phone, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('A user with this email already exists');
    error.status = 409;
    throw error;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash: await hashPassword(password),
    },
    select: publicUserSelect,
  });

  return { user, token: signToken(user) };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  if (user.status !== 'ACTIVE') {
    const error = new Error('User account is not active');
    error.status = 403;
    throw error;
  }

  const memberships = await prisma.facilityMembership.findMany({
    where: { userId: user.id, status: 'APPROVED' },
    select: { role: true, facilityId: true },
  });

  const roles = [...new Set(memberships.map((membership) => membership.role))];
  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: publicUser,
    memberships,
    token: signToken(publicUser, roles),
  };
};

export const getCurrentUser = async (userId) => {
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
};
