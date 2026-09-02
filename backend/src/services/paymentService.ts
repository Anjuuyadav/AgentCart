import crypto from 'crypto';
import { paymentRepository, auditRepository } from '../repositories/commonRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { AppError, NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler.js';
import type { Order } from '../types/index.js';

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, unknown>;
  created_at: number;
}

export interface RazorpayPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentResult {
  id?: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  transactionId?: string;
  rawResponse?: Record<string, unknown>;
  message?: string;
}

const RAZORPAY_API_URL = 'https://api.razorpay.com/v1';

function getRazorpayCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    throw new AppError('Razorpay credentials are not configured', 500, 'RAZORPAY_NOT_CONFIGURED');
  }
  return { keyId, keySecret };
}

export const paymentService = {
  async createRazorpayOrder(params: {
    amount: number; // in paise
    receipt: string;
    notes?: Record<string, unknown>;
    orderId?: string;
  }): Promise<RazorpayOrder> {
    const { keyId, keySecret } = getRazorpayCredentials();
    const currency = 'INR';
    console.info('[Razorpay] order creation started', { amount: params.amount, currency });

    let response: Response;
    try {
      response = await fetch(`${RAZORPAY_API_URL}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: params.amount,
          currency,
          receipt: params.receipt,
          notes: params.notes || {},
        }),
      });
    } catch (err) {
      console.error('[Razorpay] order creation failed', { message: err instanceof Error ? err.message : 'Network error' });
      throw new AppError('Unable to reach Razorpay', 502, 'RAZORPAY_UNAVAILABLE');
    }

    const rawBody = await response.text();
    let body: Record<string, unknown> = {};
    try {
      body = rawBody ? JSON.parse(rawBody) as Record<string, unknown> : {};
    } catch {
      body = {};
    }

    if (!response.ok) {
      const errorBody = (body.error || {}) as Record<string, unknown>;
      const description = typeof errorBody.description === 'string'
        ? errorBody.description
        : 'Razorpay order creation failed';
      console.error('[Razorpay] order creation failed', { status: response.status, amount: params.amount, currency });
      if (response.status === 401) {
        throw new AppError('Razorpay authentication failed. Check the Test Mode credentials.', 502, 'RAZORPAY_AUTH_ERROR');
      }
      if (response.status === 400) {
        throw new ValidationError(description, { razorpay: [description] });
      }
      if (response.status === 500) {
        throw new AppError('Razorpay is temporarily unavailable', 502, 'RAZORPAY_SERVER_ERROR');
      }
      throw new AppError('Razorpay could not create the order', 502, 'RAZORPAY_API_ERROR');
    }

    const razorpayOrder = body as unknown as RazorpayOrder;
    console.info('[Razorpay] order creation succeeded', {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
    if (params.orderId) {
      await paymentRepository.updateRazorpayOrderId(params.orderId, razorpayOrder.id);
    }
    return razorpayOrder;
  },

  verifyPaymentSignature(
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string,
  ): boolean {
    const { keySecret } = getRazorpayCredentials();
    // Production signature verification
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');
    const expected = Buffer.from(expectedSignature, 'utf8');
    const actual = Buffer.from(razorpaySignature, 'utf8');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  },

  /**
   * Process payment success
   */
  async capturePayment(params: {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
    amount: number;
  }): Promise<PaymentResult> {
    // Verify order exists
    const order = await orderRepository.findById(params.orderId);
    if (!order) {
      throw new NotFoundError('Order', params.orderId);
    }

    // Verify payment hasn't already been processed
    const existingPayment = await paymentRepository.findByOrderId(params.orderId);
    console.info('[Payment] capture state loaded', {
      orderId: params.orderId,
      orderFound: true,
      paymentStatus: existingPayment?.status || 'not_found',
      razorpayOrderId: params.razorpayOrderId,
      amount: params.amount,
    });
    if (existingPayment && existingPayment.status === 'success') {
      throw new ConflictError(
        'Payment already processed for this order',
        'DUPLICATE_PAYMENT',
      );
    }

    // Verify signature
    const isSignatureValid = this.verifyPaymentSignature(
      params.razorpayPaymentId,
      params.razorpayOrderId,
      params.razorpaySignature,
    );

    if (!isSignatureValid) {
      // Log failed payment
      await auditRepository.create({
        actor: 'system',
        event: 'payment.signature_verification_failed',
        status: 'error',
        relatedOrderId: order.id,
        relatedOrderNumber: order.orderNumber,
        metadata: {
          razorpayPaymentId: params.razorpayPaymentId,
          razorpayOrderId: params.razorpayOrderId,
        },
      });

      throw new ValidationError('Payment signature verification failed', {
        signature: ['Invalid payment signature'],
      });
    }

    const existingRazorpayOrderId = existingPayment?.rawResponse?.razorpayOrderId;
    if (existingRazorpayOrderId && existingRazorpayOrderId !== params.razorpayOrderId) {
      throw new ValidationError('Payment order does not match the AgentCart order', {
        razorpay_order_id: ['Order ID mismatch'],
      });
    }

    // Verify amount matches
    if (params.amount !== order.totalAmount * 100) {
      // Amount in paise, order total in rupees
      await auditRepository.create({
        actor: 'system',
        event: 'payment.amount_mismatch',
        status: 'warning',
        relatedOrderId: order.id,
        relatedOrderNumber: order.orderNumber,
        metadata: {
          expectedAmount: order.totalAmount * 100,
          receivedAmount: params.amount,
        },
      });

      throw new ValidationError('Payment amount does not match order total', {
        amount: ['Amount mismatch'],
      });
    }

    // Create/update payment record
    const payment = existingPayment
      ? await paymentRepository.updateStatus(existingPayment.id!, 'success', params.razorpayPaymentId, {
        ...(existingPayment.rawResponse || {}),
        razorpayOrderId: params.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId,
      })
      : await paymentRepository.create({
        orderId: params.orderId,
        amount: order.totalAmount,
        method: 'razorpay',
        status: 'success',
        transactionId: params.razorpayPaymentId,
        rawResponse: {
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
        },
      });
    if (!payment) {
      throw new AppError('Unable to update payment record', 500, 'PAYMENT_UPDATE_FAILED');
    }
    console.info('[Payment] payment record updated', {
      orderId: params.orderId,
      paymentStatus: payment.status,
      razorpayOrderId: params.razorpayOrderId,
      razorpayPaymentId: params.razorpayPaymentId,
      amount: order.totalAmount,
    });

    // Update order payment status
    await orderRepository.updatePaymentStatus(params.orderId, 'success');

    // Log successful payment
    await auditRepository.create({
      actor: 'system',
      event: 'payment.captured',
      status: 'success',
      relatedOrderId: order.id,
      relatedOrderNumber: order.orderNumber,
      metadata: {
        amount: order.totalAmount,
        transactionId: params.razorpayPaymentId,
        razorpayOrderId: params.razorpayOrderId,
      },
    });
    console.info('[Payment] capture completed', {
      orderId: params.orderId,
      paymentStatus: 'success',
      orderPaymentStatus: 'success',
      razorpayOrderId: params.razorpayOrderId,
      amount: order.totalAmount,
    });

    return {
      id: payment.id,
      orderId: params.orderId,
      amount: order.totalAmount,
      status: 'success',
      transactionId: params.razorpayPaymentId,
      message: 'Payment processed successfully',
    };
  },

  /**
   * Handle payment failure
   */
  async handlePaymentFailure(params: {
    orderId: string;
    razorpayPaymentId?: string;
    reason: string;
  }): Promise<PaymentResult> {
    const order = await orderRepository.findById(params.orderId);
    if (!order) {
      throw new NotFoundError('Order', params.orderId);
    }

    // Don't allow failure if payment already succeeded
    const existingPayment = await paymentRepository.findByOrderId(params.orderId);
    if (existingPayment && existingPayment.status === 'success') {
      throw new ConflictError(
        'Cannot mark payment as failed: payment already successful',
        'INVALID_PAYMENT_STATE',
      );
    }

    // Create or update payment record
    const payment = await paymentRepository.create({
      orderId: params.orderId,
      amount: order.totalAmount,
      method: 'razorpay',
      status: 'failed',
      transactionId: params.razorpayPaymentId,
      rawResponse: {
        failure_reason: params.reason,
      },
    });

    // Update order payment status
    await orderRepository.updatePaymentStatus(params.orderId, 'failed');

    // Log failed payment
    await auditRepository.create({
      actor: 'system',
      event: 'payment.failed',
      status: 'error',
      relatedOrderId: order.id,
      relatedOrderNumber: order.orderNumber,
      metadata: {
        reason: params.reason,
        transactionId: params.razorpayPaymentId,
      },
    });

    return {
      id: payment.id,
      orderId: params.orderId,
      amount: order.totalAmount,
      status: 'failed',
      transactionId: params.razorpayPaymentId,
      message: `Payment failed: ${params.reason}`,
    };
  },

  /**
   * Get payment details for an order
   */
  async getPaymentForOrder(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order', orderId);
    }

    const payment = await paymentRepository.findByOrderId(orderId);
    if (!payment) {
      return null;
    }

    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
    };
  },

};
