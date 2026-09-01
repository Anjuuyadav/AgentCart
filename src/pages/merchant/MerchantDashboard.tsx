import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingCart, Bot, DollarSign, Percent, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MerchantLayout } from '../../components/layout/MerchantLayout';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard } from '../../components/ai/AIComponents';
import { formatPrice, aiInsights, products, categoryLabels } from '../../data/mockData';
import { merchantService } from '../../services';
import { useApp } from '../../contexts/AppContext';

function MetricCard({ label, value, icon: Icon, highlight }: { label: string; value: string; icon: React.ElementType; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-violet-ai/30 bg-violet-ai-muted/20 dark:bg-violet-ai/5' : ''}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted dark:text-muted-light">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${highlight ? 'bg-violet-ai/10' : 'bg-charcoal/5 dark:bg-white/5'}`}>
          <Icon className={`h-5 w-5 ${highlight ? 'text-violet-ai' : 'text-muted'}`} />
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Merchant Overview</h1>
        <p className="text-muted dark:text-muted-light">AI-powered revenue insights at a glance</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Total Revenue" value={formatPrice(metrics.totalRevenue)} icon={DollarSign} />
        <MetricCard label="AI-Attributed Revenue" value={formatPrice(metrics.aiAttributedRevenue)} icon={Sparkles} highlight />
        <MetricCard label="Orders" value={String(metrics.orders)} icon={ShoppingCart} />
        <MetricCard label="Conversion Rate" value={`${metrics.conversionRate}%`} icon={Percent} />
        <MetricCard label="Avg Order Value" value={formatPrice(metrics.averageOrderValue)} icon={TrendingUp} />
        <MetricCard label="AI Buyer Orders" value={String(metrics.aiBuyerOrders)} icon={Bot} highlight />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Revenue Trend</CardTitle>
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
                <CartesianGrid strokeDasharray="3 3" className="stroke-border dark:stroke-border-dark" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatPrice(Number(v))} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} name="Total Revenue" />
                <Area type="monotone" dataKey="aiRevenue" stackId="2" stroke="#059669" fill="#059669" fillOpacity={0.3} name="AI Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          {recentAiOrder && (
            <Card className="border-violet-ai/20 animate-slide-up">
              <div className="mb-3 flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-ai" />
                <span className="text-sm font-semibold text-violet-ai">New AI Buyer Order</span>
              </div>
              <div className="flex gap-3">
                <img src={recentAiOrder.productImage} alt="" className="h-16 w-14 rounded-lg object-cover" />
                <div>
                  <p className="font-medium">{recentAiOrder.productName}</p>
                  <p className="text-lg font-semibold">{formatPrice(recentAiOrder.amount)}</p>
                  <p className="text-xs text-muted dark:text-muted-light">AI Buyer matched customer requirements</p>
                </div>
              </div>
            </Card>
          )}

          <div>
            <h3 className="mb-3 font-semibold">AI Insights</h3>
            <div className="space-y-3">
              {aiInsights.slice(0, 2).map((insight) => (
                <AIInsightCard key={insight.id} title={insight.title} description={insight.description} impact={insight.impact} />
              ))}
            </div>
            <Link to="/merchant/ai" className="mt-3 inline-block text-sm font-medium text-violet-ai hover:underline">
              View AI Revenue Agent →
            </Link>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}

export function MerchantProductsPage() {
  return (
    <MerchantLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted dark:text-muted-light">{products.length} products in catalog</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border dark:border-border-dark">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-charcoal/5 dark:border-border-dark dark:bg-white/5">
            <tr>
              <th className="p-4 text-left font-medium">Product</th>
              <th className="p-4 text-left font-medium">Category</th>
              <th className="p-4 text-left font-medium">Price</th>
              <th className="p-4 text-left font-medium">Stock</th>
              <th className="p-4 text-left font-medium">Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: typeof products[0]) => (
              <tr key={product.id} className="border-b border-border dark:border-border-dark">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted dark:text-muted-light">{categoryLabels[product.category]}</td>
                <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                <td className="p-4">{product.variants.reduce((s: number, v: typeof product.variants[0]) => s + v.stock, 0)}</td>
                <td className="p-4">{product.rating} ★</td>
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
      <h1 className="mb-8 text-2xl font-bold">Inventory</h1>
      <div className="space-y-4">
        {products.map((product: typeof products[0]) => (
          <Card key={product.id} padding="sm">
            <div className="flex items-center gap-4">
              <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted">{formatPrice(product.price)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: typeof product.variants[0]) => (
                  <Badge key={v.sku} variant={v.stock <= 5 ? 'warning' : 'default'}>
                    {v.size}/{v.color}: {v.stock}
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
      <h1 className="mb-8 text-2xl font-bold">Orders</h1>
      {allOrders.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-muted dark:text-muted-light">No orders yet. Complete a demo purchase to see orders here.</p>
          <Link to="/buyer" className="mt-4 inline-block text-sm font-medium text-violet-ai hover:underline">Try AI Buyer demo →</Link>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border dark:border-border-dark">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-charcoal/5 dark:border-border-dark dark:bg-white/5">
              <tr>
                <th className="p-4 text-left font-medium">Order</th>
                <th className="p-4 text-left font-medium">Product</th>
                <th className="p-4 text-left font-medium">Customer</th>
                <th className="p-4 text-left font-medium">Amount</th>
                <th className="p-4 text-left font-medium">Source</th>
                <th className="p-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr key={order.id} className="border-b border-border dark:border-border-dark">
                  <td className="p-4 font-medium">#{order.orderNumber}</td>
                  <td className="p-4">{order.productName}</td>
                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4 font-medium">{formatPrice(order.amount)}</td>
                  <td className="p-4">{order.isAiBuyerOrder ? <Badge variant="ai">AI Buyer</Badge> : 'Direct'}</td>
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
