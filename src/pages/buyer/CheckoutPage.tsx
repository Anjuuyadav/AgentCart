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
      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Haute Checkout</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Finalize Acquisition</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Autonomous AI policy validation & secured settlement</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {step === 'form' && (
            <>
              <Card>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2]">Client Delivery Profile</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Step 01 / 03</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Full Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Contact Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Private Courier Destination</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors resize-none"
                    />
                  </div>
                </div>
              </Card>
              <Button variant="ai" size="lg" className="w-full justify-center" onClick={handleContinue} disabled={evaluating}>
                {evaluating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#0B0B0C]" /> Evaluating Autonomous Policy...
                  </>
                ) : (
                  'Verify Autonomous Purchase Policy'
                )}
              </Button>
              {policyError && (
                <div className="rounded-[4px] border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-400">
                  <div className="flex gap-2 items-center">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{policyError}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'policy' && policy && (
            <Card className="animate-fade-in">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2]">Autonomous Policy Verification</h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Step 02 / 03</span>
              </div>
              <ul className="mb-6 space-y-3">
                {policy.checks.map((check) => (
                  <li key={check.id} className="flex items-center justify-between p-3 rounded-[4px] bg-[#141417] border border-white/[0.05]">
                    <span className={`text-xs uppercase tracking-wider ${check.passed ? 'text-[#E2E2E2]' : 'text-red-400'}`}>{check.label}</span>
                    <div className="flex items-center gap-1.5">
                      <Check className={`h-4 w-4 ${check.passed ? 'text-emerald-400' : 'text-red-400'}`} />
                      <span className={`text-[10px] uppercase tracking-widest font-mono ${check.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {check.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div
                className={`rounded-[4px] p-4 border ${
                  policy.status === 'approved'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    : policy.status === 'pending'
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
                    : 'bg-red-950/20 border-red-500/30 text-red-400'
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#E2E2E2]/60">Concierge Verification Verdict</p>
                <p className="text-lg font-mono font-bold uppercase tracking-widest mt-1">
                  {policy.status === 'approved' ? '✓ Acquisition Policy Approved' : policy.status}
                </p>
              </div>
              <Button
                variant="ai"
                size="lg"
                className="mt-6 w-full justify-center"
                onClick={handleProceedToPayment}
                disabled={policy.status !== 'approved'}
              >
                Proceed to Secured Settlement
              </Button>
            </Card>
          )}

          {step === 'payment' && (
            <Card className="animate-fade-in">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2]">Secured Settlement Portal</h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Step 03 / 03</span>
              </div>
              <div className="mb-6 rounded-[4px] border border-[#D4AF37]/30 bg-[#141417] p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Razorpay Test Mode</Badge>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Sandbox Active</span>
                </div>
                <p className="mt-2 text-xs text-[#E2E2E2]/70 leading-relaxed">
                  The transaction environment is operating in secure test sandbox mode. Synthetic funds will be used with zero live billing.
                </p>
              </div>
              <div className="rounded-[4px] border border-white/10 bg-[#131314] p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Payable Settlement</span>
                  <span className="font-editorial text-2xl font-bold text-[#E2E2E2]">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[#E2E2E2]/50">
                  Encrypted 256-bit gateway protocol powered by Razorpay
                </p>
              </div>
              {confirmError && (
                <div className="mt-4 rounded-[4px] border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-400">
                  <div className="flex gap-2 items-center">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{confirmError}</span>
                  </div>
                </div>
              )}
              <Button variant="ai" size="lg" className="mt-6 w-full justify-center" onClick={handleConfirmPurchase} disabled={confirming}>
                {confirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#0B0B0C]" /> Authorizing Gateway...
                  </>
                ) : (
                  `Authorize Settlement of ${formatPrice(cartTotal)}`
                )}
              </Button>
            </Card>
          )}

          {step === 'processing' && (
            <Card className="flex flex-col items-center py-16 animate-fade-in border-[#D4AF37]/20">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#D4AF37]" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E2E2E2]">Authorizing Autonomous Settlement</p>
              <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-widest">
                Handshaking with Razorpay Sandbox Gateway...
              </p>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-24">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] pb-3 border-b border-white/[0.06]">
              Acquisition Dossier
            </h3>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, idx) => {
                const price = Number(item.unitPrice ?? item.productPrice ?? 0);
                return (
                  <div key={`${item.id}-${idx}`} className="flex gap-3.5 items-center">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName || ''}
                        className="h-16 w-12 rounded-[2px] object-cover border border-white/10"
                      />
                    ) : (
                      <div className="h-16 w-12 rounded-[2px] bg-[#141417] border border-white/10" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#E2E2E2] truncate uppercase tracking-wider">
                        {item.productName || item.productId}
                      </p>
                      <p className="text-[10px] text-[#E2E2E2]/50 uppercase tracking-widest mt-0.5">
                        {item.size} · {item.color} · Qty {item.quantity}
                      </p>
                      <p className="text-xs font-semibold text-[#D4AF37] font-mono mt-1">
                        {formatPrice(price > 0 ? price * item.quantity : 0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-white/[0.06] pt-4 space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#E2E2E2]/60">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#E2E2E2]/60">
                <span>Courier Service</span>
                <span className="text-[#D4AF37] tracking-widest">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-wider font-semibold text-[#E2E2E2] pt-2 border-t border-white/[0.06]">
                <span>Total Settlement</span>
                <span className="font-mono text-base text-[#D4AF37]">{formatPrice(cartTotal)}</span>
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
        <div className="py-24 text-center">
          <h2 className="font-editorial text-2xl italic text-[#E2E2E2]">No recent acquisition</h2>
          <Link to="/orders" className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-[#D4AF37] hover:underline">
            View archives
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="mx-auto max-w-xl text-center py-10 animate-fade-in">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[4px] border border-[#D4AF37]/40 bg-[#D4AF37]/10">
          <Check className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Autonomous Clearance Confirmed</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1 mb-2">
          Acquisition Secured
        </h1>
        <p className="text-xs text-[#E2E2E2]/60 uppercase tracking-[0.16em] mb-8">
          Order ID #{lastOrder.orderNumber} is scheduled for archival packaging and private dispatch.
        </p>

        <Card className="mb-8 text-left border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Reference #{lastOrder.orderNumber}</span>
            <Badge variant="warning">Razorpay Test Mode</Badge>
          </div>
          <div className="flex gap-4 items-center">
            <img
              src={lastOrder.productImage}
              alt={lastOrder.productName}
              className="h-24 w-18 rounded-[2px] object-cover border border-white/10"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2]">{lastOrder.productName}</p>
              <p className="text-lg font-mono font-bold text-[#D4AF37]">{formatPrice(lastOrder.amount)}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-400">Payment Settled</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center gap-4">
          <Link to={`/orders/${lastOrder.orderNumber}`}>
            <Button variant="ai" size="lg">Inspect Dossier</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="lg">Explore Collection</Button>
          </Link>
        </div>
      </div>
    </BuyerLayout>
  );
}
