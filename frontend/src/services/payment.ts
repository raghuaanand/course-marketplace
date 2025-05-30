import { loadStripe, Stripe, StripeCardElement, StripeCardNumberElement } from '@stripe/stripe-js';
import { Payment, Enrollment } from '@course-marketplace/shared';
import { apiService } from './api';

export interface PaymentIntentData {
  courseId: string;
  amount: number;
  currency?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentConfirmation {
  paymentIntentId: string;
  success: boolean;
  enrollment?: Enrollment;
  payment?: Payment;
}

class PaymentService {
  private stripe: Stripe | null = null;

  async getStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (stripeKey) {
        this.stripe = await loadStripe(stripeKey);
      }
    }
    return this.stripe;
  }

  async createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResponse> {
    return apiService.post<PaymentIntentResponse>('/payments/create-intent', data);
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentConfirmation> {
    return apiService.post<PaymentConfirmation>('/payments/confirm', {
      paymentIntentId,
    });
  }

  async getPaymentHistory(page = 1, limit = 10): Promise<{
    payments: Payment[];
    total: number;
    totalPages: number;
  }> {
    return apiService.get(`/payments/history?page=${page}&limit=${limit}`);
  }

  async getPayment(paymentId: string): Promise<Payment> {
    return apiService.get<Payment>(`/payments/${paymentId}`);
  }

  async processCardPayment(
    courseId: string,
    amount: number,
    cardElement: StripeCardElement | StripeCardNumberElement,
    billingDetails?: { name?: string; email?: string; address?: { city?: string; country?: string; line1?: string; line2?: string; postal_code?: string; state?: string; } }
  ): Promise<PaymentConfirmation> {
    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await this.createPaymentIntent({
        courseId,
        amount,
      });

      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      // Confirm payment with card
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm payment with backend
        return await this.confirmPayment(paymentIntentId);
      }

      throw new Error('Payment failed');
    } catch (error) {
      throw error;
    }
  }

  // Format currency amount for display
  formatAmount(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount / 100);
  }

  // Convert dollars to cents for Stripe
  convertToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  // Convert cents to dollars for display
  convertToDollars(cents: number): number {
    return cents / 100;
  }
}

export const paymentService = new PaymentService();
