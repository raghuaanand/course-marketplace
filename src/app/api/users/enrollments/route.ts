import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, withNextAuth } from '@/lib/middleware/nextauth-middleware';

export const GET = withNextAuth(async (req: NextRequest, user) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: { in: ['ACTIVE', 'COMPLETED'] }
    },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            }
          },
          category: true,
          _count: {
            select: {
              modules: true,
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
  });

  const total = await prisma.enrollment.count({
    where: {
      userId: user.id,
      status: { in: ['ACTIVE', 'COMPLETED'] }
    }
  });

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    success: true,
    data: {
      enrollments,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    }
  });
});
