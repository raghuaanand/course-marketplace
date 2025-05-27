import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize(UserRole.ADMIN));

// Dashboard and analytics
router.get('/dashboard', AdminController.getDashboardStats);
router.get('/analytics/payments', AdminController.getPaymentAnalytics);

// User management
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUser);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);
router.post('/users/admin', AdminController.createAdmin);

// Course management
router.get('/courses', AdminController.getCourses);
router.patch('/courses/:id/status', AdminController.updateCourseStatus);

// System management
router.get('/logs', AdminController.getSystemLogs);
router.get('/export', AdminController.exportData);

export { router as adminRoutes };
