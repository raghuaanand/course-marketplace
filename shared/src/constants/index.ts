// API Constants
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// Database Constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// JWT Constants
export const JWT_EXPIRES_IN = '7d';
export const JWT_REFRESH_EXPIRES_IN = '30d';

// File Upload Constants
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Video Constants
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const VIDEO_QUALITY_OPTIONS = ['720p', '1080p', '1440p'];

// Email Constants
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email-verification',
  PASSWORD_RESET: 'password-reset',
  COURSE_ENROLLMENT: 'course-enrollment',
  COURSE_COMPLETION: 'course-completion',
  INSTRUCTOR_PAYOUT: 'instructor-payout'
} as const;

// Redis Keys
export const REDIS_KEYS = {
  USER_SESSION: 'session:user:',
  COURSE_CACHE: 'cache:course:',
  SEARCH_CACHE: 'cache:search:',
  EMAIL_QUEUE: 'queue:email',
  VIDEO_PROCESSING_QUEUE: 'queue:video-processing',
  RATE_LIMIT: 'rate-limit:'
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 attempts per window
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per window
  },
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // 10 uploads per hour
  }
} as const;

// Stripe Constants
export const STRIPE_CONFIG = {
  PLATFORM_FEE_PERCENTAGE: 20, // 20% platform fee
  CURRENCY: 'usd'
} as const;

// Course Constants
export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
export const COURSE_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'] as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  EMAIL_NOT_VERIFIED: 'Please verify your email before signing in',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',

  // Course errors
  COURSE_NOT_FOUND: 'Course not found',
  COURSE_ACCESS_DENIED: 'You do not have access to this course',
  COURSE_ALREADY_ENROLLED: 'You are already enrolled in this course',
  COURSE_NOT_PUBLISHED: 'This course is not published',

  // Payment errors
  PAYMENT_FAILED: 'Payment processing failed',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  PAYMENT_ALREADY_PROCESSED: 'Payment has already been processed',

  // General errors
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  FORBIDDEN: 'Access forbidden',
  TOO_MANY_REQUESTS: 'Too many requests'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET: 'Password reset successfully',
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  ENROLLMENT_SUCCESSFUL: 'Enrollment successful',
  PAYMENT_SUCCESSFUL: 'Payment processed successfully',
  REVIEW_CREATED: 'Review created successfully',
  QUESTION_CREATED: 'Question posted successfully',
  ANSWER_CREATED: 'Answer posted successfully'
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
} as const;
