import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = Router();

// Create Razorpay order
router.post('/create-order', paymentController.createRazorpayOrder);

// Capture payment (verify signature and process)
router.post('/:orderId/capture', paymentController.capturePayment);

// Handle payment failure
router.post('/:orderId/failure', paymentController.handlePaymentFailure);

// Get payment details for an order
router.get('/:orderId', paymentController.getPaymentForOrder);

export { router as paymentRouter };
