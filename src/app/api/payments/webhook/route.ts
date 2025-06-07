import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { handleApiError } from '@/lib/middleware/auth';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    return handleApiError(error);
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { courseId, studentId } = paymentIntent.metadata;

  if (!courseId || !studentId) {
    console.error('Missing metadata in payment intent:', paymentIntent.id);
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update payment status
      await tx.payment.updateMany({
        where: {
          stripePaymentIntentId: paymentIntent.id,
          status: 'PENDING'
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        }
      });

      // Create enrollment
      await tx.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: studentId,
            courseId,
          }
        },
        update: {
          status: 'ACTIVE',
        },
        create: {
          userId: studentId,
          courseId,
          status: 'ACTIVE',
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
    });
// 
    // console.log(`Payment successful for course ${courseId} and student ${studentId}`);
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    await prisma.payment.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING'
      },
      data: {
        status: 'FAILED',
      }
    });

    console.log(`Payment failed for payment intent: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}
