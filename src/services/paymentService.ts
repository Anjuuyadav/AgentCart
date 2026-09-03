import { apiClient } from './apiClient';

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string;
}

export interface PaymentCaptureRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount?: number;
}

export interface PaymentResult {
  id?: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  transactionId?: string;
  message?: string;
}

export const paymentService = {
  /**
   * Create a Razorpay order on the backend
   */
  async createRazorpayOrder(params: {
    amount: number;
    receipt: string;
    notes?: Record<string, unknown>;
  }): Promise<RazorpayOrderResponse> {
    return apiClient.post('/payments/create-order', {
      amount: params.amount,
      receipt: params.receipt,
      notes: params.notes || {},
      orderId: params.notes?.orderId,
    });
  },

  /**
   * Capture a successful payment
   */
  async capturePayment(
    orderId: string,
    payload: PaymentCaptureRequest,
  ): Promise<PaymentResult> {
    console.info('[Payment] capture request started', {
      orderId,
      razorpayOrderId: payload.razorpay_order_id,
      amount: payload.amount,
    });
    const result = await apiClient.post<PaymentResult>(`/payments/${orderId}/capture`, payload);
    console.info('[Payment] capture response received', {
      orderId: result.orderId,
      status: result.status,
      amount: result.amount,
      transactionId: result.transactionId,
    });
    return result;
  },

  /**
   * Handle payment failure
   */
  async handlePaymentFailure(
    orderId: string,
    reason: string,
    razorpayPaymentId?: string,
  ): Promise<PaymentResult> {
    return apiClient.post(`/payments/${orderId}/failure`, {
      reason,
      razorpay_payment_id: razorpayPaymentId,
    });
  },

  /**
   * Get payment details for an order
   */
  async getPaymentForOrder(orderId: string) {
    return apiClient.get(`/payments/${orderId}`);
  },

  /**
   * Load Razorpay script
   */
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  },

  /**
   * Open Razorpay checkout
   */
  async openRazorpayCheckout(params: {
    razorpayOrderId: string;
    keyId: string;
    amount: number;
    customerEmail: string;
    customerName: string;
    description?: string;
    onSuccess: (paymentId: string, signature: string, razorpayOrderId: string) => void;
    onError: (error: string) => void;
  }): Promise<void> {
    const scriptLoaded = await this.loadRazorpayScript();
    if (!scriptLoaded) {
      params.onError('Failed to load Razorpay script');
      return;
    }

    // Type for Razorpay window object
    interface RazorpayCheckout {
      open(): void;
    }

    interface RazorpayConstructor {
      new (options: Record<string, unknown>): RazorpayCheckout;
    }

    const Razorpay = (window as any).Razorpay as RazorpayConstructor;

    if (!Razorpay) {
      params.onError('Razorpay not loaded');
      return;
    }

    const razorpay = new Razorpay({
      key: params.keyId,
      order_id: params.razorpayOrderId,
      amount: params.amount,
      currency: 'INR',
      name: 'AgentCart',
      description: params.description || 'Purchase from AgentCart',
      customer_details: {
        email: params.customerEmail,
        contact: '9000000000', // Dummy contact
      },
      handler: (response: any) => {
        params.onSuccess(
          response.razorpay_payment_id,
          response.razorpay_signature,
          response.razorpay_order_id,
        );
      },
      modal: {
        ondismiss: () => {
          params.onError('Payment cancelled');
        },
      },
      theme: {
        color: '#000000',
      },
    });

    razorpay.open();
  },
};
