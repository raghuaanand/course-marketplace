import { Router } from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Student enrollment routes
router.post('/:courseId/enroll', EnrollmentController.enrollInCourse);
router.get('/:courseId', EnrollmentController.getEnrollment);
router.post('/:courseId/lessons/:lessonId/progress', EnrollmentController.updateLessonProgress);
router.post('/:courseId/complete', EnrollmentController.completeCourse);
router.delete('/:courseId', EnrollmentController.cancelEnrollment);

// Instructor analytics routes
router.get('/:courseId/analytics', authorize(UserRole.INSTRUCTOR), EnrollmentController.getCourseAnalytics);

export { router as enrollmentRoutes };
