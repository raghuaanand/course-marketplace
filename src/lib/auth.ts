import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { env } from './env';
import { AppError } from './errors';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
}

export const extractToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check for token in cookies
  const tokenCookie = request.cookies.get('access_token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    
    if (decoded.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401);
    }
    throw error;
  }
};

export const authenticate = async (request: NextRequest): Promise<AuthenticatedUser> => {
  const token = extractToken(request);
  
  if (!token) {
    throw new AppError('Authentication token required', 401);
  }

  const decoded = verifyToken(token);
  
  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
    },
  });

  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', 401);
  }

  return user;
};

export const optionalAuth = async (request: NextRequest): Promise<AuthenticatedUser | null> => {
  try {
    return await authenticate(request);
  } catch {
    return null;
  }
};

export const authorize = (allowedRoles: UserRole[]) => {
  return (user: AuthenticatedUser) => {
    if (!allowedRoles.includes(user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
  };
};

export const generateTokens = (user: { id: string; email: string; role: UserRole }) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: '7d' } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};
