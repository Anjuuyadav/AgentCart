import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Package, Check, Loader2, RefreshCw, AlertCircle, Save } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../services';
import { useApp } from '../../contexts/useApp';
import { orderService } from '../../services/orderService';
import { getUserFriendlyMessage } from '../../services/apiClient';
import type { FrontendOrder } from '../../services/orderService';

export function OrdersPage() {
  const { orders, ordersLoading, ordersLoaded, ordersError, loadOrders } = useApp();

  useEffect(() => {
    if (!ordersLoaded) {
      loadOrders();
    }
  }, [ordersLoaded, loadOrders]);

  const handleRetry = () => {
    loadOrders();
  };

  if (ordersLoading) {
    return (
      <BuyerLayout>
        <h1 className="mb-8 text-2xl font-bold">Your Orders</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-ai" />
          <p className="mt-4 text-muted dark:text-muted-light">Loading orders...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (ordersError) {
    return (
      <BuyerLayout>
        <h1 className="mb-8 text-2xl font-bold">Your Orders</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <p className="font-semibold text-red-700 dark:text-red-400">Unable to load orders</p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">{getUserFriendlyMessage({ message: ordersError } as any)}</p>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Link to="/buyer">
              <Button variant="ai">Browse products</Button>
            </Link>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <Button variant="ghost" size="sm" onClick={handleRetry} disabled={ordersLoading}>
          <RefreshCw className={`h-4 w-4 ${ordersLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted dark:text-muted-light">Start shopping with AI Buyer</p>
          <Link to="/buyer"><Button variant="ai" className="mt-4">Try AI Buyer</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} hover>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {order.productImage ? (
                  <img src={order.productImage} alt={order.productName} className="h-20 w-16 rounded-lg object-cover" />
                ) : (
                  <div className="h-20 w-16 rounded-lg bg-border/50 dark:bg-border-dark/50 flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.productName || 'Order item'}</p>
                    {order.isAiBuyerOrder && <Badge variant="ai">AI Buyer</Badge>}
                  </div>
                  <p className="text-sm text-muted dark:text-muted-light">Order #{order.orderNumber}</p>
                  <p className="text-sm text-muted dark:text-muted-light">
                    {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.amount)}</p>
                  <Badge
                    variant={
                      order.status === 'confirmed' || order.status === 'delivered'
                        ? 'success'
                        : order.status === 'cancelled'
                        ? 'danger'
                        : order.status === 'processing' || order.status === 'shipped'
                        ? 'warning'
                        : 'default'
                    }
                    className="mt-1 capitalize"
                  >
                    {order.status}
                  </Badge>
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
  const { orders, loadOrders } = useApp();
  const [order, setOrder] = useState<FrontendOrder | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfirmed = searchParams.get('confirmed') === 'true';

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fromList = orders.find((o) => o.orderNumber === id || o.id === id);
        if (fromList) {
          setOrder(fromList);
          setLoading(false);
          return;
        }

        try {
          const fetched = await orderService.getById(id);
          if (!cancelled) setOrder(fetched || null);
        } catch (err: any) {
          if (!cancelled) {
            if (err?.statusCode === 404) {
              setOrder(null);
            } else {
              setError(err?.message || 'Failed to load order');
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, orders]);

  const handleRetry = () => {
    loadOrders();
    setError(null);
    setLoading(true);
    if (id) {
      orderService.getById(id)
        .then((o) => { setOrder(o || null); setLoading(false); })
        .catch((err: any) => { setError(err?.message || 'Failed'); setLoading(false); });
    }
  };

  if (loading) {
    return (
      <BuyerLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-ai" />
          <p className="mt-4 text-muted dark:text-muted-light">Loading order details...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (error) {
    return (
      <BuyerLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <p className="font-semibold text-red-700 dark:text-red-400">Unable to load order</p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">{getUserFriendlyMessage({ message: error } as any)}</p>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4" /> Try again
            </Button>
            <Link to="/orders">
              <Button variant="ai">All orders</Button>
            </Link>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  if (!order) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">Order not found</h2>
          <p className="mt-2 text-sm text-muted dark:text-muted-light">Order #{id} could not be located.</p>
          <Link to="/orders" className="mt-4 inline-block text-violet-ai hover:underline">Back to orders</Link>
        </div>
      </BuyerLayout>
    );
  }

  const statusBadgeVariant = (() => {
    switch (order.status) {
      case 'confirmed':
      case 'delivered':
      case 'paid':
        return 'success';
      case 'cancelled':
      case 'failed':
        return 'danger';
      case 'processing':
      case 'shipped':
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  })();

  const paymentBadgeVariant = (() => {
    switch (order.paymentStatus) {
      case 'paid':
        return 'success';
      case 'failed':
        return 'danger';
      case 'pending':
      case 'refunded':
        return 'warning';
      default:
        return 'default';
    }
  })();

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
          <p className="text-muted dark:text-muted-light">
            {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Badge variant={statusBadgeVariant} className="capitalize">{order.status}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="mb-4 font-semibold">Order Items</h3>
            <div className="flex gap-4">
              {order.productImage ? (
                <img src={order.productImage} alt={order.productName} className="h-24 w-20 rounded-lg object-cover" />
              ) : (
                <div className="h-24 w-20 rounded-lg bg-border/50 dark:bg-border-dark/50 flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted" />
                </div>
              )}
              <div>
                <p className="font-medium">{order.productName || 'Order item'}</p>
                <p className="text-sm text-muted">
                  {order.size || '—'} · {order.color || '—'} × {order.quantity}
                </p>
                <p className="mt-1 font-semibold">{formatPrice(order.amount)}</p>
                {order.aiMatchScore && <Badge variant="ai" className="mt-2">{order.aiMatchScore}% AI Match</Badge>}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">Order Timeline</h3>
            <div className="space-y-4">
              {(order.timeline || []).length === 0 ? (
                <p className="text-sm text-muted">Timeline not available.</p>
              ) : (
                (order.timeline || []).map((event, i) => (
                  <div key={event.id || i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${
                        event.status === 'completed'
                          ? 'bg-success'
                          : event.status === 'current'
                          ? 'bg-violet-ai animate-pulse-soft'
                          : 'bg-border dark:bg-border-dark'
                      }`} />
                      {i < (order.timeline || []).length - 1 && (
                        <div className="w-0.5 flex-1 bg-border dark:bg-border-dark" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`font-medium ${event.status === 'pending' ? 'text-muted' : ''}`}>{event.label}</p>
                      {event.status !== 'pending' && event.timestamp && (
                        <p className="text-xs text-muted dark:text-muted-light">
                          {new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 font-semibold">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <Badge variant={paymentBadgeVariant} className="capitalize">{order.paymentStatus}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Amount</span>
                <span className="font-semibold">{formatPrice(order.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Method</span>
                <span>Razorpay</span>
              </div>
            </div>
            <Badge variant="warning" className="mt-4">Razorpay Test Mode</Badge>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">Shipping</h3>
            <p className="text-sm font-medium">{order.customerName || 'Customer'}</p>
            <p className="text-sm text-muted dark:text-muted-light">{order.shippingAddress || 'Address not provided'}</p>
            {order.customerEmail && (
              <p className="text-xs text-muted mt-2">{order.customerEmail}</p>
            )}
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}

export function PreferencesPage() {
  const { preferences, preferencesLoading, preferencesError, updatePreferences, loadPreferences, showToast } = useApp();
  const [saving, setSaving] = useState(false);
  const [budgetValue, setBudgetValue] = useState<string>('');
  const [sizesValue, setSizesValue] = useState<string>('');
  const [colorsValue, setColorsValue] = useState<string>('');
  const [autoApprove, setAutoApprove] = useState<boolean>(true);
  const [aiPersonalization, setAiPersonalization] = useState<boolean>(true);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!preferencesLoading && preferences) {
      setBudgetValue(String(preferences.budgetLimit ?? ''));
      setSizesValue((preferences.preferredSizes || []).join(', '));
      setColorsValue((preferences.preferredColors || []).join(', '));
      setAutoApprove(Boolean(preferences.autoApproveUnderBudget));
      setAiPersonalization(Boolean(preferences.aiPersonalization));
      setDirty(false);
    }
  }, [preferencesLoading, preferences]);

  const markDirty = () => setDirty(true);

  const handleSave = async () => {
    setSaving(true);
    try {
      const budgetNum = Number(budgetValue);
      const sizes = sizesValue
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const colors = colorsValue
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const ok = await updatePreferences({
        budgetLimit: Number.isFinite(budgetNum) && budgetNum >= 0 ? budgetNum : 0,
        preferredSizes: sizes,
        preferredColors: colors,
        autoApproveUnderBudget: autoApprove,
        aiPersonalization: aiPersonalization,
      });

      if (ok) {
        setDirty(false);
        showToast('Preferences saved', 'success');
      }
    } finally {
      setSaving(false);
    }
  };

  if (preferencesLoading && !preferences) {
    return (
      <BuyerLayout>
        <h1 className="mb-2 text-2xl font-bold">Buyer Preferences</h1>
        <p className="mb-8 text-muted dark:text-muted-light">Configure settings for your AI Buyer agent</p>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-ai" />
          <p className="mt-4 text-muted dark:text-muted-light">Loading preferences...</p>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Buyer Preferences</h1>
          <p className="text-muted dark:text-muted-light">Configure settings for your AI Buyer agent</p>
        </div>
        <div className="flex gap-2">
          {dirty && (
            <span className="self-center text-xs text-amber-600 dark:text-amber-400">Unsaved changes</span>
          )}
          <Button
            variant="ai"
            onClick={handleSave}
            disabled={saving || preferencesLoading}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {preferencesError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Could not load saved preferences. Showing defaults — save to persist to your account.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        <Card>
          <h3 className="mb-4 font-semibold">Budget & Shopping</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Budget Limit (₹)</label>
              <input
                type="number"
                min="0"
                value={budgetValue}
                onChange={(e) => { setBudgetValue(e.target.value); markDirty(); }}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark disabled:opacity-60"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-muted dark:text-muted-light">
                Maximum amount the AI Buyer can spend per purchase.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Preferred Sizes</label>
              <input
                value={sizesValue}
                onChange={(e) => { setSizesValue(e.target.value); markDirty(); }}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark disabled:opacity-60"
                placeholder="M, L, XL"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-muted dark:text-muted-light">Comma-separated sizes you typically wear.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Preferred Colors</label>
              <input
                value={colorsValue}
                onChange={(e) => { setColorsValue(e.target.value); markDirty(); }}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark disabled:opacity-60"
                placeholder="Wine, Burgundy, Black"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-muted dark:text-muted-light">Comma-separated color preferences.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">Purchase Policy</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => { setAutoApprove(e.target.checked); markDirty(); }}
              className="mt-0.5 h-4 w-4 rounded border-border text-violet-ai focus:ring-violet-ai"
              disabled={saving}
            />
            <div>
              <p className="text-sm font-medium">Auto-approve purchases under budget limit</p>
              <p className="text-xs text-muted dark:text-muted-light mt-0.5">
                When enabled, AI Buyer can finalize purchases within budget without manual approval.
              </p>
            </div>
          </label>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">AI Personalization</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aiPersonalization}
              onChange={(e) => { setAiPersonalization(e.target.checked); markDirty(); }}
              className="mt-0.5 h-4 w-4 rounded border-border text-violet-ai focus:ring-violet-ai"
              disabled={saving}
            />
            <div>
              <p className="text-sm font-medium">Enable AI personalization based on preferences</p>
              <p className="text-xs text-muted dark:text-muted-light mt-0.5">
                Tailor recommendations and match scores to your saved sizes, colors, and style.
              </p>
            </div>
          </label>
        </Card>
      </div>
    </BuyerLayout>
  );
}
