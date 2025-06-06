import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { ApiError, handleApiError, withAuth } from '@/lib/middleware/auth';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const createPaymentIntentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

export const POST = withAuth(
  async (req: NextRequest, user) => {
    const body = await req.json();
    const { courseId } = createPaymentIntentSchema.parse(body);

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        discountPrice: true,
        instructorId: true,
      }
    });

    if (!course) {
      throw new ApiError('Course not found', 404);
    }

    // Check if user is not the instructor
    if (course.instructorId === user.id) {
      throw new ApiError('Cannot enroll in your own course', 400);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        status: { in: ['ACTIVE', 'COMPLETED'] }
      }
    });

    if (existingEnrollment) {
      throw new ApiError('Already enrolled in this course', 400);
    }

    const finalPrice = course.discountPrice || course.price;
    const amount = Math.round(Number(finalPrice) * 100); // Convert to cents

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        courseId: course.id,
        studentId: user.id,
        courseTitle: course.title,
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        amount: finalPrice,
        platformFee: Number(finalPrice) * 0.1, // 10% platform fee
        instructorAmount: Number(finalPrice) * 0.9, // 90% to instructor
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
        amount: Number(finalPrice),
      }
    });
  },
  { requireVerification: true }
);
