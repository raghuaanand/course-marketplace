import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
const createErrorResponse = <T>(errors: string[], data?: T) => ({
  success: false,
  errors,
  data
});
import { env } from '../utils/env';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: string[] = [];

  // Handle different types of errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = [error.message];
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    
    switch (error.code) {
      case 'P2002':
        message = 'Duplicate entry';
        const target = error.meta?.target as string[] || [];
        errors = [`${target.join(', ')} already exists`];
        break;
      case 'P2025':
        message = 'Record not found';
        errors = ['The requested resource was not found'];
        break;
      case 'P2003':
        message = 'Foreign key constraint failed';
        errors = ['Invalid reference to related resource'];
        break;
      default:
        message = 'Database error';
        errors = [error.message];
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
    errors = [error.message];
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errors = ['Authentication token is invalid'];
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errors = ['Authentication token has expired'];
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
    errors = [error.message];
  }

  // Log error in development/production
  if (env.NODE_ENV === 'development') {
    console.error('Error:', error);
  } else {
    // In production, log to external service (e.g., Sentry, CloudWatch)
    console.error(`${new Date().toISOString()} - ${error.message}`, {
      stack: error.stack,
      url: req.url,
      method: req.method,
      userId: (req as any).user?.id,
    });
  }

  // Don't expose internal error details in production
  if (env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
    errors = ['An unexpected error occurred'];
  }

  const response = createErrorResponse(errors);
  res.status(statusCode).json(response);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
