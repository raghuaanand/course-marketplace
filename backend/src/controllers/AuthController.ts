import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { env } from '../utils/env';
import { AppError } from '../middleware/errorHandler';
import { EmailService } from '../jobs/emailJobs';

const createSuccessResponse = <T>(data?: T, message?: string) => ({
  success: true,
  message,
  data
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['STUDENT', 'INSTRUCTOR']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6)
});
import { JWTPayload } from '../middleware/auth';

export class AuthController {
  static async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, env.BCRYPT_ROUNDS);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        emailVerificationToken,
        emailVerificationExpires,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Send verification email
    await EmailService.queueEmail(user.email, 'email-verification', {
      firstName: user.firstName,
      verificationUrl: `${env.FRONTEND_URL}/verify-email/${emailVerificationToken}`,
    });

    res.status(201).json(createSuccessResponse({
      user,
      accessToken,
      refreshToken,
    }, 'Registration successful. Please check your email to verify your account.'));
  }

  static async login(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Remove password from response
    const { password, ...userResponse } = user;

    res.json(createSuccessResponse({
      user: userResponse,
      accessToken,
      refreshToken,
    }, 'Login successful'));
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JWTPayload;
      
      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          isActive: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 401);
      }

      if (!user.isActive) {
        throw new AppError('Account is deactivated', 401);
      }

      // Generate new tokens
      const tokens = generateTokens(user);

      res.json(createSuccessResponse(tokens, 'Tokens refreshed successfully'));
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  static async logout(_req: Request, res: Response) {
    // In a more complex setup, you might want to blacklist the token
    // For now, we'll just return a success response
    res.json(createSuccessResponse(undefined, 'Logged out successfully'));
  }

  static async forgotPassword(req: Request, res: Response) {
    const validatedData = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true, firstName: true, email: true },
    });

    if (!user) {
      // Don't reveal whether the email exists
      res.json(createSuccessResponse(undefined, 'If an account with that email exists, you will receive a password reset link.'));
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Send reset email
    await EmailService.queueEmail(user.email, 'password-reset', {
      firstName: user.firstName,
      resetUrl: `${env.FRONTEND_URL}/reset-password/${resetToken}`,
    });

    res.json(createSuccessResponse(undefined, 'If an account with that email exists, you will receive a password reset link.'));
  }

  static async resetPassword(req: Request, res: Response) {
    const validatedData = resetPasswordSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: validatedData.token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, env.BCRYPT_ROUNDS);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.json(createSuccessResponse(undefined, 'Password reset successful'));
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    // Send welcome email
    await EmailService.queueEmail(user.email, 'welcome', {
      firstName: user.firstName,
    });

    res.json(createSuccessResponse(undefined, 'Email verified successfully'));
  }

  static async resendVerification(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        email: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      // Don't reveal whether the email exists
      res.json(createSuccessResponse(undefined, 'If an account with that email exists and is unverified, a new verification email will be sent.'));
      return;
    }

    if (user.isEmailVerified) {
      throw new AppError('Email is already verified', 400);
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Send verification email
    await EmailService.queueEmail(user.email, 'email-verification', {
      firstName: user.firstName,
      verificationUrl: `${env.FRONTEND_URL}/verify-email/${emailVerificationToken}`,
    });

    res.json(createSuccessResponse(undefined, 'Verification email sent'));
  }

  static async changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters long', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json(createSuccessResponse(undefined, 'Password changed successfully'));
  }
}

function generateTokens(user: any) {
  const payload: Omit<JWTPayload, 'type'> = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Default 7 days, can be made configurable later
  );

  return { accessToken, refreshToken };
}
