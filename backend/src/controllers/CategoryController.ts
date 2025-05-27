import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().min(1)
});

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z.string().min(1).optional(),
  isActive: z.boolean().optional()
});

export class CategoryController {
  // Get all categories
  static async getCategories(req: Request, res: Response) {
    const includeInactive = req.query.includeInactive === 'true';
    
    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: {
            courses: {
              where: {
                status: 'PUBLISHED',
                isActive: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories
    });
  }

  // Get single category with courses
  static async getCategory(req: Request, res: Response) {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: {
              where: {
                status: 'PUBLISHED',
                isActive: true
              }
            }
          }
        }
      }
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (!category.isActive) {
      throw new AppError('Category is not active', 404);
    }

    const [courses, totalCourses] = await Promise.all([
      prisma.course.findMany({
        where: {
          categoryId: id,
          status: 'PUBLISHED',
          isActive: true
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
        where: {
          categoryId: id,
          status: 'PUBLISHED',
          isActive: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        category,
        courses,
        pagination: {
          page,
          limit,
          total: totalCourses,
          pages: Math.ceil(totalCourses / limit)
        }
      }
    });
  }

  // Create category (admin only)
  static async createCategory(req: Request, res: Response) {
    const validatedData = createCategorySchema.parse(req.body);

    // Check if category name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug: validatedData.slug }
        ]
      }
    });

    if (existingCategory) {
      throw new AppError('Category name or slug already exists', 400);
    }

    const category = await prisma.category.create({
      data: validatedData
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  }

  // Update category (admin only)
  static async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if new name/slug conflicts with existing categories
    if (validatedData.name || validatedData.slug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                validatedData.name ? { name: validatedData.name } : {},
                validatedData.slug ? { slug: validatedData.slug } : {}
              ].filter(condition => Object.keys(condition).length > 0)
            }
          ]
        }
      });

      if (existingCategory) {
        throw new AppError('Category name or slug already exists', 400);
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validatedData
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  }

  // Delete category (admin only)
  static async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true }
        }
      }
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (category._count.courses > 0) {
      throw new AppError('Cannot delete category with existing courses', 400);
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  }

  // Deactivate category (admin only)
  static async deactivateCategory(req: Request, res: Response) {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await prisma.category.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Category deactivated successfully'
    });
  }

  // Activate category (admin only)
  static async activateCategory(req: Request, res: Response) {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await prisma.category.update({
      where: { id },
      data: { isActive: true }
    });

    res.json({
      success: true,
      message: 'Category activated successfully'
    });
  }

  // Get category statistics (admin only)
  static async getCategoryStats(_req: Request, res: Response) {
    const stats = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            courses: {
              where: {
                status: 'PUBLISHED',
                isActive: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const totalCategories = stats.length;
    const activeCategories = stats.filter(cat => cat.isActive).length;
    const totalCourses = stats.reduce((sum, cat) => sum + cat._count.courses, 0);
    
    const categoryStats = stats.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
      courseCount: category._count.courses,
      createdAt: category.createdAt
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalCategories,
          activeCategories,
          inactiveCategories: totalCategories - activeCategories,
          totalCourses
        },
        categories: categoryStats
      }
    });
  }
}
