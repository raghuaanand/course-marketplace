import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const updateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
  isEmailVerified: z.boolean().optional(),
});

const createAdminSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
});

export class AdminController {
  // Get dashboard analytics
  static async getDashboardStats(_req: Request, res: Response) {
    const [
      userStats,
      courseStats,
      paymentStats,
      recentActivity
    ] = await Promise.all([
      // User statistics
      Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ 
          where: { 
            createdAt: { 
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) 
            } 
          } 
        }),
      ]),
      
      // Course statistics
      Promise.all([
        prisma.course.count(),
        prisma.course.count({ where: { status: 'PUBLISHED' } }),
        prisma.course.count({ where: { status: 'DRAFT' } }),
        prisma.course.count({ where: { isActive: true } }),
        prisma.enrollment.count(),
      ]),
      
      // Payment statistics
      Promise.all([
        prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payment.aggregate({
          where: { 
            status: 'COMPLETED',
            completedAt: { 
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) 
            }
          },
          _sum: { amount: true },
        }),
      ]),
      
      // Recent activity
      Promise.all([
        prisma.user.findMany({
          where: { role: { not: 'ADMIN' } },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
          }
        }),
        prisma.course.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            instructor: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }),
        prisma.payment.findMany({
          where: { status: 'COMPLETED' },
          orderBy: { completedAt: 'desc' },
          take: 5,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            },
            course: {
              select: {
                title: true,
              }
            }
          }
        }),
      ])
    ]);

    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      activeUsers,
      newUsersThisMonth
    ] = userStats;

    const [
      totalCourses,
      publishedCourses,
      draftCourses,
      activeCourses,
      totalEnrollments
    ] = courseStats;

    const [totalRevenue, monthlyRevenue] = paymentStats;
    const [recentUsers, recentCourses, recentPayments] = recentActivity;

    res.json({
      success: true,
      data: {
        overview: {
          users: {
            total: totalUsers,
            students: totalStudents,
            instructors: totalInstructors,
            active: activeUsers,
            newThisMonth: newUsersThisMonth,
          },
          courses: {
            total: totalCourses,
            published: publishedCourses,
            draft: draftCourses,
            active: activeCourses,
          },
          enrollments: {
            total: totalEnrollments,
          },
          revenue: {
            total: totalRevenue._sum.amount || 0,
            totalTransactions: totalRevenue._count,
            thisMonth: monthlyRevenue._sum.amount || 0,
          }
        },
        recentActivity: {
          users: recentUsers,
          courses: recentCourses,
          payments: recentPayments,
        }
      }
    });
  }

  // Get all users with pagination and filtering
  static async getUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const isActive = req.query.isActive as string;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && role !== 'all') {
      where.role = role.toUpperCase();
    }

    if (isActive && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              instructorCourses: true,
              enrollments: true,
              reviews: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Get user details
  static async getUser(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        instructorCourses: {
          include: {
            category: true,
            _count: {
              select: {
                enrollments: true,
                reviews: true,
              }
            }
          }
        },
        enrollments: {
          include: {
            course: {
              include: {
                instructor: {
                  select: {
                    firstName: true,
                    lastName: true,
                  }
                }
              }
            }
          }
        },
        reviews: {
          include: {
            course: {
              select: {
                title: true,
              }
            }
          }
        },
        _count: {
          select: {
            instructorCourses: true,
            enrollments: true,
            reviews: true,
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

  // Update user
  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  }

  // Delete user (soft delete by deactivating)
  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === 'ADMIN') {
      throw new AppError('Cannot delete admin users', 400);
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  }

  // Get all courses with admin details
  static async getCourses(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const categoryId = req.query.categoryId as string;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          category: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true,
              lessons: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.course.count({ where })
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

  // Update course status
  static async updateCourseStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, isActive } = req.body;

    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (status && !validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  }

  // Get payment analytics
  static async getPaymentAnalytics(req: Request, res: Response) {
    const timeframe = req.query.timeframe as string || '30'; // days
    const startDate = new Date(new Date().setDate(new Date().getDate() - parseInt(timeframe)));

    const [
      totalStats,
      timeframeStats,
      topCourses,
      recentPayments
    ] = await Promise.all([
      // Total statistics
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
        _count: true,
        _avg: { amount: true },
      }),
      
      // Timeframe statistics
      prisma.payment.aggregate({
        where: { 
          status: 'COMPLETED',
          completedAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: true,
      }),
      
      // Top performing courses
      prisma.payment.groupBy({
        by: ['courseId'],
        where: {
          status: 'COMPLETED',
          completedAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: 'desc' } },
        take: 10,
      }),
      
      // Recent payments
      prisma.payment.findMany({
        where: { status: 'COMPLETED' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          course: {
            select: {
              title: true,
              instructor: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: 20,
      })
    ]);

    // Get course details for top courses
    const topCoursesWithDetails = await Promise.all(
      topCourses.map(async (item) => {
        const course = await prisma.course.findUnique({
          where: { id: item.courseId },
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        });
        return {
          ...item,
          course
        };
      })
    );

    res.json({
      success: true,
      data: {
        overview: {
          total: {
            revenue: totalStats._sum.amount || 0,
            transactions: totalStats._count,
            averageTransaction: totalStats._avg.amount || 0,
          },
          timeframe: {
            revenue: timeframeStats._sum.amount || 0,
            transactions: timeframeStats._count,
            days: parseInt(timeframe),
          }
        },
        topCourses: topCoursesWithDetails,
        recentPayments
      }
    });
  }

  // Create admin user
  static async createAdmin(req: Request, res: Response) {
    const validatedData = createAdminSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const admin = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: admin
    });
  }

  // Get system logs/audit trail
  static async getSystemLogs(_req: Request, res: Response) {
    // This would typically come from a separate logging system
    // For now, we'll return recent activities as a placeholder
    
    const recentActivities = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        }
      }),
      prisma.course.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 20,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          instructor: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      }),
      prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            }
          },
          course: {
            select: {
              title: true,
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        recentUsers: recentActivities[0],
        recentCourses: recentActivities[1],
        recentPayments: recentActivities[2],
      }
    });
  }

  // Export data (CSV/JSON)
  static async exportData(req: Request, res: Response) {
    const { type, format } = req.query;
    
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = await prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            isEmailVerified: true,
            createdAt: true,
            lastLoginAt: true,
          }
        });
        filename = 'users';
        break;
        
      case 'courses':
        data = await prisma.course.findMany({
          include: {
            instructor: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            },
            category: {
              select: {
                name: true,
              }
            }
          }
        });
        filename = 'courses';
        break;
        
      case 'payments':
        data = await prisma.payment.findMany({
          where: { status: 'COMPLETED' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            },
            course: {
              select: {
                title: true,
              }
            }
          }
        });
        filename = 'payments';
        break;
        
      default:
        throw new AppError('Invalid export type', 400);
    }

    if (format === 'csv') {
      // Simple CSV conversion (in production, use a proper CSV library)
      const csv = [
        Object.keys(data[0] || {}).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json(data);
    }
  }
}
