import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Check, Loader2, CreditCard } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getProductById, formatPrice } from '../../data/mockData';
import { aiBuyerService } from '../../services/productService';
import { orderService, paymentService } from '../../services';
import { useApp } from '../../contexts/AppContext';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart, addOrder, requirements, showToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'policy' | 'payment' | 'processing'>('form');
  const [form, setForm] = useState({ name: 'Priya Sharma', email: 'priya.sharma@email.com', address: '42, Green Park Extension, New Delhi - 110016' });
  const [policy, setPolicy] = useState<ReturnType<typeof aiBuyerService.getPurchasePolicy> | null>(null);

  if (cart.length === 0 && step !== 'processing') {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">Nothing to checkout</h2>
          <Link to="/cart" className="mt-4 inline-block text-violet-ai hover:underline">Return to cart</Link>
        </div>
      </BuyerLayout>
    );
  }

  const mainItem = cart[0];
  const product = mainItem ? getProductById(mainItem.productId) : null;

  const handleContinue = () => {
    if (product) {
      const p = aiBuyerService.getPurchasePolicy(product.id, requirements?.budget ?? 10000);
      setPolicy(p);
      setStep('policy');
    }
  };

  const handleProceedToPayment = () => setStep('payment');

  const handleConfirmPurchase = async () => {
    if (!product || !mainItem) return;
    setStep('processing');

    try {
      await paymentService.processPayment(cartTotal);
      const order = await orderService.createOrder({
        productId: product.id,
        quantity: mainItem.quantity,
        size: mainItem.size,
        color: mainItem.color,
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: form.address,
        isAiBuyerOrder: true,
        aiMatchScore: product.aiMatchScore,
      });
      addOrder(order);
      clearCart();
      navigate(`/orders/${order.orderNumber}?confirmed=true`);
    } catch {
      showToast('Payment failed. Please try again.', 'error');
      setStep('payment');
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
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Shipping Address</label>
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" />
                  </div>
                </div>
              </Card>
              <Button variant="ai" onClick={handleContinue}>Continue to Purchase Policy</Button>
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
              <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <p className="text-sm text-muted dark:text-muted-light">Status</p>
                <p className="text-xl font-bold uppercase text-success">{policy.status}</p>
              </div>
              <Button variant="ai" className="mt-6" onClick={handleProceedToPayment} disabled={policy.status !== 'approved'}>
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
                <p className="mt-2 text-sm text-muted dark:text-muted-light">This is a simulated payment. No real charges will be made.</p>
              </div>
              <div className="rounded-xl border border-border p-6 dark:border-border-dark">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Razorpay</span>
                  <span className="text-2xl font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-sm text-muted dark:text-muted-light">Secure payment powered by Razorpay</p>
              </div>
              <Button variant="ai" className="mt-6 w-full" onClick={handleConfirmPurchase}>
                Confirm Purchase
              </Button>
            </Card>
          )}

          {step === 'processing' && (
            <Card className="flex flex-col items-center py-12 animate-fade-in">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-ai" />
              <p className="font-medium">Processing payment...</p>
              <p className="text-sm text-muted dark:text-muted-light">Connecting to Razorpay Test Mode</p>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <h3 className="mb-4 font-semibold">Order Summary</h3>
            {cart.map((item) => {
              const p = getProductById(item.productId);
              if (!p) return null;
              return (
                <div key={item.productId} className="flex gap-3 mb-4">
                  <img src={p.image} alt={p.name} className="h-16 w-14 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted">{item.size} · {item.color} × {item.quantity}</p>
                    <p className="font-semibold">{formatPrice(p.price * item.quantity)}</p>
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
          <Link to="/orders" className="mt-4 inline-block text-violet-ai hover:underline">View all orders</Link>
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
            <img src={lastOrder.productImage} alt={lastOrder.productName} className="h-20 w-16 rounded-lg object-cover" />
            <div>
              <p className="font-medium">{lastOrder.productName}</p>
              <p className="text-lg font-semibold">{formatPrice(lastOrder.amount)}</p>
            </div>
          </div>
          <Badge variant="warning" className="mt-4">Razorpay Test Mode</Badge>
        </Card>
        <div className="flex justify-center gap-3">
          <Link to={`/orders/${lastOrder.orderNumber}`}><Button variant="primary">View Order</Button></Link>
          <Link to="/products"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </div>
    </BuyerLayout>
  );
}
