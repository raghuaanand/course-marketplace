import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

// Basic validation schemas
const createCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  discountPrice: z.number().min(0).optional(),
  level: z.string().optional(),
  language: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  whatYouWillLearn: z.array(z.string()).optional(),
});

const updateCourseSchema = createCourseSchema.partial();

const createLessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'DOWNLOADABLE']),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  videoDuration: z.number().optional(),
  isFree: z.boolean().optional(),
});

const updateLessonSchema = createLessonSchema.partial();

export class CourseController {
  // Get all courses with filtering and pagination
  static async getCourses(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    
    const search = req.query.search as string;
    const categoryId = req.query.categoryId as string;
    const level = req.query.level as string;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

    const where: any = {
      status: 'PUBLISHED'
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (level) {
      where.level = level;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = {};
    if (sortBy === 'rating') {
      orderBy.averageRating = sortOrder;
    } else if (sortBy === 'students') {
      orderBy.enrollmentCount = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
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
              avatar: true
            }
          },
          category: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
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

  // Get single course details
  static async getCourse(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            _count: {
              select: {
                instructorCourses: true
              }
            }
          }
        },
        category: true,
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            videoDuration: true,
            order: true,
            isFree: true
          }
        },
        reviews: {
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
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            lessons: true
          }
        }
      }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is enrolled
    let isEnrolled = false;
    let enrollment = null;
    
    if (userId) {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: id
          }
        }
      });
      isEnrolled = !!enrollment;
    }

    // If course is not published and user is not the instructor, deny access
    if (course.status !== 'PUBLISHED' && course.instructorId !== userId) {
      throw new AppError('Course not found', 404);
    }

    res.json({
      success: true,
      data: {
        ...course,
        isEnrolled,
        enrollment
      }
    });
  }

  // Create new course (instructor only)
  static async createCourse(req: Request, res: Response) {
    const userId = req.user!.id;
    const validatedData = createCourseSchema.parse(req.body);

    if (req.user!.role !== 'INSTRUCTOR') {
      throw new AppError('Only instructors can create courses', 403);
    }

    // Generate slug from title
    const baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const course = await prisma.course.create({
      data: {
        ...validatedData,
        slug,
        instructorId: userId
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  }

  // Update course (instructor only)
  static async updateCourse(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const validatedData = updateCourseSchema.parse(req.body);

    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.instructorId !== userId) {
      throw new AppError('You can only update your own courses', 403);
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: validatedData,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: true
      }
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  }

  // Delete course (instructor only)
  static async deleteCourse(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.instructorId !== userId) {
      throw new AppError('You can only delete your own courses', 403);
    }

    if (course._count.enrollments > 0) {
      throw new AppError('Cannot delete course with active enrollments', 400);
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  }

  // Get course lessons (enrolled users only)
  static async getCourseLessons(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({
      where: { id },
      select: { instructorId: true }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is enrolled or is the instructor
    const isInstructor = course.instructorId === userId;
    
    if (!isInstructor) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: id
          }
        }
      });

      if (!enrollment) {
        throw new AppError('You must be enrolled to access course lessons', 403);
      }
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      orderBy: { order: 'asc' },
      include: {
        progress: isInstructor ? false : {
          where: { 
            enrollment: {
              userId: userId
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: lessons
    });
  }

  // Create lesson (instructor only)
  static async createLesson(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const validatedData = createLessonSchema.parse(req.body);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          where: { title: 'Default Module' },
          take: 1
        }
      }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.instructorId !== userId) {
      throw new AppError('You can only add lessons to your own courses', 403);
    }

    // Ensure course has a default module
    let defaultModule = course.modules[0];
    if (!defaultModule) {
      defaultModule = await prisma.module.create({
        data: {
          title: 'Default Module',
          description: 'Default module for course lessons',
          order: 1,
          courseId: id
        }
      });
    }

    // Get the next position
    const lastLesson = await prisma.lesson.findFirst({
      where: { courseId: id },
      orderBy: { order: 'desc' }
    });

    const orderPosition = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        ...validatedData,
        courseId: id,
        moduleId: defaultModule.id,
        order: orderPosition,
        position: orderPosition // Set both for compatibility
      }
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  }

  // Update lesson (instructor only)
  static async updateLesson(req: Request, res: Response) {
    const { lessonId } = req.params;
    const userId = req.user!.id;
    const validatedData = updateLessonSchema.parse(req.body);

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true
      }
    });

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    if (lesson.course.instructorId !== userId) {
      throw new AppError('You can only update lessons in your own courses', 403);
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: validatedData
    });

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson
    });
  }

  // Delete lesson (instructor only)
  static async deleteLesson(req: Request, res: Response) {
    const { lessonId } = req.params;
    const userId = req.user!.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true
      }
    });

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    if (lesson.course.instructorId !== userId) {
      throw new AppError('You can only delete lessons from your own courses', 403);
    }

    await prisma.lesson.delete({
      where: { id: lessonId }
    });

    // Update positions of remaining lessons
    await prisma.lesson.updateMany({
      where: {
        courseId: lesson.courseId,
        order: { gt: lesson.order }
      },
      data: {
        order: { decrement: 1 },
        position: { decrement: 1 } // Update both for compatibility
      }
    });

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  }

  // Reorder lessons (instructor only)
  static async reorderLessons(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const { lessonIds } = req.body;

    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.instructorId !== userId) {
      throw new AppError('You can only reorder lessons in your own courses', 403);
    }

    // Update positions
    const updatePromises = lessonIds.map((lessonId: string, index: number) =>
      prisma.lesson.update({
        where: { id: lessonId },
        data: { 
          order: index + 1,
          position: index + 1 // Update both for compatibility
        }
      })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Lessons reordered successfully'
    });
  }
}
