import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { AuthController } from '../controllers/AuthController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public routes
router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.post('/refresh', asyncHandler(AuthController.refresh));
router.post('/forgot-password', asyncHandler(AuthController.forgotPassword));
router.post('/reset-password', asyncHandler(AuthController.resetPassword));
router.get('/verify-email/:token', asyncHandler(AuthController.verifyEmail));
router.post('/resend-verification', asyncHandler(AuthController.resendVerification));

// Protected routes
router.post('/logout', authenticate, asyncHandler(AuthController.logout));
router.post('/change-password', authenticate, asyncHandler(AuthController.changePassword));

export { router as authRoutes };
