import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export class EnrollmentController {
  // Enroll in a course
  static async enrollInCourse(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user!.id;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        instructorId: true
      }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.status !== 'PUBLISHED') {
      throw new AppError('Course is not available for enrollment', 400);
    }

    if (course.instructorId === userId) {
      throw new AppError('You cannot enroll in your own course', 400);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      throw new AppError('You are already enrolled in this course', 400);
    }

    // For free courses, enroll directly
    if (course.price.equals(0)) {
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: userId,
          courseId,
          status: 'ACTIVE'
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      // Update course enrollment count
      await prisma.course.update({
        where: { id: courseId },
        data: {
          enrollmentCount: { increment: 1 }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course',
        data: enrollment
      });
    } else {
      // For paid courses, return payment intent
      res.json({
        success: true,
        message: 'Payment required for enrollment',
        data: {
          requiresPayment: true,
          courseId,
          amount: course.price
        }
      });
    }
  }

  // Get enrollment details
  static async getEnrollment(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user!.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      },
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
            _count: {
              select: { lessons: true }
            }
          }
        },
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                order: true
              }
            }
          }
        }
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    // Calculate progress
    const totalLessons = await prisma.lesson.count({
      where: { courseId: enrollment.courseId }
    });
    const completedLessons = enrollment.lessonProgress.filter(p => p.isCompleted).length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    res.json({
      success: true,
      data: {
        ...enrollment,
        progressStats: {
          totalLessons,
          completedLessons,
          progressPercentage: Math.round(progressPercentage)
        }
      }
    });
  }

  // Update lesson progress
  static async updateLessonProgress(req: Request, res: Response) {
    const { courseId, lessonId } = req.params;
    const userId = req.user!.id;
    const { isCompleted, watchedDuration } = req.body;

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new AppError('You are not enrolled in this course', 403);
    }

    // Verify lesson belongs to course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId
      }
    });

    if (!lesson) {
      throw new AppError('Lesson not found in this course', 404);
    }

    // Update or create progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId
        }
      },
      update: {
        isCompleted: isCompleted ?? undefined,
        watchedDuration: watchedDuration ?? undefined
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted: isCompleted || false,
        watchedDuration: watchedDuration || 0
      }
    });

    // Update enrollment last accessed time
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      },
      data: {
        lastAccessedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });
  }

  // Mark course as completed
  static async completeCourse(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user!.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      },
      include: {
        course: {
          include: {
            _count: { select: { lessons: true } }
          }
        },
        lessonProgress: true
      }
    });

    if (!enrollment) {
      throw new AppError('You are not enrolled in this course', 403);
    }

    if (enrollment.status === 'COMPLETED') {
      throw new AppError('Course is already completed', 400);
    }

    // Check if all lessons are completed
    const totalLessons = await prisma.lesson.count({
      where: { courseId: enrollment.courseId }
    });
    const completedLessons = enrollment.lessonProgress.filter(p => p.isCompleted).length;

    if (completedLessons < totalLessons) {
      throw new AppError('You must complete all lessons before marking course as completed', 400);
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Congratulations! You have completed the course',
      data: updatedEnrollment
    });
  }

  // Get course progress analytics (for instructors)
  static async getCourseAnalytics(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user!.id;

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.instructorId !== userId) {
      throw new AppError('You can only view analytics for your own courses', 403);
    }

    const [
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      recentEnrollments,
      progressData
    ] = await Promise.all([
      // Total enrollments
      prisma.enrollment.count({
        where: { courseId }
      }),
      
      // Active enrollments
      prisma.enrollment.count({
        where: { 
          courseId,
          status: 'ACTIVE'
        }
      }),
      
      // Completed enrollments
      prisma.enrollment.count({
        where: { 
          courseId,
          status: 'COMPLETED'
        }
      }),
      
      // Recent enrollments (last 30 days)
      prisma.enrollment.findMany({
        where: {
          courseId,
          enrolledAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        },
        orderBy: { enrolledAt: 'desc' },
        take: 10
      }),
      
      // Lesson completion rates
      prisma.lesson.findMany({
        where: { courseId },
        include: {
          _count: {
            select: {
              progress: {
                where: { isCompleted: true }
              }
            }
          }
        },
        orderBy: { order: 'asc' }
      })
    ]);

    const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

    const lessonAnalytics = progressData.map(lesson => ({
      lessonId: lesson.id,
      title: lesson.title,
      position: lesson.order,
      completions: lesson._count.progress,
      completionRate: totalEnrollments > 0 ? (lesson._count.progress / totalEnrollments) * 100 : 0
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          completionRate: Math.round(completionRate)
        },
        recentEnrollments,
        lessonAnalytics
      }
    });
  }

  // Cancel enrollment
  static async cancelEnrollment(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user!.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    if (enrollment.status === 'COMPLETED') {
      throw new AppError('Cannot cancel a completed course', 400);
    }

    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      },
      data: {
        status: 'CANCELLED'
      }
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        enrollmentCount: { decrement: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Enrollment cancelled successfully'
    });
  }
}
