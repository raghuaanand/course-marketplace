import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Image uploads
router.post('/image/:type', UploadController.uploadImage, UploadController.handleImageUpload);
router.post('/avatar', UploadController.uploadImage, UploadController.updateAvatar);

// Video uploads
router.post('/video', UploadController.uploadVideo, UploadController.handleVideoUpload);

// Document uploads
router.post('/document', UploadController.uploadDocument, UploadController.handleDocumentUpload);

// Upload management
router.get('/', UploadController.getUserUploads);
router.get('/status', UploadController.getBulkUploadStatus);
router.get('/:id', UploadController.getUpload);
router.delete('/:id', UploadController.deleteUpload);

export { router as uploadRoutes };
