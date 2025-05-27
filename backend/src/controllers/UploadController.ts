import { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../utils/env';
import { AppError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type based on upload type
  const uploadType = req.params.type || req.body.type;
  
  try {
    if (uploadType === 'image') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    } else if (uploadType === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    } else if (uploadType === 'document') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    } else {
      cb(null, true); // Allow all types for general uploads
    }
  } catch (error) {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

export class UploadController {
  // Upload image (avatars, thumbnails, etc.)
  static uploadImage = upload.single('image');
  
  static async handleImageUpload(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    const userId = req.user!.id;
    const uploadType = req.params.type || 'general';

    try {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: `course-marketplace/${uploadType}`,
            transformation: uploadType === 'avatar' 
              ? [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
              : uploadType === 'thumbnail'
              ? [{ width: 400, height: 300, crop: 'fill' }]
              : undefined,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });

      // Save upload record
      const uploadRecord = await prisma.upload.create({
        data: {
          userId,
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: result.secure_url,
          publicId: result.public_id,
          uploadType: uploadType.toUpperCase() as any,
          status: 'COMPLETED',
        }
      });

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          id: uploadRecord.id,
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        }
      });
    } catch (error: any) {
      throw new AppError(`Upload failed: ${error.message}`, 500);
    }
  }

  // Upload video (lessons)
  static uploadVideo = upload.single('video');
  
  static async handleVideoUpload(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError('No video file provided', 400);
    }

    const userId = req.user!.id;
    const { courseId, lessonId } = req.body;

    // Verify instructor owns the course
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        throw new AppError('Course not found', 404);
      }

      if (course.instructorId !== userId) {
        throw new AppError('You can only upload videos to your own courses', 403);
      }
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: `course-marketplace/videos`,
            eager: [
              { quality: 'auto:good', format: 'mp4' },
              { quality: 'auto:low', format: 'mp4' }
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });

      // Save upload record
      const uploadRecord = await prisma.upload.create({
        data: {
          userId,
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: result.secure_url,
          publicId: result.public_id,
          uploadType: 'VIDEO',
          status: 'COMPLETED', // Video upload completed
          metadata: {
            duration: result.duration,
            width: result.width,
            height: result.height,
            format: result.format,
          }
        }
      });

      // Update lesson with video URL if lessonId provided
      if (lessonId) {
        await prisma.lesson.update({
          where: { id: lessonId },
          data: {
            videoUrl: result.secure_url,
            videoDuration: result.duration,
          }
        });
      }

      res.json({
        success: true,
        message: 'Video uploaded successfully',
        data: {
          id: uploadRecord.id,
          url: result.secure_url,
          publicId: result.public_id,
          duration: result.duration,
          width: result.width,
          height: result.height,
        }
      });
    } catch (error: any) {
      throw new AppError(`Video upload failed: ${error.message}`, 500);
    }
  }

  // Upload document (resources, assignments)
  static uploadDocument = upload.single('document');
  
  static async handleDocumentUpload(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError('No document file provided', 400);
    }

    const userId = req.user!.id;
    // const { lessonId } = req.body; // Optional - for linking to specific lesson

    try {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw', // For non-image/video files
            folder: `course-marketplace/documents`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });

      // Save upload record
      const uploadRecord = await prisma.upload.create({
        data: {
          userId,
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: result.secure_url,
          publicId: result.public_id,
          uploadType: 'DOCUMENT',
          status: 'COMPLETED',
        }
      });

      res.json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          id: uploadRecord.id,
          url: result.secure_url,
          publicId: result.public_id,
          filename: req.file.originalname,
        }
      });
    } catch (error: any) {
      throw new AppError(`Document upload failed: ${error.message}`, 500);
    }
  }

  // Get user's uploads
  static async getUserUploads(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const uploadType = req.query.type as string;

    const where: any = { userId };
    if (uploadType) {
      where.uploadType = uploadType.toUpperCase();
    }

    const [uploads, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.upload.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        uploads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Delete upload
  static async deleteUpload(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const upload = await prisma.upload.findUnique({
      where: { id }
    });

    if (!upload) {
      throw new AppError('Upload not found', 404);
    }

    if (upload.userId !== userId) {
      throw new AppError('You can only delete your own uploads', 403);
    }

    try {
      // Delete from Cloudinary
      if (upload.publicId) {
        await cloudinary.uploader.destroy(upload.publicId, {
          resource_type: upload.uploadType === 'VIDEO' ? 'video' : 
                        (upload.uploadType === 'AVATAR' || upload.uploadType === 'THUMBNAIL') ? 'image' : 'raw'
        });
      }

      // Delete from database
      await prisma.upload.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Upload deleted successfully'
      });
    } catch (error: any) {
      throw new AppError(`Failed to delete upload: ${error.message}`, 500);
    }
  }

  // Get upload details
  static async getUpload(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const upload = await prisma.upload.findUnique({
      where: { id }
    });

    if (!upload) {
      throw new AppError('Upload not found', 404);
    }

    if (upload.userId !== userId) {
      throw new AppError('You can only access your own uploads', 403);
    }

    res.json({
      success: true,
      data: upload
    });
  }

  // Update avatar
  static async updateAvatar(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    const userId = req.user!.id;

    try {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'course-marketplace/avatars',
            transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
            public_id: `avatar-${userId}`, // Consistent naming
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });

      // Update user avatar
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatar: result.secure_url },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        }
      });

      res.json({
        success: true,
        message: 'Avatar updated successfully',
        data: {
          user: updatedUser,
          avatarUrl: result.secure_url,
        }
      });
    } catch (error: any) {
      throw new AppError(`Avatar upload failed: ${error.message}`, 500);
    }
  }

  // Bulk upload processing status
  static async getBulkUploadStatus(req: Request, res: Response) {
    const userId = req.user!.id;
    const uploadIds = req.query.ids as string;

    if (!uploadIds) {
      throw new AppError('Upload IDs are required', 400);
    }

    const ids = uploadIds.split(',');
    const uploads = await prisma.upload.findMany({
      where: {
        id: { in: ids },
        userId
      },
      select: {
        id: true,
        status: true,
        filename: true,
        url: true,
        createdAt: true,
      }
    });

    res.json({
      success: true,
      data: uploads
    });
  }
}
