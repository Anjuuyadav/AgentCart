import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Check, Loader2, CreditCard, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatPrice } from '../../services';
import { purchasePolicyService } from '../../services/purchasePolicyService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { aiBuyerService } from '../../services/aiBuyerService';
import { useApp } from '../../contexts/useApp';
import { getUserFriendlyMessage } from '../../services/apiClient';
import type { PurchasePolicy, FrontendOrder } from '../../types';

type CheckoutStep = 'form' | 'policy' | 'payment' | 'confirmation' | 'error';

export function CheckoutPage() {
  const {
    cart,
    backendCartItems,
    cartTotal,
    clearCart,
    addOrder,
    requirements,
    preferences,
    refreshCart,
    loadOrders,
  } = useApp();
  const navigate = useNavigate();

  // State management
  const [step, setStep] = useState<CheckoutStep>('form');
  const [form, setForm] = useState({
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    address: '42, Green Park Extension, New Delhi - 110016',
  });
  const [policy, setPolicy] = useState<PurchasePolicy | null>(null);
  const [order, setOrder] = useState<FrontendOrder | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  // Loading states
  const [evaluating, setEvaluating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Error states
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && step === 'form') {
      navigate('/cart');
    }
  }, [cart, step, navigate]);

  const cartItems = backendCartItems;
  const mainItem = cartItems[0];
  const mainProductId = mainItem?.productId || '';
  const mainSize = mainItem?.size || '';
  const mainColor = mainItem?.color || '';

  // Step 1: Evaluate Policy
  const handleContinueToPolicy = async () => {
    setEvaluating(true);
    setPolicyError(null);
    try {
      const p = await purchasePolicyService.evaluate({
        productId: mainProductId || undefined,
        budget: requirements?.budget ?? preferences.budgetLimit ?? 10000,
        size: mainSize || undefined,
        color: mainColor || undefined,
        autoApproveUnderBudget: preferences.autoApproveUnderBudget,
      });
      setPolicy(p);
      if (p.status === 'approved') {
        // Log AI action: policy approved
        await aiBuyerService.logAction({
          action_type: 'purchase',
          details: { policyStatus: 'approved', amount: cartTotal },
        }).catch(() => {
          // Silent fail for logging
        });
        setStep('payment');
      } else {
        setStep('policy');
      }
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setPolicyError(msg);
      console.error('[Checkout] Policy evaluation failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  // Step 2: Handle Payment with Razorpay
  const handleProceedToPayment = async () => {
    setProcessing(true);
    setPaymentError(null);
    try {
      // Step 1: Create order in backend (with pending payment status)
      setCreating(true);
      const newOrder = await orderService.createOrder({
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: form.address,
        isAiBuyerOrder: true,
        aiMatchScore: requirements?.aiMatchScore,
      });
      setOrder(newOrder);
      setCreating(false);

      // Step 2: Create Razorpay order
      const razorpayOrder = await paymentService.createRazorpayOrder({
        amount: newOrder.amount,
        receipt: newOrder.orderNumber,
        notes: {
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerEmail: form.email,
        },
      });

      // Step 3: Open Razorpay checkout
      await paymentService.openRazorpayCheckout({
        razorpayOrderId: razorpayOrder.razorpayOrderId,
        keyId: razorpayOrder.keyId,
        amount: newOrder.amount * 100, // Razorpay expects amount in paise
        customerEmail: form.email,
        customerName: form.name,
        description: `Order ${newOrder.orderNumber} - AgentCart`,
        onSuccess: async (paymentId: string, signature: string) => {
          await handlePaymentSuccess(newOrder.id, paymentId, signature, razorpayOrder.razorpayOrderId);
        },
        onError: (error: string) => {
          handlePaymentFailure(newOrder.id, error);
        },
      });
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setPaymentError(msg);
      setStep('error');
      console.error('[Checkout] Payment flow failed:', err);
    } finally {
      setProcessing(false);
      setCreating(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (
    orderId: string,
    paymentId: string,
    signature: string,
    razorpayOrderId: string,
  ) => {
    try {
      setProcessing(true);

      // Capture payment on backend
      const paymentResult = await paymentService.capturePayment(orderId, {
        razorpay_payment_id: paymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: signature,
        amount: cartTotal,
      });

      if (paymentResult.status === 'success') {
        // Log successful payment action
        await aiBuyerService.logAction({
          action_type: 'purchase',
          details: {
            paymentStatus: 'success',
            transactionId: paymentId,
            amount: cartTotal,
          },
        }).catch(() => {
          // Silent fail
        });

        setConfirmationMessage(`Payment successful! Order ${order?.orderNumber} confirmed.`);
        addOrder(order!);
        await clearCart();
        await refreshCart();
        await loadOrders();

        // Redirect to order confirmation
        setTimeout(() => {
          navigate(`/orders/${order?.orderNumber}?confirmed=true`);
        }, 2000);
      } else {
        throw new Error('Payment capture failed');
      }
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setPaymentError(msg);
      setStep('error');
      console.error('[Checkout] Payment capture failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Handle failed payment
  const handlePaymentFailure = async (orderId: string, reason: string) => {
    try {
      // Log payment failure
      await paymentService.handlePaymentFailure(orderId, reason);

      // Log failed payment action
      await aiBuyerService.logAction({
        action_type: 'purchase',
        details: {
          paymentStatus: 'failed',
          reason,
        },
      }).catch(() => {
        // Silent fail
      });

      setPaymentError(reason || 'Payment was cancelled or declined');
      setStep('error');
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setPaymentError(msg);
      setStep('error');
      console.error('[Checkout] Payment failure handling failed:', err);
    }
  };

  // Render empty cart state
  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">Nothing to checkout</h2>
          <p className="mt-2 text-sm text-muted dark:text-muted-light">
            Add some items to your cart first.
          </p>
          <Link to="/cart" className="mt-4 inline-block text-violet-ai hover:underline">
            Return to cart
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Customer Form */}
          {step === 'form' && (
            <>
              <Card>
                <h3 className="mb-4 font-semibold">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Full Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Shipping Address</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
              </Card>

              <Button
                variant="ai"
                size="lg"
                onClick={handleContinueToPolicy}
                disabled={evaluating || !form.name || !form.email || !form.address}
                className="w-full"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating Purchase Policy...
                  </>
                ) : (
                  <>
                    Continue to Purchase Policy <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {policyError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{policyError}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2: Policy Review */}
          {step === 'policy' && policy && (
            <Card className="animate-fade-in">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-violet-ai" />
                <h3 className="font-semibold">Purchase Policy Review</h3>
              </div>

              <div className="mb-6 space-y-3">
                {policy.checks.map((check) => (
                  <div key={check.id} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 mt-0.5 ${check.passed ? 'text-success' : 'text-error'}`}
                    />
                    <div className="flex-1">
                      <p className={check.passed ? '' : 'text-error'}>{check.label}</p>
                      {check.details && (
                        <p className="text-xs text-muted dark:text-muted-light">{check.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`rounded-xl p-4 ${
                  policy.status === 'approved'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : policy.status === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-900/20'
                      : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <p className="text-xs font-medium text-muted dark:text-muted-light">Status</p>
                <p
                  className={`text-lg font-bold uppercase tracking-wider ${
                    policy.status === 'approved'
                      ? 'text-success'
                      : policy.status === 'pending'
                        ? 'text-amber-600'
                        : 'text-error'
                  }`}
                >
                  {policy.status}
                </p>
              </div>

              {policy.status === 'approved' ? (
                <Button
                  variant="ai"
                  size="lg"
                  className="mt-6 w-full"
                  onClick={handleProceedToPayment}
                  disabled={processing || creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Order...
                    </>
                  ) : processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening Razorpay...
                    </>
                  ) : (
                    <>
                      Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Purchase policy not approved. Please review your requirements.
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Step 3: Payment Method */}
          {step === 'payment' && (
            <Card className="animate-fade-in">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-violet-ai" />
                <h3 className="font-semibold">Payment Method</h3>
              </div>

              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <Badge variant="warning">TEST MODE</Badge>
                <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">
                  This is a Razorpay Test Mode payment. No real charges will be made.
                </p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                  Use test card: 4111 1111 1111 1111 | Any future date | Any CVV
                </p>
              </div>

              <div className="rounded-lg border border-border p-4 dark:border-border-dark">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Razorpay Checkout</span>
                  <span className="text-2xl font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-xs text-muted dark:text-muted-light">
                  Secure payment powered by Razorpay
                </p>
              </div>

              {paymentError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{paymentError}</span>
                  </div>
                </div>
              )}

              <Button
                variant="ai"
                size="lg"
                className="mt-6 w-full"
                onClick={handleProceedToPayment}
                disabled={processing || creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Order...
                  </>
                ) : processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening Checkout...
                  </>
                ) : (
                  'Open Razorpay Checkout'
                )}
              </Button>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && order && (
            <Card className="animate-fade-in">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="mb-4 h-12 w-12 text-success animate-bounce" />
                <h3 className="text-xl font-bold">Payment Successful!</h3>
                <p className="mt-2 text-sm text-muted dark:text-muted-light">
                  {confirmationMessage}
                </p>
                <Button
                  variant="ai"
                  size="lg"
                  className="mt-6"
                  onClick={() => navigate(`/orders/${order.orderNumber}`)}
                >
                  View Order Details
                </Button>
              </div>
            </Card>
          )}

          {/* Error State */}
          {step === 'error' && (
            <Card className="animate-fade-in">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-error" />
                <h3 className="text-xl font-bold text-error">Payment Failed</h3>
                <p className="mt-2 text-sm text-muted dark:text-muted-light">
                  {paymentError || 'An error occurred during payment processing'}
                </p>
                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep('form');
                      setPaymentError(null);
                      setPolicy(null);
                      setOrder(null);
                    }}
                  >
                    Try Again
                  </Button>
                  <Button variant="ai" onClick={() => navigate('/cart')}>
                    Return to Cart
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card>
            <h3 className="mb-4 font-semibold">Order Summary</h3>

            {cartItems.length === 0 ? (
              <p className="text-sm text-muted">No items in cart</p>
            ) : (
              <>
                {cartItems.map((item, idx) => {
                  const price = Number(item.unitPrice ?? item.productPrice ?? 0);
                  return (
                    <div key={`${item.id || idx}`} className="mb-4 flex gap-3">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName || 'Product'}
                          className="h-16 w-14 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">
                          {item.productName || item.productId}
                        </p>
                        <p className="text-xs text-muted">
                          {item.size && `${item.size} · `}
                          {item.color && `${item.color} · `}
                          {item.quantity}×
                        </p>
                        <p className="font-semibold">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="border-t border-border pt-4 dark:border-border-dark">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </>
            )}
          </Card>

          {order && (
            <Card className="mt-4 border-success bg-emerald-50 dark:bg-emerald-900/20">
              <h4 className="font-semibold text-success">Order Created</h4>
              <p className="mt-2 text-sm font-mono">{order.orderNumber}</p>
            </Card>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
