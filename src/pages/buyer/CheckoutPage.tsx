import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Check, Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatPrice } from '../../services';
import { purchasePolicyService } from '../../services/purchasePolicyService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services';
import { useApp } from '../../contexts/useApp';
import { getUserFriendlyMessage } from '../../services/apiClient';
import type { PurchasePolicy } from '../../types';

export function CheckoutPage() {
  const {
    cart,
    backendCartItems,
    cartSubtotal,
    cartTotal,
    clearCart,
    addOrder,
    requirements,
    preferences,
    showToast,
    refreshCart,
    loadOrders,
  } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<'form' | 'policy' | 'payment' | 'processing'>('form');
  const [form, setForm] = useState({
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    address: '42, Green Park Extension, New Delhi - 110016',
  });
  const [policy, setPolicy] = useState<PurchasePolicy | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [order, setOrder] = useState<Awaited<ReturnType<typeof orderService.createOrder>> | null>(null);

  const cartItems = backendCartItems;

  if (cart.length === 0 && step !== 'processing') {
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

  const mainItem = cartItems[0];
  const mainProductId = mainItem?.productId || '';
  const mainSize = mainItem?.size || '';
  const mainColor = mainItem?.color || '';

  const handleContinue = async () => {
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
      setStep('policy');
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setPolicyError(msg);
      console.error('[Checkout] evaluate policy failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleProceedToPayment = () => setStep('payment');

  const handleConfirmPurchase = async () => {
    setConfirming(true);
    setConfirmError(null);
    setStep('processing');
    try {
      const newOrder = order || await orderService.createOrder({
          customerName: form.name,
          customerEmail: form.email,
          shippingAddress: form.address,
          isAiBuyerOrder: true,
          aiMatchScore: undefined,
        });
      setOrder(newOrder);

      const razorpayOrder = await paymentService.createRazorpayOrder({
        amount: newOrder.amount,
        receipt: newOrder.orderNumber,
        notes: {
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerEmail: form.email,
        },
      });

      await paymentService.openRazorpayCheckout({
        razorpayOrderId: razorpayOrder.razorpayOrderId,
        keyId: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        customerEmail: form.email,
        customerName: form.name,
        description: `Order ${newOrder.orderNumber} - AgentCart`,
        onSuccess: async (paymentId, signature, returnedRazorpayOrderId) => {
          try {
            const result = await paymentService.capturePayment(newOrder.id, {
              razorpay_payment_id: paymentId,
              razorpay_order_id: returnedRazorpayOrderId,
              razorpay_signature: signature,
              amount: razorpayOrder.amount,
            });
            if (result.status !== 'success') throw new Error('Payment verification failed');
            addOrder(newOrder);
            await clearCart();
            await refreshCart();
            await loadOrders();
            navigate(`/orders/${newOrder.orderNumber}?confirmed=true`);
          } catch (err) {
            const msg = getUserFriendlyMessage(err);
            setConfirmError(msg);
            showToast(msg, 'error');
            setStep('payment');
          } finally {
            setConfirming(false);
          }
        },
        onError: async (error) => {
          try {
            await paymentService.handlePaymentFailure(newOrder.id, error);
          } catch (failureError) {
            console.error('[Checkout] payment failure recording failed:', failureError);
          }
          setConfirmError(error || 'Payment was cancelled or declined');
          setStep('payment');
          setConfirming(false);
        },
      });
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setConfirmError(msg);
      showToast(msg, 'error');
      console.error('[Checkout] confirm purchase failed:', err);
      setStep('payment');
      setConfirming(false);
    } finally {
      // Razorpay callbacks finish the payment state transition.
    }
  };

  return (
    <BuyerLayout>
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Shipping Address</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
                    />
                  </div>
                </div>
              </Card>
              <Button variant="ai" onClick={handleContinue} disabled={evaluating}>
                {evaluating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Purchase Policy...
                  </>
                ) : (
                  'Continue to Purchase Policy'
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

          {step === 'policy' && policy && (
            <Card className="animate-fade-in">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-violet-ai" />
                <h3 className="font-semibold">Purchase Policy</h3>
              </div>
              <ul className="mb-6 space-y-3">
                {policy.checks.map((check) => (
                  <li key={check.id} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 ${check.passed ? 'text-success' : 'text-error'}`} />
                    <span className={check.passed ? '' : 'text-error'}>{check.label}</span>
                  </li>
                ))}
              </ul>
              <div
                className={`rounded-xl p-4 ${policy.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20' : policy.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}
              >
                <p className="text-sm text-muted dark:text-muted-light">Status</p>
                <p
                  className={`text-xl font-bold uppercase ${policy.status === 'approved' ? 'text-success' : policy.status === 'pending' ? 'text-amber-600' : 'text-error'}`}
                >
                  {policy.status}
                </p>
              </div>
              <Button
                variant="ai"
                className="mt-6"
                onClick={handleProceedToPayment}
                disabled={policy.status !== 'approved'}
              >
                Proceed to Payment
              </Button>
            </Card>
          )}

          {step === 'payment' && (
            <Card className="animate-fade-in">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-violet-ai" />
                <h3 className="font-semibold">Payment</h3>
              </div>
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <Badge variant="warning">Razorpay Test Mode</Badge>
                <p className="mt-2 text-sm text-muted dark:text-muted-light">
                  Razorpay Test Mode is enabled. No real charges will be made.
                </p>
              </div>
              <div className="rounded-xl border border-border p-6 dark:border-border-dark">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Razorpay</span>
                  <span className="text-2xl font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-sm text-muted dark:text-muted-light">
                  Secure payment powered by Razorpay
                </p>
              </div>
              {confirmError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{confirmError}</span>
                  </div>
                </div>
              )}
              <Button variant="ai" className="mt-6 w-full" onClick={handleConfirmPurchase} disabled={confirming}>
                {confirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Confirm Purchase'
                )}
              </Button>
            </Card>
          )}

          {step === 'processing' && (
            <Card className="flex flex-col items-center py-12 animate-fade-in">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-ai" />
              <p className="font-medium">Processing payment...</p>
              <p className="text-sm text-muted dark:text-muted-light">
                Connecting to Razorpay Test Mode
              </p>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <h3 className="mb-4 font-semibold">Order Summary</h3>
            {cartItems.map((item, idx) => {
              const price = Number(item.unitPrice ?? item.productPrice ?? 0);
              return (
                <div key={`${item.id}-${idx}`} className="flex gap-3 mb-4">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName || ''}
                      className="h-16 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-14 rounded-lg bg-surface dark:bg-surface-dark" />
                  )}
                  <div>
                    <p className="text-sm font-medium truncate max-w-[160px]">
                      {item.productName || item.productId}
                    </p>
                    <p className="text-xs text-muted">
                      {item.size} · {item.color} × {item.quantity}
                    </p>
                    <p className="font-semibold">
                      {formatPrice(price > 0 ? price * item.quantity : 0)}
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
              <div className="mt-1 flex justify-between text-xs text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}

export function OrderConfirmationPage() {
  const { lastOrder } = useApp();

  if (!lastOrder) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">No recent order</h2>
          <Link to="/orders" className="mt-4 inline-block text-violet-ai hover:underline">
            View all orders
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="mx-auto max-w-lg text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Order Confirmed</h1>
        <div className="mb-6 space-y-1 text-sm text-success">
          <p>✓ Payment Successful</p>
          <p>✓ Purchase Authorized</p>
        </div>
        <Card className="mb-6 text-left">
          <p className="text-sm text-muted dark:text-muted-light">Order #{lastOrder.orderNumber}</p>
          <div className="mt-4 flex gap-4">
            <img
              src={lastOrder.productImage}
              alt={lastOrder.productName}
              className="h-20 w-16 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium">{lastOrder.productName}</p>
              <p className="text-lg font-semibold">{formatPrice(lastOrder.amount)}</p>
            </div>
          </div>
          <Badge variant="warning" className="mt-4">
            Razorpay Test Mode
          </Badge>
        </Card>
        <div className="flex justify-center gap-3">
          <Link to={`/orders/${lastOrder.orderNumber}`}>
            <Button variant="primary">View Order</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </BuyerLayout>
  );
}
