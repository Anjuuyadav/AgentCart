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
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Client Archives</span>
          <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Acquisitions History</h1>
          <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Verified orders settled via autonomous AI protocol</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRetry} disabled={ordersLoading} className="text-[#E2E2E2]/70 hover:text-[#D4AF37]">
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${ordersLoading ? 'animate-spin' : ''}`} />
          Sync
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="py-20 text-center border-dashed border-white/10">
          <Package className="mx-auto mb-4 h-10 w-10 text-[#D4AF37]/50" />
          <h2 className="font-editorial text-2xl italic text-[#E2E2E2]">No Acquisitions Archived</h2>
          <p className="mt-2 text-xs text-[#E2E2E2]/60 uppercase tracking-[0.16em]">Commission the autonomous stylist to curate your first piece</p>
          <Link to="/buyer" className="inline-block mt-6">
            <Button variant="ai">Commission AI Concierge</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} hover className="transition-all duration-300">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {order.productImage ? (
                  <img src={order.productImage} alt={order.productName} className="h-20 w-16 rounded-[2px] object-cover border border-white/10 shrink-0" />
                ) : (
                  <div className="h-20 w-16 rounded-[2px] bg-[#141417] border border-white/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-[#E2E2E2]/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2] truncate">{order.productName || 'Archival Garment'}</p>
                    {order.isAiBuyerOrder && <Badge variant="ai">AI Agent Settled</Badge>}
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] mt-0.5">Dossier #{order.orderNumber}</p>
                  <p className="text-[10px] text-[#E2E2E2]/50 uppercase tracking-widest mt-1">
                    {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono text-base font-bold text-[#E2E2E2]">{formatPrice(order.amount)}</p>
                  <Badge
                    variant={
                      order.status === 'confirmed' || order.status === 'delivered'
                        ? 'success'
                        : order.status === 'cancelled'
                        ? 'error'
                        : order.status === 'processing' || order.status === 'shipped'
                        ? 'warning'
                        : 'default'
                    }
                    className="mt-1.5 capitalize"
                  >
                    {order.status}
                  </Badge>
                </div>
                <Link to={`/orders/${order.orderNumber}`} className="shrink-0">
                  <Button variant="outline" size="sm">Inspect Dossier</Button>
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
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="mt-4 text-xs font-mono uppercase tracking-widest text-[#E2E2E2]/60">Decentralized Archive Querying...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (error) {
    return (
      <BuyerLayout>
        <Card className="border-red-500/30 bg-red-950/20 p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <p className="font-semibold text-sm uppercase tracking-wider text-red-400">Unable to load dossier</p>
          <p className="mt-1 text-xs text-[#E2E2E2]/70">{getUserFriendlyMessage({ message: error } as any)}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
            </Button>
            <Link to="/orders">
              <Button variant="ai" size="sm">Back to Archives</Button>
            </Link>
          </div>
        </Card>
      </BuyerLayout>
    );
  }

  if (!order) {
    return (
      <BuyerLayout>
        <div className="py-24 text-center">
          <h2 className="font-editorial text-2xl italic text-[#E2E2E2]">Acquisition Dossier Not Found</h2>
          <p className="mt-2 text-xs text-[#E2E2E2]/60 uppercase tracking-[0.16em]">Order #{id} could not be located in the archive.</p>
          <Link to="/orders" className="mt-6 inline-block">
            <Button variant="outline">Return to Archives</Button>
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  const statusBadgeVariant = (() => {
    switch (order.status) {
      case 'confirmed':
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'processing':
      case 'shipped':
        return 'warning';
      default:
        return 'default';
    }
  })();

  const paymentBadgeVariant = (() => {
    switch (order.paymentStatus) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  })();

  return (
    <BuyerLayout>
      {isConfirmed && (
        <div className="mb-8 rounded-[4px] border border-emerald-500/30 bg-emerald-950/20 p-4 text-center animate-fade-in">
          <Check className="mx-auto mb-1.5 h-5 w-5 text-emerald-400" />
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">Autonomous Settlement Completed · Acquisition Confirmed</p>
        </div>
      )}

      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Acquisition Dossier</span>
          <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-[#E2E2E2]/50 uppercase tracking-widest mt-1">
            Recorded {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Badge variant={statusBadgeVariant} className="capitalize text-xs px-3 py-1">{order.status}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
              Acquired Pieces
            </h3>
            <div className="flex gap-4 items-center">
              {order.productImage ? (
                <img src={order.productImage} alt={order.productName} className="h-28 w-22 rounded-[2px] object-cover border border-white/10" />
              ) : (
                <div className="h-28 w-22 rounded-[2px] bg-[#141417] border border-white/10 flex items-center justify-center">
                  <Package className="h-8 w-8 text-[#E2E2E2]/40" />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2]">{order.productName || 'Garment Piece'}</p>
                <p className="text-xs text-[#E2E2E2]/60 uppercase tracking-widest">
                  Size {order.size || '—'} · Color {order.color || '—'} · Qty {order.quantity}
                </p>
                <p className="font-mono text-base font-bold text-[#D4AF37] pt-1">{formatPrice(order.amount)}</p>
                {order.aiMatchScore && <Badge variant="ai" className="mt-2">{order.aiMatchScore}% AI Style Match</Badge>}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-6 pb-3 border-b border-white/[0.06]">
              Fulfillment Status & Telemetry
            </h3>
            <div className="space-y-4">
              {(order.timeline || []).length === 0 ? (
                <p className="text-xs text-[#E2E2E2]/50 uppercase tracking-widest">Telemetry timeline initializing...</p>
              ) : (
                (order.timeline || []).map((event, i) => (
                  <div key={event.id || i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        event.status === 'completed'
                          ? 'bg-[#D4AF37]'
                          : event.status === 'current'
                          ? 'bg-[#D4AF37] animate-pulse ring-4 ring-[#D4AF37]/20'
                          : 'bg-white/20'
                      }`} />
                      {i < (order.timeline || []).length - 1 && (
                        <div className="w-px flex-1 bg-white/10 my-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-xs uppercase tracking-wider font-medium ${event.status === 'pending' ? 'text-[#E2E2E2]/40' : 'text-[#E2E2E2]'}`}>{event.label}</p>
                      {event.status !== 'pending' && event.timestamp && (
                        <p className="text-[10px] font-mono text-[#D4AF37]/70 uppercase tracking-widest mt-0.5">
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
              Settlement Protocol
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center uppercase tracking-wider">
                <span className="text-[#E2E2E2]/60">Status</span>
                <Badge variant={paymentBadgeVariant} className="capitalize">{order.paymentStatus}</Badge>
              </div>
              <div className="flex justify-between items-center uppercase tracking-wider">
                <span className="text-[#E2E2E2]/60">Amount</span>
                <span className="font-mono font-bold text-[#D4AF37]">{formatPrice(order.amount)}</span>
              </div>
              <div className="flex justify-between items-center uppercase tracking-wider">
                <span className="text-[#E2E2E2]/60">Gateway</span>
                <span className="text-[#E2E2E2]">Razorpay Secure</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <Badge variant="warning">Razorpay Test Mode</Badge>
            </div>
          </Card>

          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
              Private Dispatch Address
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2]">{order.customerName || 'Client'}</p>
            <p className="text-xs text-[#E2E2E2]/60 mt-1 leading-relaxed">{order.shippingAddress || 'Destination unlisted'}</p>
            {order.customerEmail && (
              <p className="text-[11px] font-mono text-[#D4AF37] mt-2">{order.customerEmail}</p>
            )}
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}

export function PreferencesPage() {
  const { preferences, preferencesLoading, preferencesError, updatePreferences, showToast } = useApp();
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
        showToast('Autonomous preferences committed', 'success');
      }
    } finally {
      setSaving(false);
    }
  };

  if (preferencesLoading && !preferences) {
    return (
      <BuyerLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="mt-4 text-xs font-mono uppercase tracking-widest text-[#E2E2E2]/60">Loading Client Profile...</p>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Concierge Parameters</span>
          <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Autonomous Preferences</h1>
          <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Configure sizing, colorways, and purchase policy limits</p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Unsaved changes</span>
          )}
          <Button
            variant="ai"
            onClick={handleSave}
            disabled={saving || preferencesLoading}
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0B0B0C]" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Commit Preferences
              </>
            )}
          </Button>
        </div>
      </div>

      {preferencesError && (
        <div className="mb-6 rounded-[4px] border border-[#D4AF37]/30 bg-[#141417] p-4 text-xs text-[#E2E2E2]/80">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#D4AF37]" />
            <p>Could not retrieve remote preferences. Local default parameters active.</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
            Styling & Budget Guardrails
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Cap per Autonomous Purchase (₹)</label>
              <input
                type="number"
                min="0"
                value={budgetValue}
                onChange={(e) => { setBudgetValue(e.target.value); markDirty(); }}
                className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 font-mono disabled:opacity-60"
                disabled={saving}
              />
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#E2E2E2]/50">
                The AI Stylist Concierge cannot authorize transactions exceeding this limit without manual override.
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Preferred Garment Sizes</label>
              <input
                value={sizesValue}
                onChange={(e) => { setSizesValue(e.target.value); markDirty(); }}
                className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 disabled:opacity-60"
                placeholder="M, L, XL, 42, 44"
                disabled={saving}
              />
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#E2E2E2]/50">Comma-separated luxury standard sizing.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Favored Palette & Tones</label>
              <input
                value={colorsValue}
                onChange={(e) => { setColorsValue(e.target.value); markDirty(); }}
                className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 disabled:opacity-60"
                placeholder="Obsidian, Bone, Champagne, Midnight"
                disabled={saving}
              />
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#E2E2E2]/50">Comma-separated colorway affinities.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
            Autonomous Purchase Authorization
          </h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => { setAutoApprove(e.target.checked); markDirty(); }}
              className="mt-1 h-4 w-4 rounded-[2px] border-white/20 bg-[#131314] text-[#D4AF37] focus:ring-[#D4AF37]"
              disabled={saving}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2]">Auto-Clear Transactions Within Budget</p>
              <p className="text-[11px] text-[#E2E2E2]/60 mt-0.5 leading-relaxed">
                When enabled, the AI Concierge can complete full checkout for pieces matching your style appraisal if the price sits within the specified cap.
              </p>
            </div>
          </label>
        </Card>

        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
            Neural Style Appraisal Engine
          </h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aiPersonalization}
              onChange={(e) => { setAiPersonalization(e.target.checked); markDirty(); }}
              className="mt-1 h-4 w-4 rounded-[2px] border-white/20 bg-[#131314] text-[#D4AF37] focus:ring-[#D4AF37]"
              disabled={saving}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2]">Enable Neural Personalization</p>
              <p className="text-[11px] text-[#E2E2E2]/60 mt-0.5 leading-relaxed">
                Computes real-time match percentages, colorway harmonies, and personalized silhouette recommendations based on your archival taste graph.
              </p>
            </div>
          </label>
        </Card>
      </div>
    </BuyerLayout>
  );
}
