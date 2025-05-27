import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional()
});

export class ReviewController {
  // Get reviews for a course
  static async getCourseReviews(req: Request, res: Response) {
    const { courseId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: { 
          courseId,
          isActive: true
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({
        where: { 
          courseId,
          isActive: true
        }
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { 
          courseId,
          isActive: true
        },
        _count: {
          rating: true
        }
      })
    ]);

    const averageRating = await prisma.review.aggregate({
      where: { 
        courseId,
        isActive: true
      },
      _avg: {
        rating: true
      }
    });

    // Create rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: stats.find(s => s.rating === rating)?._count.rating || 0
    }));

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          total,
          averageRating: averageRating._avg.rating || 0,
          distribution: ratingDistribution
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Create a review
  static async createReview(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user!.id;
    const validatedData = createReviewSchema.parse(req.body);

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new AppError('You must be enrolled in the course to leave a review', 403);
    }

    // Check if user already reviewed this course
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId
        }
      }
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this course', 400);
    }

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: userId,
        courseId
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
      }
    });

    // Update course average rating
    await updateCourseRating(courseId);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  }

  // Update a review
  static async updateReview(req: Request, res: Response) {
    const { courseId, reviewId } = req.params;
    const userId = req.user!.id;
    const validatedData = updateReviewSchema.parse(req.body);

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('You can only update your own reviews', 403);
    }

    if (review.courseId !== courseId) {
      throw new AppError('Review does not belong to this course', 400);
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    // Update course average rating
    await updateCourseRating(courseId);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  }

  // Delete a review
  static async deleteReview(req: Request, res: Response) {
    const { courseId, reviewId } = req.params;
    const userId = req.user!.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('You can only delete your own reviews', 403);
    }

    if (review.courseId !== courseId) {
      throw new AppError('Review does not belong to this course', 400);
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { isActive: false }
    });

    // Update course average rating
    await updateCourseRating(courseId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  }

  // Get user's reviews
  static async getUserReviews(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { 
          userId: userId,
          isActive: true
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({
        where: { 
          userId: userId,
          isActive: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Get instructor's course reviews
  static async getInstructorReviews(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (req.user!.role !== 'INSTRUCTOR') {
      throw new AppError('Only instructors can access this endpoint', 403);
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { 
          course: {
            instructorId: userId
          },
          isActive: true
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({
        where: { 
          course: {
            instructorId: userId
          },
          isActive: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Get review analytics for instructor
  static async getReviewAnalytics(req: Request, res: Response) {
    const userId = req.user!.id;

    if (req.user!.role !== 'INSTRUCTOR') {
      throw new AppError('Only instructors can access this endpoint', 403);
    }

    const [totalReviews, averageRating, ratingDistribution, recentReviews] = await Promise.all([
      prisma.review.count({
        where: {
          course: {
            instructorId: userId
          },
          isActive: true
        }
      }),
      prisma.review.aggregate({
        where: {
          course: {
            instructorId: userId
          },
          isActive: true
        },
        _avg: {
          rating: true
        }
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          course: {
            instructorId: userId
          },
          isActive: true
        },
        _count: {
          rating: true
        }
      }),
      prisma.review.findMany({
        where: {
          course: {
            instructorId: userId
          },
          isActive: true
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          course: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: ratingDistribution.find(r => r.rating === rating)?._count.rating || 0
    }));

    res.json({
      success: true,
      data: {
        totalReviews,
        averageRating: averageRating._avg.rating || 0,
        distribution,
        recentReviews
      }
    });
  }
}

// Helper function to update course average rating
async function updateCourseRating(courseId: string) {
  // Note: Course model doesn't have averageRating/reviewCount fields
  // These would need to be calculated on-demand or added to schema
  // If needed, uncomment below to calculate and store in course record:
  
  // const result = await prisma.review.aggregate({
  //   where: {
  //     courseId: courseId,
  //     isActive: true
  //   },
  //   _avg: {
  //     rating: true
  //   },
  //   _count: {
  //     rating: true
  //   }
  // });

  // await prisma.course.update({
  //   where: { id: courseId },
  //   data: {
  //     averageRating: result._avg.rating || 0,
  //     reviewCount: result._count.rating
  //   }
  // });
  
  // For now, just return to avoid unused parameter warning
  console.log(`Skipping course rating update for course: ${courseId}`);
}
