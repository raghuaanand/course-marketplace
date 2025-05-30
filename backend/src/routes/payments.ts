import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Payment routes
router.post('/create-intent', PaymentController.createPaymentIntent);
router.post('/confirm', PaymentController.confirmPayment);
router.get('/history', PaymentController.getPaymentHistory);
router.get('/earnings', authorize(UserRole.INSTRUCTOR), PaymentController.getInstructorEarnings);
router.get('/:id', PaymentController.getPayment);

// Webhook route (public - no auth required)
router.post('/webhook', (req, _res, next) => {
  // Remove auth middleware for webhook
  req.url = req.url; // Keep original URL
  next();
}, PaymentController.handleWebhook);

export { router as paymentRoutes };
