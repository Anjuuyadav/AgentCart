import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Package, Check } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export function OrdersPage() {
  const { orders, lastOrder } = useApp();
  const allOrders = orders.length > 0 ? orders : lastOrder ? [lastOrder] : [];

  return (
    <BuyerLayout>
      <h1 className="mb-8 text-2xl font-bold">Your Orders</h1>

      {allOrders.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted dark:text-muted-light">Start shopping with AI Buyer</p>
          <Link to="/buyer"><Button variant="ai" className="mt-4">Try AI Buyer</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => (
            <Card key={order.id} hover>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={order.productImage} alt={order.productName} className="h-20 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.productName}</p>
                    {order.isAiBuyerOrder && <Badge variant="ai">AI Buyer</Badge>}
                  </div>
                  <p className="text-sm text-muted dark:text-muted-light">Order #{order.orderNumber}</p>
                  <p className="text-sm text-muted dark:text-muted-light">{order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.amount)}</p>
                  <Badge variant={order.status === 'confirmed' ? 'success' : 'default'} className="mt-1 capitalize">{order.status}</Badge>
                </div>
                <Link to={`/orders/${order.orderNumber}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </BuyerLayout>
  );
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { orders, lastOrder } = useApp();
  const order = orders.find((o) => o.orderNumber === id || o.id === id) || (lastOrder?.orderNumber === id ? lastOrder : null);
  const isConfirmed = searchParams.get('confirmed') === 'true';

  if (!order) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">Order not found</h2>
          <Link to="/orders" className="mt-4 inline-block text-violet-ai hover:underline">Back to orders</Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      {isConfirmed && (
        <div className="mb-8 rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20 animate-fade-in">
          <Check className="mx-auto mb-2 h-6 w-6 text-success" />
          <p className="font-semibold text-success">Payment Successful — Order Confirmed</p>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted dark:text-muted-light">{order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <Badge variant="success" className="capitalize">{order.status}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="mb-4 font-semibold">Order Items</h3>
            <div className="flex gap-4">
              <img src={order.productImage} alt={order.productName} className="h-24 w-20 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{order.productName}</p>
                <p className="text-sm text-muted">{order.size} · {order.color} × {order.quantity}</p>
                <p className="mt-1 font-semibold">{formatPrice(order.amount)}</p>
                {order.aiMatchScore && <Badge variant="ai" className="mt-2">{order.aiMatchScore}% AI Match</Badge>}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">Order Timeline</h3>
            <div className="space-y-4">
              {order.timeline.map((event, i) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${event.status === 'completed' ? 'bg-success' : event.status === 'current' ? 'bg-violet-ai animate-pulse-soft' : 'bg-border dark:bg-border-dark'}`} />
                    {i < order.timeline.length - 1 && <div className="w-0.5 flex-1 bg-border dark:bg-border-dark" />}
                  </div>
                  <div className="pb-4">
                    <p className={`font-medium ${event.status === 'pending' ? 'text-muted' : ''}`}>{event.label}</p>
                    {event.status !== 'pending' && (
                      <p className="text-xs text-muted dark:text-muted-light">{event.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 font-semibold">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Status</span><Badge variant="success">Paid</Badge></div>
              <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-semibold">{formatPrice(order.amount)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Method</span><span>Razorpay</span></div>
            </div>
            <Badge variant="warning" className="mt-4">Razorpay Test Mode</Badge>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">Shipping</h3>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-sm text-muted dark:text-muted-light">{order.shippingAddress}</p>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}

export function PreferencesPage() {
  const { preferences, updatePreferences } = useApp();

  return (
    <BuyerLayout>
      <h1 className="mb-2 text-2xl font-bold">Buyer Preferences</h1>
      <p className="mb-8 text-muted dark:text-muted-light">Configure settings for your AI Buyer agent</p>

      <div className="max-w-2xl space-y-6">
        <Card>
          <h3 className="mb-4 font-semibold">Budget & Shopping</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Budget Limit (₹)</label>
              <input
                type="number"
                value={preferences.budgetLimit}
                onChange={(e) => updatePreferences({ budgetLimit: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Preferred Sizes</label>
              <input
                value={preferences.preferredSizes.join(', ')}
                onChange={(e) => updatePreferences({ preferredSizes: e.target.value.split(',').map((s) => s.trim()) })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
                placeholder="M, L"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Preferred Colors</label>
              <input
                value={preferences.preferredColors.join(', ')}
                onChange={(e) => updatePreferences({ preferredColors: e.target.value.split(',').map((s) => s.trim()) })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark"
                placeholder="Wine, Burgundy"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">Purchase Policy</h3>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.autoApproveUnderBudget}
              onChange={(e) => updatePreferences({ autoApproveUnderBudget: e.target.checked })}
              className="h-4 w-4 rounded border-border text-violet-ai focus:ring-violet-ai"
            />
            <span className="text-sm">Auto-approve purchases under budget limit</span>
          </label>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">AI Personalization</h3>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.aiPersonalization}
              onChange={(e) => updatePreferences({ aiPersonalization: e.target.checked })}
              className="h-4 w-4 rounded border-border text-violet-ai focus:ring-violet-ai"
            />
            <span className="text-sm">Enable AI personalization based on preferences</span>
          </label>
        </Card>
      </div>
    </BuyerLayout>
  );
}
