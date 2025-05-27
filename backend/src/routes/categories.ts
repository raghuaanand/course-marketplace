import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);

// Admin only routes
router.use(authenticate, authorize(UserRole.ADMIN));

router.post('/', CategoryController.createCategory);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);
router.patch('/:id/deactivate', CategoryController.deactivateCategory);
router.patch('/:id/activate', CategoryController.activateCategory);
router.get('/admin/stats', CategoryController.getCategoryStats);

export { router as categoryRoutes };
