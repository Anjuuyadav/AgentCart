import { Request, Response, NextFunction } from 'express';
import { paymentService, type RazorpayPaymentPayload } from '../services/paymentService.js';
import { ValidationError } from '../middleware/errorHandler.js';

function validateRazorpayPayload(
  body: Record<string, unknown>,
): RazorpayPaymentPayload {
  const errors: Record<string, string[]> = {};

  if (!body.razorpay_payment_id || typeof body.razorpay_payment_id !== 'string') {
    errors.razorpay_payment_id = ['Required payment ID'];
  }

  if (!body.razorpay_order_id || typeof body.razorpay_order_id !== 'string') {
    errors.razorpay_order_id = ['Required order ID'];
  }

  if (!body.razorpay_signature || typeof body.razorpay_signature !== 'string') {
    errors.razorpay_signature = ['Required signature'];
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Invalid Razorpay payload', errors);
  }

  return {
    razorpay_payment_id: body.razorpay_payment_id as string,
    razorpay_order_id: body.razorpay_order_id as string,
    razorpay_signature: body.razorpay_signature as string,
  };
}

export const paymentController = {
  async capturePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      if (!orderId) {
        throw new ValidationError('Missing orderId parameter', { orderId: ['Required'] });
      }

      const payload = validateRazorpayPayload(req.body as Record<string, unknown>);

      // Get amount from request body or will be validated against order
      const amount = (req.body.amount as number) || 0;
      console.info('[Payment] capture request received', {
        orderId,
        razorpayOrderId: payload.razorpay_order_id,
        razorpayPaymentId: payload.razorpay_payment_id,
        amount,
      });

      const result = await paymentService.capturePayment({
        orderId,
        razorpayPaymentId: payload.razorpay_payment_id,
        razorpayOrderId: payload.razorpay_order_id,
        razorpaySignature: payload.razorpay_signature,
        amount: amount || 0, // Will be validated against order amount
      });

      console.info('[Payment] capture response ready', {
        orderId: result.orderId,
        status: result.status,
        amount: result.amount,
        transactionId: result.transactionId,
      });
      res.sendData(result);
    } catch (err) {
      next(err);
    }
  },

  async handlePaymentFailure(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      if (!orderId) {
        throw new ValidationError('Missing orderId parameter', { orderId: ['Required'] });
      }

      const reason = (req.body.reason as string) || 'Payment declined';
      const razorpayPaymentId = (req.body.razorpay_payment_id as string) || undefined;

      const result = await paymentService.handlePaymentFailure({
        orderId,
        razorpayPaymentId,
        reason,
      });

      res.sendData(result);
    } catch (err) {
      next(err);
    }
  },

  async getPaymentForOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      if (!orderId) {
        throw new ValidationError('Missing orderId parameter', { orderId: ['Required'] });
      }

      const payment = await paymentService.getPaymentForOrder(orderId);
      res.sendData(payment || { orderId, status: 'not_found', message: 'No payment found' });
    } catch (err) {
      next(err);
    }
  },

  async createRazorpayOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const amount = (req.body.amount as number) || 0;
      const receipt = (req.body.receipt as string) || `order_${Date.now()}`;
      const notes = (req.body.notes as Record<string, unknown>) || {};
      const orderId = typeof req.body.orderId === 'string' ? req.body.orderId : undefined;

      if (!orderId) {
        throw new ValidationError('Missing orderId', { orderId: ['Required'] });
      }

      if (amount <= 0) {
        throw new ValidationError('Invalid amount', { amount: ['Must be greater than 0'] });
      }

      const razorpayOrder = await paymentService.createRazorpayOrder({
        amount: Math.round(amount * 100), // Convert to paise
        receipt,
        notes,
        orderId,
      });

      res.sendData({
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err) {
      next(err);
    }
  },
};
