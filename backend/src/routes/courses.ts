import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', optionalAuth, CourseController.getCourses);
router.get('/:id', optionalAuth, CourseController.getCourse);

// Protected routes (instructor only)
router.post('/', authenticate, authorize(UserRole.INSTRUCTOR), CourseController.createCourse);
router.put('/:id', authenticate, authorize(UserRole.INSTRUCTOR), CourseController.updateCourse);
router.delete('/:id', authenticate, authorize(UserRole.INSTRUCTOR), CourseController.deleteCourse);

// Lesson routes (authenticated users)
router.get('/:id/lessons', authenticate, CourseController.getCourseLessons);
router.post('/:id/lessons', authenticate, authorize(UserRole.INSTRUCTOR), CourseController.createLesson);
router.put('/:id/lessons/:lessonId', authenticate, authorize(UserRole.INSTRUCTOR), CourseController.updateLesson);
router.delete('/:id/lessons/:lessonId', authenticate, authorize(UserRole.INSTRUCTOR), CourseController.deleteLesson);
router.put('/:id/lessons/reorder', authenticate, authorize(UserRole.INSTRUCTOR), CourseController.reorderLessons);

export { router as courseRoutes };
