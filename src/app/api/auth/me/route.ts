import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/auth';

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    // Get current user with additional details
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            instructorCourses: true,
          }
        }
      }
    });

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: currentUser
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to get user information'
    }, { status: 500 });
  }
});
