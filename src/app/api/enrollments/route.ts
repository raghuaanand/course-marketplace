import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, withNextAuth } from '@/lib/middleware/nextauth-middleware';

export const GET = withNextAuth(
  async (req: NextRequest, user) => {
    try {
      const { searchParams } = new URL(req.url);
      
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');
      const skip = (page - 1) * limit;
      
      const status = searchParams.get('status');
      const courseId = searchParams.get('courseId');

      const where: any = {
        userId: user.id
      };

      if (status) {
        where.status = status;
      }

      if (courseId) {
        where.courseId = courseId;
      }

      const [enrollments, total] = await Promise.all([
        prisma.enrollment.findMany({
          where,
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
                _count: {
                  select: {
                    enrollments: true,
                    reviews: true
                  }
                }
              }
            }
          },
          orderBy: {
            enrolledAt: 'desc'
          },
          skip,
          take: limit,
        }),
        prisma.enrollment.count({ where })
      ]);

      // Calculate average rating for each course
      const enrollmentsWithRating = await Promise.all(
        enrollments.map(async (enrollment) => {
          const avgRating = await prisma.review.aggregate({
            where: { courseId: enrollment.courseId },
            _avg: { rating: true }
          });

          return {
            ...enrollment,
            course: {
              ...enrollment.course,
              averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating) : null
            }
          };
        })
      );

      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        success: true,
        data: {
          enrollments: enrollmentsWithRating,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          }
        }
      });

    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'] }
);

export const POST = withNextAuth(
  async (req: NextRequest, user) => {
    try {
      const { courseId } = await req.json();

      if (!courseId) {
        throw new ApiError('Course ID is required', 400);
      }

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        throw new ApiError('Course not found', 404);
      }

      // Check if user is already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId
          }
        }
      });

      if (existingEnrollment) {
        throw new ApiError('Already enrolled in this course', 400);
      }

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
          status: 'ACTIVE',
          progress: 0,
          enrolledAt: new Date()
        },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: enrollment
      });

    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'] }
);
