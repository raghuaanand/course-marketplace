import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from '../prisma';
import { env } from '../env';

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

export class ApiError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
  }
}

export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export async function authenticateUser(req: NextRequest): Promise<AuthenticatedUser> {
  const token = extractToken(req);
  
  if (!token) {
    throw new ApiError('Authentication token required', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    
    if (decoded.type !== 'access') {
      throw new ApiError('Invalid token type', 401);
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 401);
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError('Invalid authentication token', 401);
    }
    throw error;
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (user: AuthenticatedUser) => {
    if (!allowedRoles.includes(user.role)) {
      throw new ApiError('Insufficient permissions', 403);
    }
  };
}

export function requireEmailVerification(user: AuthenticatedUser) {
  if (!user.isEmailVerified) {
    throw new ApiError('Email verification required', 403);
  }
}

// Higher-order function to wrap API routes with authentication
export function withAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>,
  options: {
    roles?: UserRole[];
    requireVerification?: boolean;
  } = {}
) {
  return async (req: NextRequest) => {
    try {
      const user = await authenticateUser(req);
      
      if (options.requireVerification) {
        requireEmailVerification(user);
      }
      
      if (options.roles && options.roles.length > 0) {
        requireRole(options.roles)(user);
      }
      
      return handler(req, user);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }
      
      console.error('Authentication error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Error handler for API routes
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }
  
  console.error('API Error:', error);
  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  );
}
