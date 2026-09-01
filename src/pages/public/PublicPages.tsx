import { Link } from 'react-router-dom';
import { Bot, TrendingUp, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Card } from '../../components/ui/Card';

export function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold">How AgentCart Works</h1>
        <p className="mb-12 text-lg text-muted dark:text-muted-light">
          AgentCart connects AI Buyers and AI Merchants to create an intelligent commerce loop.
        </p>

        <div className="space-y-8">
          <Card padding="lg">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-ai/10">
                <Bot className="h-6 w-6 text-violet-ai" />
              </div>
              <div>
                <h2 className="mb-2 text-xl font-semibold">1. AI Buyer Understands</h2>
                <p className="text-muted dark:text-muted-light">
                  Customers describe what they need in natural language. The AI Buyer extracts requirements like occasion, budget, size, and color, then searches the catalog for the best matches with confidence scores.
                </p>
                <Link to="/buyer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-ai hover:underline">
                  Try AI Buyer <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                <span className="text-lg font-bold text-success">✓</span>
              </div>
              <div>
                <h2 className="mb-2 text-xl font-semibold">2. Purchase Policy & Payment</h2>
                <p className="text-muted dark:text-muted-light">
                  Before checkout, AgentCart evaluates purchase policies — budget limits, availability, size, and merchant trust. Approved purchases complete via Razorpay test mode with full order tracking.
                </p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-ai/10">
                <TrendingUp className="h-6 w-6 text-violet-ai" />
              </div>
              <div>
                <h2 className="mb-2 text-xl font-semibold">3. AI Merchant Optimizes</h2>
                <p className="text-muted dark:text-muted-light">
                  Every order feeds the AI Merchant with data. It detects cross-sell opportunities, customer patterns, and generates revenue recommendations — creating a smarter loop for the next customer.
                </p>
                <Link to="/merchant" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-ai hover:underline">
                  Explore AI Merchant <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold">About AgentCart</h1>
        <p className="mb-6 text-lg text-muted dark:text-muted-light">
          AgentCart is an AI-native commerce platform where AI helps both sides of the transaction — the customer and the merchant.
        </p>
        <div className="space-y-4 text-muted dark:text-muted-light">
          <p>We believe the future of commerce isn't just about better search or better analytics — it's about connecting intelligent agents on both sides of every transaction.</p>
          <p>Our AI Buyer helps customers discover and purchase products through natural conversation. Our AI Merchant helps businesses optimize revenue through intelligent recommendations and insights.</p>
          <p>Built for the modern fashion commerce ecosystem with premium design, trustworthy payment infrastructure, and a seamless demo-ready experience.</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function PricingPage() {
  const plans = [
    { name: 'Starter', price: '₹0', desc: 'Perfect for hackathon demos', features: ['AI Buyer access', 'Up to 100 products', 'Basic analytics', 'Razorpay test mode'] },
    { name: 'Growth', price: '₹4,999/mo', desc: 'For growing merchants', features: ['Everything in Starter', 'AI Revenue Agent', 'Cross-sell recommendations', 'AI Buyer activity tracking', 'Priority support'], popular: true },
    { name: 'Enterprise', price: 'Custom', desc: 'For large fashion brands', features: ['Everything in Growth', 'Custom AI training', 'Dedicated account manager', 'SLA guarantee', 'API access'] },
  ];

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-muted dark:text-muted-light">Choose the plan that fits your commerce needs</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} padding="lg" className={plan.popular ? 'border-violet-ai ring-2 ring-violet-ai/20' : ''}>
              {plan.popular && <span className="mb-4 inline-block rounded-full bg-violet-ai px-3 py-1 text-xs font-medium text-white">Most Popular</span>}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted dark:text-muted-light">{plan.desc}</p>
              <p className="my-4 text-3xl font-bold">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="text-success">✓</span> {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

export function ContactPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="mb-8 text-muted dark:text-muted-light">Have questions? We'd love to hear from you.</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input type="text" className="w-full rounded-lg border border-border bg-surface px-4 py-2 dark:border-border-dark dark:bg-surface-dark" placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" className="w-full rounded-lg border border-border bg-surface px-4 py-2 dark:border-border-dark dark:bg-surface-dark" placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea rows={4} className="w-full rounded-lg border border-border bg-surface px-4 py-2 dark:border-border-dark dark:bg-surface-dark" placeholder="How can we help?" />
          </div>
          <button type="submit" className="rounded-lg bg-violet-ai px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-ai-light">Send Message</button>
        </form>
      </div>
    </PublicLayout>
  );
}

export function FAQPage() {
  const faqs = [
    { q: 'What is AgentCart?', a: 'AgentCart is an AI-native commerce platform connecting AI Buyers (shopping agents) with AI Merchants (revenue optimization agents).' },
    { q: 'How does AI Buyer work?', a: 'Describe what you need in natural language. AI Buyer extracts requirements, searches products, and recommends matches with confidence scores.' },
    { q: 'Is payment real?', a: 'This demo uses Razorpay test mode. No real charges are made during the hackathon demonstration.' },
    { q: 'How does AI Merchant help?', a: 'AI Merchant analyzes sales data, detects cross-sell and upsell opportunities, and generates revenue recommendations.' },
  ];

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-border pb-6 dark:border-border-dark">
              <h3 className="mb-2 text-lg font-semibold">{faq.q}</h3>
              <p className="text-muted dark:text-muted-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

export function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <div className="prose space-y-4 text-muted dark:text-muted-light">
          <p>AgentCart respects your privacy. This demo application stores data locally in your browser for demonstration purposes only.</p>
          <p>We do not collect, store, or transmit personal data to external servers in this prototype version.</p>
          <p>For production deployment, a comprehensive privacy policy will be implemented compliant with applicable data protection regulations.</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function TermsPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <div className="space-y-4 text-muted dark:text-muted-light">
          <p>By using AgentCart demo, you agree to these terms. This is a prototype application for demonstration purposes.</p>
          <p>All transactions are simulated using Razorpay test mode. No real financial transactions occur.</p>
          <p>Product data, analytics, and AI responses are simulated for hackathon demonstration.</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function LoginPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
        <p className="mb-8 text-muted dark:text-muted-light">Sign in to your AgentCart account</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" placeholder="••••••••" />
          </div>
          <Link to="/buyer"><button type="button" className="w-full rounded-lg bg-violet-ai py-2.5 text-sm font-medium text-white hover:bg-violet-ai-light">Sign In</button></Link>
        </form>
        <p className="mt-6 text-center text-sm text-muted dark:text-muted-light">
          Don't have an account? <Link to="/signup" className="font-medium text-violet-ai hover:underline">Sign up</Link>
        </p>
      </div>
    </PublicLayout>
  );
}

export function SignupPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold">Create account</h1>
        <p className="mb-8 text-muted dark:text-muted-light">Join AgentCart today</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input type="text" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" placeholder="Priya Sharma" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark" placeholder="••••••••" />
          </div>
          <Link to="/buyer"><button type="button" className="w-full rounded-lg bg-violet-ai py-2.5 text-sm font-medium text-white hover:bg-violet-ai-light">Create Account</button></Link>
        </form>
        <p className="mt-6 text-center text-sm text-muted dark:text-muted-light">
          Already have an account? <Link to="/login" className="font-medium text-violet-ai hover:underline">Sign in</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
