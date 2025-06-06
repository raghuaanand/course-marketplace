import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError } from '@/lib/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id: courseId} = await params

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          }
        },
        category: true,
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                type: true,
                videoDuration: true,
                isFree: true,
                order: true,
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      }
    });

    if (!course) {
      throw new ApiError('Course not found', 404);
    }

    return NextResponse.json({
      success: true,
      data: course
    });

  } catch (error) {
    return handleApiError(error);
  }
}
