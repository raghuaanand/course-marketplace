import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { UserRole } from '@prisma/client';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '../prisma';

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

export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new ApiError('Authentication required', 401);
  }

  // Get user details from database to ensure we have the latest data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      isEmailVerified: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new ApiError('User not found or inactive', 401);
  }

  return user;
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

// Higher-order function to wrap API routes with NextAuth authentication
export function withNextAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>,
  options: {
    roles?: UserRole[];
    requireVerification?: boolean;
  } = {}
) {
  return async (req: NextRequest) => {
    try {
      const user = await getAuthenticatedUser(req);
      
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
