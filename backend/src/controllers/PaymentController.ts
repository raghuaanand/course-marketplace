import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../utils/prisma';
import { env } from '../utils/env';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const createPaymentIntentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment Intent ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
});

export class PaymentController {
  // Create payment intent for course purchase
  static async createPaymentIntent(req: Request, res: Response) {
    const userId = req.user!.id;
    const { courseId } = createPaymentIntentSchema.parse(req.body);

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.status !== 'PUBLISHED') {
      throw new AppError('Course is not available for purchase', 400);
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      throw new AppError('You are already enrolled in this course', 400);
    }

    // Calculate final price (use discount price if available)
    const finalPrice = course.discountPrice || course.price;
    const finalPriceNumber = Number(finalPrice);
    const amountInCents = Math.round(finalPriceNumber * 100); // Convert to cents

    // Calculate platform fee (5%) and instructor amount
    const platformFeeAmount = finalPriceNumber * 0.05;
    const instructorAmount = finalPriceNumber - platformFeeAmount;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        courseId,
        userId,
        instructorId: course.instructorId,
      },
      description: `Course: ${course.title}`,
    });

    // Store payment record
    await prisma.payment.create({
      data: {
        id: paymentIntent.id,
        userId,
        courseId,
        amount: finalPrice,
        platformFee: platformFeeAmount,
        instructorAmount,
        currency: 'USD',
        status: 'PENDING',
        paymentMethod: 'STRIPE',
        stripePaymentIntentId: paymentIntent.id,
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: finalPrice,
        course: {
          id: course.id,
          title: course.title,
          instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
        }
      }
    });
  }

  // Confirm payment and create enrollment
  static async confirmPayment(req: Request, res: Response) {
    const userId = req.user!.id;
    const { paymentIntentId, courseId } = confirmPaymentSchema.parse(req.body);

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentIntentId },
      include: {
        course: true
      }
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.userId !== userId) {
      throw new AppError('Unauthorized access to payment', 403);
    }

    if (payment.courseId !== courseId) {
      throw new AppError('Payment does not match course', 400);
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment not completed', 400);
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      throw new AppError('Already enrolled in this course', 400);
    }

    // Create enrollment and update payment status in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payment status
      const updatedPayment = await tx.payment.update({
        where: { id: paymentIntentId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        }
      });

      // Create enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          userId,
          courseId,
          enrolledAt: new Date(),
          status: 'ACTIVE',
        },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                }
              }
            }
          }
        }
      });

      // Update course enrollment count
      await tx.course.update({
        where: { id: courseId },
        data: {
          enrollmentCount: {
            increment: 1
          }
        }
      });

      return { payment: updatedPayment, enrollment };
    });

    res.json({
      success: true,
      message: 'Payment confirmed and enrollment created successfully',
      data: {
        payment: result.payment,
        enrollment: result.enrollment,
      }
    });
  }

  // Get user's payment history
  static async getPaymentHistory(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              instructor: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({
        where: { userId }
      })
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  }

  // Get payment details
  static async getPayment(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.userId !== userId) {
      throw new AppError('Unauthorized access to payment', 403);
    }

    res.json({
      success: true,
      data: payment
    });
  }

  // Stripe webhook handler
  static async handleWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      throw new AppError('Missing stripe signature', 400);
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentSuccess(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentFailure(failedPayment);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }

  // Handle successful payment
  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentIntent.id }
    });

    if (!payment) {
      console.error(`Payment ${paymentIntent.id} not found in database`);
      return;
    }

    // Update payment status if not already completed
    if (payment.status !== 'COMPLETED') {
      await prisma.payment.update({
        where: { id: paymentIntent.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        }
      });
    }
  }

  // Handle failed payment
  private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentIntent.id }
    });

    if (!payment) {
      console.error(`Payment ${paymentIntent.id} not found in database`);
      return;
    }

    await prisma.payment.update({
      where: { id: paymentIntent.id },
      data: {
        status: 'FAILED',
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
      }
    });
  }

  // Get instructor earnings
  static async getInstructorEarnings(req: Request, res: Response) {
    const userId = req.user!.id;

    if (req.user!.role !== 'INSTRUCTOR') {
      throw new AppError('Only instructors can access earnings', 403);
    }

    const [totalEarnings, monthlyEarnings, recentPayments] = await Promise.all([
      // Total earnings
      prisma.payment.aggregate({
        where: {
          course: {
            instructorId: userId
          },
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      }),
      
      // Monthly earnings (last 12 months)
      prisma.payment.groupBy({
        by: ['createdAt'],
        where: {
          course: {
            instructorId: userId
          },
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
          }
        },
        _sum: {
          amount: true
        }
      }),
      
      // Recent payments
      prisma.payment.findMany({
        where: {
          course: {
            instructorId: userId
          },
          status: 'COMPLETED'
        },
        include: {
          course: {
            select: {
              title: true
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: 10
      })
    ]);

    res.json({
      success: true,
      data: {
        totalEarnings: totalEarnings._sum.amount || 0,
        monthlyEarnings,
        recentPayments
      }
    });
  }
}
