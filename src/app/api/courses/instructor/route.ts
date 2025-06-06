import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, withAuth } from '@/lib/middleware/auth';

export const GET = withAuth(
  async (req: NextRequest, user) => {
    try {
      const { searchParams } = new URL(req.url);
      
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');
      const skip = (page - 1) * limit;
      
      const search = searchParams.get('search');
      const status = searchParams.get('status');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

      const where: any = {
        instructorId: user.id
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (status) {
        where.status = status;
      }

      const orderBy: any = {};
      if (sortBy === 'students') {
        orderBy.enrollmentCount = sortOrder;
      } else {
        orderBy[sortBy] = sortOrder;
      }

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            },
            _count: {
              select: {
                enrollments: true,
                reviews: true,
                modules: true
              }
            }
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.course.count({ where })
      ]);

      // Add computed fields for instructor dashboard
      const coursesWithMetrics = await Promise.all(
        courses.map(async (course) => {
          // Calculate average rating
          const avgRating = await prisma.review.aggregate({
            where: { courseId: course.id },
            _avg: { rating: true }
          });

          // Calculate total revenue for this course
          const revenue = await prisma.payment.aggregate({
            where: { 
              courseId: course.id,
              status: 'COMPLETED'
            },
            _sum: { instructorAmount: true }
          });

          return {
            ...course,
            averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating) : null,
            totalRevenue: revenue._sum.instructorAmount ? Number(revenue._sum.instructorAmount) : 0
          };
        })
      );

      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        success: true,
        data: {
          courses: coursesWithMetrics,
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
  { roles: ['INSTRUCTOR', 'ADMIN'] }
);
