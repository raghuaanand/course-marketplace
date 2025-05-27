import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Course reviews (public)
router.get('/courses/:courseId', ReviewController.getCourseReviews);

// Protected routes
router.use(authenticate);

// User reviews
router.post('/courses/:courseId', ReviewController.createReview);
router.put('/courses/:courseId/:reviewId', ReviewController.updateReview);
router.delete('/courses/:courseId/:reviewId', ReviewController.deleteReview);

// User's reviews
router.get('/my-reviews', ReviewController.getUserReviews);

// Instructor analytics
router.get('/instructor/reviews', authorize(UserRole.INSTRUCTOR), ReviewController.getInstructorReviews);
router.get('/instructor/analytics', authorize(UserRole.INSTRUCTOR), ReviewController.getReviewAnalytics);

export { router as reviewRoutes };
