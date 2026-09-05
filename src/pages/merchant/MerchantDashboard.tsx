import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingCart, Bot, DollarSign, Percent, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MerchantLayout } from '../../components/layout/MerchantLayout';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard } from '../../components/ai/AIComponents';
import { formatPrice, aiInsights, products, categoryLabels } from '../../data/mockData';
import { merchantService } from '../../services';
import { useApp } from '../../contexts/useApp';

function MetricCard({ label, value, icon: Icon, highlight }: { label: string; value: string; icon: React.ElementType; highlight?: boolean }) {
  return (
    <Card className={`transition-all duration-300 ${highlight ? 'border-[#D4AF37]/35 bg-[#D4AF37]/[0.03] shadow-[0_0_20px_rgba(212,175,55,0.08)]' : 'border-white/[0.06]'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E2E2E2]/60">{label}</p>
          <p className={`mt-1 font-mono text-xl md:text-2xl font-bold tracking-tight ${highlight ? 'text-[#D4AF37]' : 'text-[#E2E2E2]'}`}>{value}</p>
        </div>
        <div className={`rounded-[4px] p-2 ${highlight ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-white/[0.04] text-[#E2E2E2]/60'}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

export function MerchantDashboardPage() {
  const { lastOrder } = useApp();
  const metrics = merchantService.getMetrics();
  const aiOrders = merchantService.getRecentAiBuyerOrders();
  const recentAiOrder = aiOrders[0] || lastOrder;

  return (
    <MerchantLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Command Telemetry</span>
          <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Autonomous Commerce Center</h1>
          <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Real-time AI buyer negotiations, margin velocity & pipeline</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-emerald-500/30 bg-emerald-950/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Agent Network Online</span>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Gross Volume" value={formatPrice(metrics.totalRevenue)} icon={DollarSign} />
        <MetricCard label="AI Attributed" value={formatPrice(metrics.aiAttributedRevenue)} icon={Sparkles} highlight />
        <MetricCard label="Settled Orders" value={String(metrics.orders)} icon={ShoppingCart} />
        <MetricCard label="Conversion Rate" value={`${metrics.conversionRate}%`} icon={Percent} />
        <MetricCard label="Mean Order Value" value={formatPrice(metrics.averageOrderValue)} icon={TrendingUp} />
        <MetricCard label="AI Agent Orders" value={String(metrics.aiBuyerOrders)} icon={Bot} highlight />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Velocity Curve</span>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2] mt-0.5">Revenue Realization Trend</CardTitle>
            </div>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-[#E2E2E2]/70">
                <span className="inline-block h-2 w-2 rounded-full bg-[#D4AF37]" /> Total Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[#E2E2E2]/70">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> AI Attributed
              </span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { date: 'Mon', revenue: 32000, aiRevenue: 0 },
                { date: 'Tue', revenue: 28500, aiRevenue: 0 },
                { date: 'Wed', revenue: 35200, aiRevenue: 0 },
                { date: 'Thu', revenue: 41800, aiRevenue: 0 },
                { date: 'Fri', revenue: 38900, aiRevenue: 0 },
                { date: 'Sat', revenue: 45200, aiRevenue: 0 },
                { date: 'Sun', revenue: 4299 + 32000, aiRevenue: metrics.aiAttributedRevenue },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(226,226,226,0.5)' }} stroke="rgba(255,255,255,0.1)" />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(226,226,226,0.5)' }} stroke="rgba(255,255,255,0.1)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v) => formatPrice(Number(v))}
                  contentStyle={{
                    backgroundColor: '#131314',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '4px',
                    color: '#E2E2E2',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.15} name="Total Revenue" />
                <Area type="monotone" dataKey="aiRevenue" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="AI Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          {recentAiOrder && (
            <Card className="border-[#D4AF37]/35 bg-[#D4AF37]/[0.02] animate-slide-up">
              <div className="mb-3 flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Live AI Agent Settlement</span>
                </div>
                <Badge variant="ai">Verified</Badge>
              </div>
              <div className="flex gap-3.5 items-center">
                <img src={recentAiOrder.productImage} alt="" className="h-18 w-14 rounded-[2px] object-cover border border-white/10 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2] truncate">{recentAiOrder.productName}</p>
                  <p className="text-base font-mono font-bold text-[#D4AF37] mt-0.5">{formatPrice(recentAiOrder.amount)}</p>
                  <p className="text-[10px] text-[#E2E2E2]/60 uppercase tracking-widest mt-1">Autonomous policy match completed</p>
                </div>
              </div>
            </Card>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2]">Intelligence Advisories</h3>
              <Link to="/merchant/ai" className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] hover:underline">
                Revenue Agent →
              </Link>
            </div>
            <div className="space-y-3">
              {aiInsights.slice(0, 2).map((insight) => (
                <AIInsightCard key={insight.id} title={insight.title} description={insight.description} impact={insight.impact} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}

export function MerchantProductsPage() {
  return (
    <MerchantLayout>
      <div className="mb-8 flex items-center justify-between pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Maison Archival Catalog</span>
          <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Garment Inventory</h1>
          <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">{products.length} registered luxury pieces available for autonomous routing</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[4px] border border-white/10 bg-[#131314]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-[#141417]">
            <tr>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Garment Piece</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Silhouette</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Acquisition Price</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Atelier Stock</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Appraisal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {products.map((product: typeof products[0]) => (
              <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="h-12 w-9 rounded-[2px] object-cover border border-white/10 shrink-0" />
                    <span className="font-semibold uppercase tracking-wider text-[#E2E2E2]">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 uppercase tracking-widest text-[#E2E2E2]/60">{categoryLabels[product.category]}</td>
                <td className="p-4 font-mono font-bold text-[#D4AF37]">{formatPrice(product.price)}</td>
                <td className="p-4 font-mono text-[#E2E2E2]/80">{product.variants.reduce((s: number, v: typeof product.variants[0]) => s + v.stock, 0)} units</td>
                <td className="p-4 text-[#D4AF37] font-mono">{product.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MerchantLayout>
  );
}

export function MerchantInventoryPage() {
  return (
    <MerchantLayout>
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Variant Stock Matrix</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Atelier Allocation</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">SKU telemetry and real-time inventory depth across sizes and finishes</p>
      </div>
      <div className="space-y-4">
        {products.map((product: typeof products[0]) => (
          <Card key={product.id} padding="sm" className="border-white/[0.06] hover:border-[#D4AF37]/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={product.image} alt="" className="h-16 w-12 rounded-[2px] object-cover border border-white/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2] truncate">{product.name}</p>
                <p className="font-mono text-sm text-[#D4AF37] mt-0.5">{formatPrice(product.price)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: typeof product.variants[0]) => (
                  <Badge key={v.sku} variant={v.stock <= 5 ? 'warning' : 'default'} className="font-mono text-[10px]">
                    {v.size} / {v.color}: {v.stock}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </MerchantLayout>
  );
}

export function MerchantOrdersPage() {
  const { orders, lastOrder } = useApp();
  const allOrders = orders.length > 0 ? orders : lastOrder ? [lastOrder] : [];

  return (
    <MerchantLayout>
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Commerce Ledger</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Merchant Orders</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Autonomous settlement log and buyer authorization records</p>
      </div>
      {allOrders.length === 0 ? (
        <Card className="py-20 text-center border-dashed border-white/10">
          <p className="text-xs uppercase tracking-widest text-[#E2E2E2]/60">No merchant transactions recorded yet.</p>
          <Link to="/buyer" className="mt-4 inline-block">
            <Button variant="ai" size="sm">Initiate Demo AI Transaction</Button>
          </Link>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-[4px] border border-white/10 bg-[#131314]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#141417]">
              <tr>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Dossier</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Garment</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Client</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Settlement</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Routing Source</th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-[#D4AF37]">#{order.orderNumber}</td>
                  <td className="p-4 font-medium uppercase tracking-wider text-[#E2E2E2]">{order.productName}</td>
                  <td className="p-4 text-[#E2E2E2]/70">{order.customerName}</td>
                  <td className="p-4 font-mono font-bold text-[#E2E2E2]">{formatPrice(order.amount)}</td>
                  <td className="p-4">{order.isAiBuyerOrder ? <Badge variant="ai">AI Concierge</Badge> : <span className="uppercase tracking-widest text-[10px] text-[#E2E2E2]/50">Direct</span>}</td>
                  <td className="p-4"><Badge variant="success" className="capitalize">{order.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MerchantLayout>
  );
}
