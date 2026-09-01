import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { ArrowDown, ArrowRight, Bot, Sparkles, Shield, TrendingUp, Zap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProductGrid } from '../../components/product/ProductCard';
import { products } from '../../data/mockData';

export function LandingPage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <PublicLayout>
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <img
            src="/logo.jpg"
            alt="AgentCart"
            className="mx-auto mb-8 h-28 w-28 rounded-3xl object-cover shadow-lg ring-1 ring-black/10 dark:ring-white/10 sm:h-36 sm:w-36"
          />
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-violet-ai">AI-Native Commerce</p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl lg:text-6xl dark:text-white">
            Meet <span className="text-violet-ai">AgentCart</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted dark:text-muted-light">
            AI that helps customers buy and merchants grow revenue. One platform connecting both sides of commerce.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/buyer"><Button variant="ai" size="lg">Try AI Buyer <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/merchant"><Button variant="outline" size="lg">Explore AI Merchant</Button></Link>
          </div>

          {/* Loop visualization */}
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4">
            <div className="flex w-full items-center justify-center rounded-xl border border-violet-ai/20 bg-violet-ai-muted/30 px-6 py-4 dark:bg-violet-ai/10">
              <Bot className="mr-2 h-5 w-5 text-violet-ai" />
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-violet-ai">AI Buyer</p>
                <p className="text-sm font-medium">"Help me buy."</p>
              </div>
            </div>
            <ArrowDown className="h-5 w-5 text-violet-ai animate-pulse-soft" />
            <div className="flex w-full items-center justify-center rounded-xl border-2 border-violet-ai bg-violet-ai px-6 py-4 text-white">
              <Sparkles className="mr-2 h-5 w-5" />
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">AgentCart</p>
                <p className="text-sm font-semibold">Connects both sides.</p>
              </div>
            </div>
            <ArrowDown className="h-5 w-5 text-violet-ai animate-pulse-soft" />
            <div className="flex w-full items-center justify-center rounded-xl border border-violet-ai/20 bg-violet-ai-muted/30 px-6 py-4 dark:bg-violet-ai/10">
              <TrendingUp className="mr-2 h-5 w-5 text-violet-ai" />
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-violet-ai">AI Merchant</p>
                <p className="text-sm font-medium">"Help me sell."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-surface px-4 py-20 dark:border-border-dark dark:bg-surface-dark sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-charcoal dark:text-white">How It Works</h2>
            <p className="mt-3 text-muted dark:text-muted-light">The AI-native commerce loop in action</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Bot, title: 'AI Buyer Discovers', desc: 'Customers describe what they need in natural language. AI understands requirements and finds perfect matches.' },
              { icon: Shield, title: 'Secure Transaction', desc: 'Purchase policies are evaluated. Authorized transactions complete via Razorpay with full transparency.' },
              { icon: TrendingUp, title: 'AI Merchant Optimizes', desc: 'Merchants receive AI insights on cross-sells, upsells, and revenue opportunities from every transaction.' },
            ].map((item) => (
              <Card key={item.title} hover>
                <item.icon className="mb-4 h-8 w-8 text-violet-ai" />
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted dark:text-muted-light">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commerce Loop */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">The Commerce Loop</h2>
            <p className="mt-3 text-muted dark:text-muted-light">Every transaction makes the platform smarter</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            {['Customer', 'AI Buyer', 'Discover', 'Compare', 'Select', 'Purchase Policy', 'Razorpay', 'Order', 'Merchant Revenue', 'AI Merchant', 'Analyze', 'Recommend', 'More Sales'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className={`rounded-full px-4 py-2 ${i === 0 || i === 9 ? 'bg-violet-ai text-white' : 'border border-border bg-surface dark:border-border-dark dark:bg-surface-dark'}`}>{step}</span>
                {i < 12 && <ArrowRight className="h-4 w-4 text-muted" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Discovery */}
      <section className="border-y border-border bg-surface px-4 py-20 dark:border-border-dark dark:bg-surface-dark sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Premium Fashion</h2>
              <p className="mt-3 text-muted dark:text-muted-light">Curated collection with AI-powered matching</p>
            </div>
            <Link to="/products"><Button variant="outline">View All</Button></Link>
          </div>
          <ProductGrid products={featuredProducts} showAiMatch />
        </div>
      </section>

      {/* Razorpay */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-violet-ai" />
          <h2 className="mb-4 text-3xl font-bold">Secure by Razorpay</h2>
          <p className="text-muted dark:text-muted-light">
            Every transaction is protected with enterprise-grade payment infrastructure. Test mode enabled for seamless demo experience.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-charcoal px-4 py-20 text-white sm:px-6 lg:px-8 dark:bg-surface-elevated-dark">
        <div className="mx-auto max-w-3xl text-center">
          <Zap className="mx-auto mb-4 h-10 w-10 text-violet-ai-light" />
          <h2 className="mb-4 text-3xl font-bold">Ready to experience AI-native commerce?</h2>
          <p className="mb-8 text-white/70">Start with AI Buyer or explore the merchant dashboard.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/buyer"><Button variant="ai" size="lg">Try AI Buyer</Button></Link>
            <Link to="/merchant"><Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">Explore AI Merchant</Button></Link>
          </div>
        </div>
      </section>
    </div>
    </PublicLayout>
  );
}
