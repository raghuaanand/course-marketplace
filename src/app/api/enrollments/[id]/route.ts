import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, withNextAuth, AuthenticatedUser } from '@/lib/middleware/nextauth-middleware';

export const GET = withNextAuth(
  async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      // Extract enrollment ID from URL
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const enrollmentId = pathSegments[pathSegments.length - 1];

      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  bio: true
                }
              },
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              },
              modules: {
                include: {
                  lessons: {
                    orderBy: { order: 'asc' }
                  }
                },
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (!enrollment) {
        throw new ApiError('Enrollment not found', 404);
      }

      // Check if user owns this enrollment or is an admin
      if (enrollment.userId !== user.id && user.role !== 'ADMIN') {
        throw new ApiError('Unauthorized', 403);
      }

      return NextResponse.json({
        success: true,
        data: enrollment
      });

    } catch (error) {
      return handleApiError(error);
    }
  }
);

export const PATCH = withNextAuth(
  async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      // Extract enrollment ID from URL
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const enrollmentId = pathSegments[pathSegments.length - 1];

      const { progress, status, currentLessonId } = await req.json();

      // First, verify the enrollment exists and belongs to the user
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
      });

      if (!existingEnrollment) {
        throw new ApiError('Enrollment not found', 404);
      }

      if (existingEnrollment.userId !== user.id && user.role !== 'ADMIN') {
        throw new ApiError('Unauthorized', 403);
      }

      // Update the enrollment
      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          ...(progress !== undefined && { progress }),
          ...(status !== undefined && { status }),
          ...(currentLessonId !== undefined && { currentLessonId }),
          updatedAt: new Date()
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: updatedEnrollment,
        message: 'Enrollment updated successfully'
      });

    } catch (error) {
      return handleApiError(error);
    }
  }
);

export const DELETE = withNextAuth(
  async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      // Extract enrollment ID from URL
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const enrollmentId = pathSegments[pathSegments.length - 1];

      // First, verify the enrollment exists and belongs to the user or user is admin
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          course: {
            select: {
              title: true,
              instructorId: true
            }
          }
        }
      });

      if (!existingEnrollment) {
        throw new ApiError('Enrollment not found', 404);
      }

      // Users can delete their own enrollments, instructors can delete enrollments from their courses, admins can delete any
      const canDelete = 
        existingEnrollment.userId === user.id ||
        existingEnrollment.course.instructorId === user.id ||
        user.role === 'ADMIN';

      if (!canDelete) {
        throw new ApiError('Unauthorized', 403);
      }

      await prisma.enrollment.delete({
        where: { id: enrollmentId }
      });

      return NextResponse.json({
        success: true,
        message: 'Enrollment deleted successfully'
      });

    } catch (error) {
      return handleApiError(error);
    }
  }
);
