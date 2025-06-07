import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, withAuth } from '@/lib/middleware/auth';

export const GET = withAuth(
  async (req: NextRequest, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const dateRange = parseInt(searchParams.get('days') || '30');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      // Get instructor's courses
      const courses = await prisma.course.findMany({
        where: { instructorId: user.id },
        include: {
          enrollments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          reviews: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        }
      });

      // Calculate total students
      const totalStudents = courses.reduce((sum, course) => sum + course._count.enrollments, 0);

      // Calculate total revenue (this would need to be calculated from actual payments)
      const totalRevenue = courses.reduce((sum, course) => {
        const price = course.discountPrice ? Number(course.discountPrice) : Number(course.price);
        return sum + (price * course._count.enrollments);
      }, 0);

      // Calculate average rating
      const allRatings = courses.flatMap(course => course.reviews.map(review => review.rating));
      const avgRating = allRatings.length > 0 
        ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
        : 0;

      // Get monthly revenue data (last 6 months)
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        // This is simplified - in reality you'd query actual payment data
        const monthRevenue = Math.floor(totalRevenue / 6 * (0.8 + Math.random() * 0.4));
        monthlyRevenue.push({
          month: monthName,
          revenue: monthRevenue
        });
      }

      // Get top performing courses
      const topCourses = courses
        .map(course => ({
          title: course.title,
          students: course._count.enrollments,
          revenue: (course.discountPrice ? Number(course.discountPrice) : Number(course.price)) * course._count.enrollments
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Get recent enrollments
      const recentEnrollments = await prisma.enrollment.findMany({
        where: {
          course: {
            instructorId: user.id
          },
          enrolledAt: {
            gte: startDate
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          course: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          enrolledAt: 'desc'
        },
        take: 10
      });

      const formattedRecentEnrollments = recentEnrollments.map(enrollment => ({
        studentName: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
        courseTitle: enrollment.course.title,
        date: enrollment.enrolledAt.toISOString()
      }));

      const analyticsData = {
        totalStudents,
        totalRevenue,
        totalCourses: courses.length,
        avgRating: Number(avgRating.toFixed(1)),
        monthlyRevenue,
        topCourses,
        recentEnrollments: formattedRecentEnrollments
      };

      return NextResponse.json({
        success: true,
        data: analyticsData
      });

    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['INSTRUCTOR', 'ADMIN'] }
);
