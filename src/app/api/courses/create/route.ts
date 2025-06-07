import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { ApiError, handleApiError, withNextAuth } from '@/lib/middleware/nextauth-middleware';

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

export const POST = withNextAuth(
  async (req: NextRequest, user) => {
    const body = await req.json();
    const validatedData = createCourseSchema.parse(body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    });

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        ...validatedData,
        instructorId: user.id,
        slug: generateSlug(validatedData.title),
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
        category: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      data: course
    }, { status: 201 });
  },
  { roles: ['INSTRUCTOR', 'ADMIN'], requireVerification: true }
);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}
