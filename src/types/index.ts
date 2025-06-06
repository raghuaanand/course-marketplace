// Prisma generated types
export type {
  User,
  Category,
  Course,
  Module,
  Lesson,
  Quiz,
  QuizQuestion,
  Enrollment,
  LessonProgress,
  QuizSubmission,
  QuizAnswer,
  Review,
  Question,
  Answer,
  Comment,
  Payment,
  Upload,
} from '@prisma/client';

// Prisma generated enums
export {
  UserRole,
  CourseStatus,
  LessonType,
  QuizType,
  EnrollmentStatus,
  PaymentStatus,
  UploadType,
  UploadStatus,
} from '@prisma/client';

// Import these again for use in type definitions below
import type {
  User,
  Category,
  Course,
  Module,
  Lesson,
  Quiz,
  QuizQuestion,
  Enrollment,
  LessonProgress,
  QuizSubmission,
  QuizAnswer,
  Review,
  Question,
  Answer,
  Comment,
  Payment,
  Upload,
  UserRole,
  CourseStatus,
  LessonType,
  QuizType,
  EnrollmentStatus,
  PaymentStatus,
  UploadType,
  UploadStatus,
} from '@prisma/client';

// Custom types for API responses and frontend use
export interface UserWithCourses extends User {
  instructorCourses: Course[];
  enrollments: Enrollment[];
}

export interface CourseWithDetails extends Course {
  instructor: User;
  category: Category;
  modules?: ModuleWithLessons[];
  lessons?: Lesson[]; // Add lessons property for when course has lessons directly
  reviews: ReviewWithUser[];
  enrollments?: Enrollment[];
  _count?: {
    enrollments: number;
    reviews: number;
    modules?: number;
    lessons?: number;
  };
  averageRating?: number;
  totalRevenue?: number;
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface LessonWithProgress extends Lesson {
  progress?: LessonProgress;
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export interface EnrollmentWithCourseDetails extends Enrollment {
  course: CourseWithDetails;
}

export interface EnrollmentWithProgress extends Enrollment {
  lessonProgress: LessonProgress[];
}

export interface ReviewWithUser extends Review {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
}

export interface PaymentWithCourse extends Payment {
  course: Course;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

// Course creation/update types
export interface CreateCourseData {
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  level?: string;
  language?: string;
  requirements?: string[];
  whatYouWillLearn?: string[];
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: CourseStatus;
}

// Module and Lesson types
export interface CreateModuleData {
  title: string;
  description?: string;
  order: number;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  videoUrl?: string;
  videoDuration?: number;
  downloadableFiles?: string[];
  order: number;
  isFree?: boolean;
}

// Payment types
export interface CreatePaymentData {
  courseId: string;
  amount: number;
  currency?: string;
}

export interface StripeCheckoutData {
  sessionId: string;
  url: string;
}

// Upload types
export interface UploadData {
  filename: string;
  mimetype: string;
  size: number;
  uploadType: UploadType;
}

// Search and filter types
export interface CourseFilters {
  category?: string;
  level?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  instructor?: string;
  status?: CourseStatus;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
}

// Cart types (for frontend state management)
export interface CartItem {
  courseId: string;
  course: Pick<Course, 'id' | 'title' | 'price' | 'discountPrice' | 'thumbnail'>;
}

// Progress tracking types
export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt?: Date;
}

// Analytics types
export interface InstructorAnalytics {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  courseStats: {
    courseId: string;
    title: string;
    enrollments: number;
    revenue: number;
    averageRating: number;
  }[];
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
