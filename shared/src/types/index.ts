export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  DOWNLOADABLE = 'DOWNLOADABLE'
}

export enum QuizType {
  MCQ = 'MCQ',
  FILL_IN_BLANKS = 'FILL_IN_BLANKS',
  TRUE_FALSE = 'TRUE_FALSE'
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  stripeCustomerId?: string;
  stripeAccountId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  slug: string;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  status: CourseStatus;
  level?: string;
  duration?: number;
  language: string;
  requirements: string[];
  whatYouWillLearn: string[];
  isActive: boolean;
  publishedAt?: Date;
  instructorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  instructor?: User;
  category?: Category;
  modules?: Module[];
  enrollments?: Enrollment[];
  reviews?: Review[];
  _count?: {
    enrollments: number;
    reviews: number;
  };
  averageRating?: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  videoUrl?: string;
  videoDuration?: number;
  downloadableFiles?: any;
  order: number;
  isFree: boolean;
  isActive: boolean;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
  quizzes?: Quiz[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  order: number;
  timeLimit?: number;
  passingScore: number;
  isActive: boolean;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuizType;
  options?: any;
  correctAnswer: string;
  explanation?: string;
  points: number;
  order: number;
  isActive: boolean;
  quizId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: Date;
  completedAt?: Date;
  certificateUrl?: string;
  lastAccessedAt?: Date;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  course?: Course;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isActive: boolean;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Payment {
  id: string;
  amount: number;
  platformFee: number;
  instructorAmount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  metadata?: any;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  course?: Course;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  isAnswered: boolean;
  isActive: boolean;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  course?: Course;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  isActive: boolean;
  userId: string;
  questionId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  question?: Question;
}

export interface Comment {
  id: string;
  content: string;
  isActive: boolean;
  userId: string;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  lesson?: Lesson;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Auth types
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

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
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
  duration?: number;
  language?: string;
  requirements?: string[];
  whatYouWillLearn?: string[];
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: CourseStatus;
}

// Search and filter types
export interface CourseFilters {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  level?: string;
  language?: string;
  status?: CourseStatus;
}

export interface CourseSearchQuery {
  search?: string;
  filters?: CourseFilters;
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating' | 'enrollments';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Dashboard analytics types
export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  monthlyRevenue: number[];
  userGrowth: number[];
  popularCourses: Course[];
  recentEnrollments: Enrollment[];
}

export interface InstructorStats {
  totalRevenue: number;
  totalCourses: number;
  totalStudents: number;
  totalReviews: number;
  averageRating: number;
  monthlySales: number[];
  topCourses: Course[];
}

// File upload types
export interface UploadedFile {
  url: string;
  publicId: string;
  originalName: string;
  size: number;
  mimeType: string;
}

// Stripe types
export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface StripeConnectAccount {
  accountId: string;
  onboardingUrl?: string;
  isOnboarded: boolean;
}
