import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().optional()
});

export class UserController {
  // Get current user profile
  static async getProfile(req: Request, res: Response) {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        bio: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            instructorCourses: true,
            enrollments: true,
            reviews: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        bio: true,
        isEmailVerified: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  }

  // Change password
  static async changePassword(req: Request, res: Response) {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  }

  // Get user's courses (for instructors)
  static async getMyCourses(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (req.user!.role !== 'INSTRUCTOR') {
      throw new AppError('Only instructors can access this endpoint', 403);
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: { instructorId: userId },
        include: {
          category: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true,
              lessons: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.course.count({
        where: { instructorId: userId }
      })
    ]);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Get user's enrollments (for students)
  static async getMyEnrollments(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: userId },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              },
              category: true,
              _count: {
                select: {
                  lessons: true,
                  reviews: true
                }
              }
            }
          }
        },
        orderBy: { enrolledAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.enrollment.count({
        where: { userId: userId }
      })
    ]);

    res.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Get user's learning progress
  static async getLearningProgress(req: Request, res: Response) {
    const userId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: userId },
      include: {
        course: {
          include: {
            _count: {
              select: { lessons: true }
            }
          }
        },
        lessonProgress: {
          include: {
            lesson: true
          }
        }
      }
    });

    const progressData = enrollments.map(enrollment => {
      const totalLessons = enrollment.course._count.lessons;
      const completedLessons = enrollment.lessonProgress.filter((p: any) => p.isCompleted).length;
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        totalLessons,
        completedLessons,
        progressPercentage: Math.round(progressPercentage),
        lastAccessedAt: enrollment.lastAccessedAt,
        enrolledAt: enrollment.enrolledAt
      };
    });

    res.json({
      success: true,
      data: progressData
    });
  }

  // Get user statistics
  static async getUserStats(req: Request, res: Response) {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'INSTRUCTOR') {
      const stats = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              instructorCourses: true
            }
          }
        }
      });

      const [totalEnrollments, totalRevenue, totalReviews, avgRating] = await Promise.all([
        prisma.enrollment.count({
          where: {
            course: {
              instructorId: userId
            }
          }
        }),
        prisma.payment.aggregate({
          where: {
            course: {
              instructorId: userId
            },
            status: 'COMPLETED'
          },
          _sum: {
            amount: true
          }
        }),
        prisma.review.count({
          where: {
            course: {
              instructorId: userId
            }
          }
        }),
        prisma.review.aggregate({
          where: {
            course: {
              instructorId: userId
            }
          },
          _avg: {
            rating: true
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalCourses: stats?._count.instructorCourses || 0,
          totalEnrollments,
          totalRevenue: totalRevenue._sum.amount || 0,
          totalReviews,
          averageRating: avgRating._avg.rating || 0
        }
      });
    } else {
      const [totalEnrollments, completedCourses, totalSpent] = await Promise.all([
        prisma.enrollment.count({
          where: { userId: userId }
        }),
        prisma.enrollment.count({
          where: {
            userId: userId,
            status: 'COMPLETED'
          }
        }),
        prisma.payment.aggregate({
          where: {
            userId: userId,
            status: 'COMPLETED'
          },
          _sum: {
            amount: true
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalEnrollments,
          completedCourses,
          totalSpent: totalSpent._sum?.amount || 0
        }
      });
    }
  }
}
