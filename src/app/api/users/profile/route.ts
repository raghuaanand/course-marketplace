import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, withAuth } from '@/lib/middleware/auth';

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const GET = withAuth(async (req: NextRequest, user) => {
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      _count: {
        select: {
          enrollments: true,
          instructorCourses: true,
        }
      }
    }
  });

  if (!profile) {
    throw new ApiError('User not found', 404);
  }

  return NextResponse.json({
    success: true,
    data: profile
  });
});

export const PUT = withAuth(async (req: NextRequest, user) => {
  const body = await req.json();
  const validatedData = updateProfileSchema.parse(body);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validatedData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    }
  });

  return NextResponse.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});
