import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Bot, Sparkles, Loader2, Check } from 'lucide-react';
import { MerchantLayout } from '../../components/layout/MerchantLayout';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard, AIStatus } from '../../components/ai/AIComponents';
import { formatPrice, aiInsights, getProductById, aiRecommendations as initialRecs, aiBuyerActivities, auditEvents } from '../../data/mockData';
import { analyticsService, aiMerchantService, recommendationService } from '../../services';
import { useApp } from '../../contexts/useApp';

export function AnalyticsPage() {
  const data = analyticsService.getData();

  return (
    <MerchantLayout>
      <h1 className="mb-8 text-2xl font-bold">Analytics</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Visitors', value: data.conversionMetrics.totalVisitors.toLocaleString() },
          { label: 'AI Buyer Sessions', value: data.conversionMetrics.aiBuyerSessions.toLocaleString() },
          { label: 'Conversion Rate', value: `${data.conversionMetrics.conversionRate}%` },
          { label: 'AI Conversion Rate', value: `${data.conversionMetrics.aiConversionRate}%` },
        ].map((m) => (
          <Card key={m.label}>
            <p className="text-sm text-muted dark:text-muted-light">{m.label}</p>
            <p className="mt-1 text-2xl font-bold">{m.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardTitle>Orders Trend</CardTitle>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ordersTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#7c3aed" name="Orders" radius={[4, 4, 0, 0]} />
                <Bar dataKey="aiOrders" fill="#059669" name="AI Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Product Performance</CardTitle>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatPrice(Number(v))} />
                <Line type="monotone" dataKey="revenue" stroke="#7c3aed" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </MerchantLayout>
  );
}

export function AIRevenueAgentPage() {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [insights, setInsights] = useState<typeof aiInsights>([]);
  const { showToast } = useApp();

  const runAnalysis = async () => {
    setStatus('analyzing');
    const result = await aiMerchantService.analyze();
    setInsights(result.insights);
    setStatus('complete');
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <MerchantLayout>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-ai/10">
          <Bot className="h-5 w-5 text-violet-ai" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Revenue Agent</h1>
          <p className="text-muted dark:text-muted-light">Intelligent revenue optimization for your store</p>
        </div>
      </div>

      {status === 'analyzing' && (
        <Card className="mb-8">
          <AIStatus status="thinking" label="AI Merchant is analyzing sales..." />
          <div className="mt-4 space-y-2">
            {['Customer pattern detected', 'Cross-sell opportunity found', 'Recommendation generated'].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-sm animate-fade-in" style={{ animationDelay: `${i * 400}ms` }}>
                <Loader2 className="h-4 w-4 animate-spin text-violet-ai" />
                {step}
              </div>
            ))}
          </div>
        </Card>
      )}

      {status === 'complete' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 text-success">
            <Check className="h-5 w-5" />
            <span className="font-medium">Analysis complete</span>
          </div>

          {insights.map((insight) => (
            <AIInsightCard key={insight.id} title={insight.title} description={insight.description} impact={insight.impact} />
          ))}

          <Card className="border-violet-ai/20">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-ai" />
              <span className="font-semibold">Opportunity</span>
            </div>
            <p className="mb-2 text-lg font-medium">Wedding Dress + Gold Statement Earrings</p>
            <p className="mb-4 text-sm text-muted dark:text-muted-light">Expected opportunity: Increase average order value</p>
            <Button variant="ai" onClick={() => { recommendationService.approve('rec-001'); showToast('Recommendation approved'); }}>
              Approve Recommendation
            </Button>
          </Card>
        </div>
      )}
    </MerchantLayout>
  );
}

export function RecommendationsPage() {
  const [recs, setRecs] = useState(initialRecs);
  const { showToast } = useApp();

  const handleApprove = (id: string) => {
    recommendationService.approve(id);
    setRecs([...recommendationService.getAll()]);
    showToast('Recommendation approved');
  };

  const handleReject = (id: string) => {
    recommendationService.reject(id);
    setRecs([...recommendationService.getAll()]);
    showToast('Recommendation rejected', 'info');
  };

  return (
    <MerchantLayout>
      <h1 className="mb-8 text-2xl font-bold">Recommendations</h1>

      <div className="space-y-6">
        {recs.map((rec) => (
          <Card key={rec.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="ai">{rec.type.replace('-', ' ')}</Badge>
                  <Badge variant={rec.status === 'approved' ? 'success' : rec.status === 'rejected' ? 'error' : 'warning'}>{rec.status}</Badge>
                </div>
                <h3 className="text-lg font-semibold">{rec.title}</h3>
                <p className="mt-1 text-sm text-muted dark:text-muted-light">{rec.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {rec.productIds.map((pid) => {
                    const product = getProductById(pid);
                    return product ? (
                      <div key={pid} className="flex items-center gap-2 rounded-lg border border-border p-2 dark:border-border-dark">
                        <img src={product.image} alt="" className="h-10 w-10 rounded object-cover" />
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <p className="mt-3 text-sm"><span className="text-muted">Expected impact:</span> {rec.expectedImpact}</p>
              </div>
              {rec.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="ai" size="sm" onClick={() => handleApprove(rec.id)}>Approve</Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(rec.id)}>Reject</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </MerchantLayout>
  );
}

export function AIBuyerActivityPage() {
  const { lastOrder } = useApp();

  const activities = [...aiBuyerActivities];
  if (lastOrder) {
    activities.push({
      id: 'act-live',
      type: 'purchase' as const,
      productId: lastOrder.productId,
      productName: lastOrder.productName,
      matchScore: lastOrder.aiMatchScore,
      revenue: lastOrder.amount,
      timestamp: lastOrder.createdAt,
    });
  }

  return (
    <MerchantLayout>
      <h1 className="mb-8 text-2xl font-bold">AI Buyer Activity</h1>

      <div className="space-y-4">
        {activities.map((activity: typeof activities[0]) => (
          <Card key={activity.id} padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-ai/10">
                  <Bot className="h-5 w-5 text-violet-ai" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="ai" className="capitalize">{activity.type}</Badge>
                    {activity.matchScore && <span className="text-sm text-muted">{activity.matchScore}% match</span>}
                  </div>
                  <p className="font-medium">{activity.productName || activity.query}</p>
                  <p className="text-xs text-muted dark:text-muted-light">{activity.timestamp.toLocaleString('en-IN')}</p>
                </div>
              </div>
              {activity.revenue && <span className="font-semibold text-success">{formatPrice(activity.revenue)}</span>}
            </div>
          </Card>
        ))}
      </div>
    </MerchantLayout>
  );
}

export function AuditTrailPage() {
  return (
    <MerchantLayout>
      <h1 className="mb-8 text-2xl font-bold">Audit Trail</h1>

      <div className="overflow-x-auto rounded-xl border border-border dark:border-border-dark">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-charcoal/5 dark:border-border-dark dark:bg-white/5">
            <tr>
              <th className="p-4 text-left font-medium">Timestamp</th>
              <th className="p-4 text-left font-medium">Event</th>
              <th className="p-4 text-left font-medium">Actor</th>
              <th className="p-4 text-left font-medium">Status</th>
              <th className="p-4 text-left font-medium">Related</th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.map((event: typeof auditEvents[0]) => (
              <tr key={event.id} className="border-b border-border dark:border-border-dark">
                <td className="p-4 text-muted whitespace-nowrap">{event.timestamp.toLocaleString('en-IN')}</td>
                <td className="p-4 font-medium">{event.event}</td>
                <td className="p-4"><Badge variant={event.actor.includes('AI') ? 'ai' : 'default'}>{event.actor}</Badge></td>
                <td className="p-4"><Badge variant={event.status === 'success' ? 'success' : 'default'}>{event.status}</Badge></td>
                <td className="p-4 text-muted">{event.relatedOrder || event.relatedProduct || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MerchantLayout>
  );
}

export function SettingsPage() {
  const { theme, toggleTheme } = useApp();

  return (
    <MerchantLayout>
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <Card>
          <h3 className="mb-4 font-semibold">Store Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Store Name</label>
              <input defaultValue="AgentCart Fashion" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input defaultValue="merchant@agentcart.com" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">AI Preferences</h3>
          <div className="space-y-3">
            {['Enable AI recommendations', 'Auto-approve bundles', 'Cross-sell enabled'].map((label) => (
              <label key={label} className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-violet-ai focus:ring-violet-ai" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">Appearance</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">Notifications</h3>
          <div className="space-y-3">
            {['New AI Buyer orders', 'Recommendation alerts', 'Low inventory warnings'].map((label) => (
              <label key={label} className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-violet-ai focus:ring-violet-ai" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </MerchantLayout>
  );
}
