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
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Performance Metrics</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Autonomous Analytics</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Conversion velocity and AI Buyer engagement across the collective</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Collective Impressions', value: data.conversionMetrics.totalVisitors.toLocaleString() },
          { label: 'AI Concierge Sessions', value: data.conversionMetrics.aiBuyerSessions.toLocaleString() },
          { label: 'Organic Conversion', value: `${data.conversionMetrics.conversionRate}%` },
          { label: 'AI Attributed Conversion', value: `${data.conversionMetrics.aiConversionRate}%`, highlight: true },
        ].map((m) => (
          <Card key={m.label} className={m.highlight ? 'border-[#D4AF37]/35 bg-[#D4AF37]/[0.02]' : 'border-white/[0.06]'}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E2E2E2]/60">{m.label}</p>
            <p className={`mt-1 font-mono text-2xl font-bold tracking-tight ${m.highlight ? 'text-[#D4AF37]' : 'text-[#E2E2E2]'}`}>{m.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <div className="mb-4 pb-3 border-b border-white/[0.06]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Acquisition Volume</span>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2] mt-0.5">Order Throughput Breakdown</CardTitle>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ordersTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(226,226,226,0.5)' }} stroke="rgba(255,255,255,0.1)" />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(226,226,226,0.5)' }} stroke="rgba(255,255,255,0.1)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131314',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '4px',
                    color: '#E2E2E2',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="orders" fill="#E2E2E2" name="Organic Orders" radius={[2, 2, 0, 0]} />
                <Bar dataKey="aiOrders" fill="#D4AF37" name="AI Agent Orders" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 pb-3 border-b border-white/[0.06]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Silhouette Velocity</span>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2] mt-0.5">Revenue Yield per Piece</CardTitle>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.productPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(226,226,226,0.5)' }} angle={-20} textAnchor="end" height={60} stroke="rgba(255,255,255,0.1)" />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(226,226,226,0.5)' }} stroke="rgba(255,255,255,0.1)" />
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
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 3 }} name="Revenue" />
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
      <div className="mb-8 flex items-center justify-between pb-6 border-b border-white/[0.06] flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Bot className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Autonomous Yield Strategist</span>
            <h1 className="font-editorial text-3xl italic text-[#E2E2E2] font-normal tracking-wide mt-0.5">AI Revenue Agent</h1>
            <p className="text-xs text-[#E2E2E2]/60 mt-0.5 uppercase tracking-[0.14em]">Dynamic margin optimization and cross-sell neural network</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={runAnalysis} disabled={status === 'analyzing'}>
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#D4AF37]" />
          Recompute Graph
        </Button>
      </div>

      {status === 'analyzing' && (
        <Card className="mb-8 border-[#D4AF37]/30">
          <AIStatus status="thinking" label="AI Strategist is synthesizing catalog telemetry..." />
          <div className="mt-4 space-y-2.5">
            {['Parsing customer affinity vectors', 'Synthesizing cross-silhouette pairings', 'Generating yield-maximizing bundles'].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#E2E2E2]/80 animate-fade-in" style={{ animationDelay: `${i * 400}ms` }}>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" />
                {step}
              </div>
            ))}
          </div>
        </Card>
      )}

      {status === 'complete' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
            <Check className="h-4 w-4" />
            <span>Neural Graph Synthesis Complete · 3 Recommendations Ready</span>
          </div>

          {insights.map((insight) => (
            <AIInsightCard key={insight.id} title={insight.title} description={insight.description} impact={insight.impact} />
          ))}

          <Card className="border-[#D4AF37]/35 bg-[#D4AF37]/[0.02]">
            <div className="mb-3 flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Archival Opportunity</span>
              </div>
              <Badge variant="ai">+24% Expected Margin</Badge>
            </div>
            <p className="font-editorial text-lg italic text-[#E2E2E2] mb-1">Evening Silk Gown + Handcrafted Gold Earrings</p>
            <p className="mb-4 text-xs text-[#E2E2E2]/70 leading-relaxed">
              Synthesized from high correlation in client concierge inquiries looking for black-tie gala coordination.
            </p>
            <Button variant="ai" onClick={() => { recommendationService.approve('rec-001'); showToast('Archival bundle activated'); }}>
              Authorize Bundle Strategy
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
    showToast('Autonomous recommendation authorized', 'success');
  };

  const handleReject = (id: string) => {
    recommendationService.reject(id);
    setRecs([...recommendationService.getAll()]);
    showToast('Recommendation dismissed', 'info');
  };

  return (
    <MerchantLayout>
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Neural Merchandising</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Autonomous Recommendations</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Algorithmic garment bundles and pricing strategy proposals</p>
      </div>

      <div className="space-y-6">
        {recs.map((rec) => (
          <Card key={rec.id} className="border-white/[0.06] hover:border-[#D4AF37]/30 transition-all">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="ai">{rec.type.replace('-', ' ')}</Badge>
                  <Badge variant={rec.status === 'approved' ? 'success' : rec.status === 'rejected' ? 'error' : 'warning'}>{rec.status}</Badge>
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2]">{rec.title}</h3>
                <p className="mt-1 text-xs text-[#E2E2E2]/70 leading-relaxed">{rec.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {rec.productIds.map((pid) => {
                    const product = getProductById(pid);
                    return product ? (
                      <div key={pid} className="flex items-center gap-2.5 rounded-[2px] border border-white/10 bg-[#131314] p-2">
                        <img src={product.image} alt="" className="h-10 w-8 rounded-[2px] object-cover border border-white/10 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2]">{product.name}</span>
                          <p className="text-[10px] font-mono text-[#D4AF37]">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
                <p className="mt-3 text-xs uppercase tracking-wider text-[#E2E2E2]/60">
                  <span className="text-[#D4AF37]">Expected Impact:</span> {rec.expectedImpact}
                </p>
              </div>
              {rec.status === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <Button variant="ai" size="sm" onClick={() => handleApprove(rec.id)}>Authorize</Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(rec.id)}>Dismiss</Button>
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
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Agent Telemetry Stream</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">AI Buyer Activity</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Live feed of autonomous concierge searches, appraisals & transactions</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity: typeof activities[0]) => (
          <Card key={activity.id} padding="sm" className="border-white/[0.06] hover:border-[#D4AF37]/30 transition-all">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                  <Bot className="h-4 w-4 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="ai" className="capitalize text-[10px]">{activity.type}</Badge>
                    {activity.matchScore && <span className="text-[10px] font-mono text-[#D4AF37]">{activity.matchScore}% Style Match</span>}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2] mt-0.5">{activity.productName || activity.query}</p>
                  <p className="text-[10px] text-[#E2E2E2]/50 uppercase tracking-widest mt-0.5">{activity.timestamp.toLocaleString('en-IN')}</p>
                </div>
              </div>
              {activity.revenue && (
                <span className="font-mono text-sm font-bold text-emerald-400">+{formatPrice(activity.revenue)}</span>
              )}
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
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Immutable Records</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Audit Ledger</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Verifiable trace of autonomous decisions, policy approvals & actions</p>
      </div>

      <div className="overflow-x-auto rounded-[4px] border border-white/10 bg-[#131314]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-[#141417]">
            <tr>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Timestamp</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Event Logged</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Originating Actor</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Execution Status</th>
              <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E2E2E2]/70">Related Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {auditEvents.map((event: typeof auditEvents[0]) => (
              <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-[11px] font-mono text-[#E2E2E2]/60 whitespace-nowrap">{event.timestamp.toLocaleString('en-IN')}</td>
                <td className="p-4 font-semibold uppercase tracking-wider text-[#E2E2E2]">{event.event}</td>
                <td className="p-4"><Badge variant={event.actor.includes('AI') ? 'ai' : 'default'}>{event.actor}</Badge></td>
                <td className="p-4"><Badge variant={event.status === 'success' ? 'success' : 'default'}>{event.status}</Badge></td>
                <td className="p-4 font-mono text-[#D4AF37] text-[11px]">{event.relatedOrder || event.relatedProduct || '—'}</td>
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
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Atelier Configuration</span>
        <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Merchant Settings</h1>
        <p className="text-xs text-[#E2E2E2]/60 mt-1 uppercase tracking-[0.14em]">Atelier credentials, autonomous policy guardrails & environment</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
            Maison Atelier Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Maison Brand Name</label>
              <input defaultValue="AgentCart Haute Intelligence" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Command Center Email</label>
              <input defaultValue="atelier@agentcart.luxury" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
            Autonomous Agent Permissions
          </h3>
          <div className="space-y-3">
            {['Autonomous style appraisal recommendations', 'Auto-approve neural cross-sell bundles', 'AI Buyer real-time stock reservation'].map((label) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded-[2px] border-white/20 bg-[#131314] text-[#D4AF37] focus:ring-[#D4AF37]" />
                <span className="text-xs font-medium uppercase tracking-wider text-[#E2E2E2]">{label}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
            Visual Aesthetics Mode
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E2E2E2]">Interface Palette</span>
              <p className="text-[11px] text-[#E2E2E2]/60 mt-0.5">Currently optimized for Haute Noir & Liquid Platinum</p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? 'Switch to Dark Mode' : 'Toggle Theme'}
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E2E2E2] mb-4 pb-3 border-b border-white/[0.06]">
            Telemetry Dispatch
          </h3>
          <div className="space-y-3">
            {['Live AI Buyer transactions', 'High correlation recommendation alerts', 'Low atelier stock warnings'].map((label) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded-[2px] border-white/20 bg-[#131314] text-[#D4AF37] focus:ring-[#D4AF37]" />
                <span className="text-xs font-medium uppercase tracking-wider text-[#E2E2E2]">{label}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </MerchantLayout>
  );
}
