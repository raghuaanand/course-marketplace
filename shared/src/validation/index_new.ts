import { z } from 'zod';
import { UserRole, CourseStatus, LessonType, QuizType } from '../types';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.STUDENT),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// User validation schemas
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

export const updateCategorySchema = createCategorySchema.partial();

// Course validation schemas
export const createCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(200, 'Short description must be less than 200 characters').optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  discountPrice: z.number().min(0, 'Discount price must be non-negative').optional(),
  categoryId: z.string().min(1, 'Category is required'),
  level: z.string().optional(),
  duration: z.number().min(1, 'Duration must be positive').optional(),
  language: z.string().min(1, 'Language is required').default('English'),
  requirements: z.array(z.string()).optional().default([]),
  whatYouWillLearn: z.array(z.string()).optional().default([]),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  status: z.nativeEnum(CourseStatus).optional(),
});

export const courseQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  level: z.string().optional(),
  language: z.string().optional(),
  status: z.nativeEnum(CourseStatus).optional(),
  sortBy: z.enum(['title', 'price', 'createdAt', 'rating', 'enrollments']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

// Module validation schemas
export const createModuleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  description: z.string().optional(),
  order: z.number().min(0, 'Order must be non-negative'),
});

export const updateModuleSchema = createModuleSchema.partial();

// Lesson validation schemas
export const createLessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  description: z.string().optional(),
  type: z.nativeEnum(LessonType),
  content: z.string().optional(),
  videoUrl: z.string().url('Invalid video URL').optional(),
  videoDuration: z.number().min(0, 'Video duration must be non-negative').optional(),
  order: z.number().min(0, 'Order must be non-negative'),
  isFree: z.boolean().optional().default(false),
});

export const updateLessonSchema = createLessonSchema.partial();

// Quiz validation schemas
export const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  description: z.string().optional(),
  order: z.number().min(0, 'Order must be non-negative'),
  timeLimit: z.number().min(1, 'Time limit must be positive').optional(),
  passingScore: z.number().min(0).max(100, 'Passing score must be between 0 and 100').default(70),
});

export const updateQuizSchema = createQuizSchema.partial();

export const createQuizQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  type: z.nativeEnum(QuizType),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().optional(),
  points: z.number().min(1, 'Points must be positive').default(1),
  order: z.number().min(0, 'Order must be non-negative'),
});

export const updateQuizQuestionSchema = createQuizQuestionSchema.partial();

// Review validation schemas
export const createReviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

// Question and Answer validation schemas
export const createQuestionSchema = z.object({
  title: z.string().min(1, 'Question title is required'),
  content: z.string().min(10, 'Question content must be at least 10 characters'),
});

export const createAnswerSchema = z.object({
  content: z.string().min(10, 'Answer content must be at least 10 characters'),
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(500, 'Comment must be less than 500 characters'),
});

// Payment validation schemas
export const createCheckoutSessionSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional(),
});

// File upload validation schemas
export const uploadFileSchema = z.object({
  type: z.enum(['image', 'video', 'document']),
  maxSize: z.number().optional(),
  allowedTypes: z.array(z.string()).optional(),
});

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Export types for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQueryInput = z.infer<typeof courseQuerySchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type CreateQuizQuestionInput = z.infer<typeof createQuizQuestionSchema>;
export type UpdateQuizQuestionInput = z.infer<typeof updateQuizQuestionSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
