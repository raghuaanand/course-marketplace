import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.post('/change-password', UserController.changePassword);

// Learning routes
router.get('/enrollments', UserController.getMyEnrollments);
router.get('/courses', UserController.getMyCourses);
router.get('/progress', UserController.getLearningProgress);
router.get('/stats', UserController.getUserStats);

export { router as userRoutes };
