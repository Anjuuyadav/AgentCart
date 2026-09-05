import { Link } from 'react-router-dom';
import { Bot, TrendingUp, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Card } from '../../components/ui/Card';

export function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="mb-14 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Autonomous Protocol</span>
          <h1 className="font-editorial text-4xl md:text-5xl italic text-[#E2E2E2] font-normal tracking-wide mt-2">
            The Haute Intelligence Cycle
          </h1>
          <p className="mt-3 text-xs md:text-sm text-[#E2E2E2]/60 uppercase tracking-[0.14em] max-w-2xl mx-auto">
            Decentralized neural agents aligning bespoke client taste with autonomous atelier fulfillment.
          </p>
        </div>

        <div className="space-y-8">
          <Card padding="lg" className="border-white/[0.08] hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <Bot className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Phase 01 · Client Synthesis</span>
                <h2 className="font-editorial text-2xl italic text-[#E2E2E2] mt-0.5 mb-2">Neural Stylist Concierge</h2>
                <p className="text-xs text-[#E2E2E2]/70 leading-relaxed">
                  The client communicates styling intent, gala dress codes, preferred silhouettes, or archival references in natural conversation. The AI Buyer extracts nuanced attributes, computes style match scores against the atelier catalog, and surfaces curated garments.
                </p>
                <Link to="/buyer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] hover:underline">
                  Initiate Styling Session <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="border-white/[0.08] hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-emerald-500/30 bg-emerald-950/20">
                <span className="font-mono text-base font-bold text-emerald-400">02</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Phase 02 · Verification</span>
                <h2 className="font-editorial text-2xl italic text-[#E2E2E2] mt-0.5 mb-2">Autonomous Purchase Policy Clearance</h2>
                <p className="text-xs text-[#E2E2E2]/70 leading-relaxed">
                  Before transaction commitment, AgentCart evaluates multi-vector purchase policies: client budget constraints, atelier inventory depth, and merchant authentication. Approved acquisitions settle securely via the 256-bit encrypted Razorpay sandbox protocol.
                </p>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="border-white/[0.08] hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <TrendingUp className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Phase 03 · Maison Yield</span>
                <h2 className="font-editorial text-2xl italic text-[#E2E2E2] mt-0.5 mb-2">AI Merchant Command Telemetry</h2>
                <p className="text-xs text-[#E2E2E2]/70 leading-relaxed">
                  Every acquisition enriches the merchant neural graph. The AI Revenue Agent synthesizes cross-silhouette affinities, detects real-time demand spikes, and recommends high-yield capsule bundles to continually elevate atelier margins.
                </p>
                <Link to="/merchant" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] hover:underline">
                  Inspect Command Telemetry <ArrowRight className="h-3.5 w-3.5" />
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
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Maison Manifesto</span>
        <h1 className="font-editorial text-4xl md:text-5xl italic text-[#E2E2E2] font-normal tracking-wide mt-2 mb-6">
          Architects of Autonomous Luxury
        </h1>
        <p className="text-sm md:text-base text-[#E2E2E2]/80 leading-relaxed mb-8 font-light">
          AgentCart sits at the intersection of Parisian Haute Couture editorial prestige and autonomous artificial intelligence. We bridge client desire with atelier craftsmanship through bilateral neural agents.
        </p>
        <div className="space-y-6 text-xs md:text-sm text-[#E2E2E2]/70 leading-relaxed">
          <p>
            Traditional e-commerce reduces luxury fashion to passive search grids and static filtering. AgentCart replaces this with a bespoke AI Stylist Concierge that understands draping, occasions, silhouette harmony, and client taste profiles.
          </p>
          <p>
            On the supply side, our AI Merchant Command Center empowers fashion houses with autonomous revenue agents that analyze micro-trends, coordinate companion pieces, and clear purchase policies in fractions of a second.
          </p>
          <p>
            Engineered with uncompromising aesthetic rigor — deep obsidian surfaces, liquid platinum contrast, champagne gold accents, and zero artificial latency.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function PricingPage() {
  const plans = [
    { name: 'Private Atelier', price: 'Complimentary', desc: 'Curated evaluation tier for demonstration', features: ['AI Stylist Concierge access', 'Full archival catalog', 'Telemetry analytics', 'Razorpay Sandbox settlement'] },
    { name: 'Maison Growth', price: '₹4,999 / mo', desc: 'For independent couture labels and design houses', features: ['Everything in Atelier', 'AI Revenue Yield Agent', 'Autonomous bundle proposals', 'Real-time agent stream', 'Priority concierge lane'], popular: true },
    { name: 'Haute Enterprise', price: 'Bespoke', desc: 'For global luxury syndicates and fashion conglomerates', features: ['Everything in Growth', 'Custom fine-tuned style models', 'Dedicated atelier engineer', 'SLA guaranteed latency', 'Full autonomous API gateway'] },
  ];

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-14 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Atelier Membership</span>
          <h1 className="font-editorial text-4xl md:text-5xl italic text-[#E2E2E2] font-normal tracking-wide mt-2">
            Transparent Acquisition Tiers
          </h1>
          <p className="mt-3 text-xs md:text-sm text-[#E2E2E2]/60 uppercase tracking-[0.14em]">
            Select the autonomous infrastructure tailored to your atelier volume
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} padding="lg" className={`flex flex-col justify-between ${plan.popular ? 'border-[#D4AF37]/50 bg-[#D4AF37]/[0.02] shadow-[0_0_30px_rgba(212,175,55,0.08)]' : 'border-white/[0.08]'}`}>
              <div>
                {plan.popular && (
                  <span className="mb-4 inline-block rounded-[2px] bg-[#D4AF37] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0B0B0C]">
                    Preferred Atelier
                  </span>
                )}
                <h3 className="font-editorial text-xl italic text-[#E2E2E2]">{plan.name}</h3>
                <p className="mt-1 text-xs text-[#E2E2E2]/60">{plan.desc}</p>
                <p className="my-5 font-mono text-2xl md:text-3xl font-bold text-[#D4AF37]">{plan.price}</p>
                <ul className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#E2E2E2]/80">
                      <span className="text-[#D4AF37] font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/signup" className="mt-8">
                <button className={`w-full rounded-[4px] py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${plan.popular ? 'bg-[#D4AF37] text-[#0B0B0C] hover:bg-[#E5C158]' : 'border border-white/20 bg-transparent text-[#E2E2E2] hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}>
                  Select Tier
                </button>
              </Link>
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
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Private Concierge</span>
        <h1 className="font-editorial text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-2 mb-2">Direct Inquiries</h1>
        <p className="mb-8 text-xs text-[#E2E2E2]/60 uppercase tracking-[0.14em]">Our concierge team responds to private commissions within 24 hours.</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Full Name</label>
            <input type="text" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" placeholder="Priya Sharma" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Contact Email</label>
            <input type="email" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" placeholder="priya@agentcart.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Commission Inquiry</label>
            <textarea rows={4} className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 resize-none" placeholder="Describe requirements, sizing inquiry or partnership proposal..." />
          </div>
          <button type="submit" className="w-full rounded-[4px] bg-[#D4AF37] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] hover:bg-[#E5C158] transition-colors">
            Transmit Inquiry
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}

export function FAQPage() {
  const faqs = [
    { q: 'What is AgentCart Haute Intelligence?', a: 'AgentCart is a luxury autonomous commerce engine that bridges AI Buyers (intelligent styling concierges) with AI Merchants (revenue yield optimization agents).' },
    { q: 'How does the AI Stylist Concierge personalize recommendations?', a: 'By analyzing your natural language brief—occasion, silhouette affinities, preferred tones, and sizing—the concierge calculates real-time style match percentages against our curated archival pieces.' },
    { q: 'Is live currency charged in this demonstration?', a: 'No. The platform is configured in Razorpay Test Sandbox mode. All authorizations and simulated transactions verify end-to-end telemetry without live billing.' },
    { q: 'How does the AI Revenue Agent benefit fashion labels?', a: 'It acts as an autonomous merchandising strategist, calculating cross-silhouette pairing correlations, detecting purchasing velocity, and proposing algorithmic revenue bundles.' },
  ];

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Intelligence Dossier</span>
        <h1 className="font-editorial text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-2 mb-10">Frequently Addressed Inquiries</h1>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-white/[0.08] pb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E2E2E2] mb-2">{faq.q}</h3>
              <p className="text-xs text-[#E2E2E2]/70 leading-relaxed">{faq.a}</p>
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
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Legal & Confidentiality</span>
        <h1 className="font-editorial text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-2 mb-8">Privacy Protocol</h1>
        <div className="space-y-4 text-xs text-[#E2E2E2]/70 leading-relaxed">
          <p>AgentCart maintains absolute confidentiality of client styling parameters and order records. In this demonstration prototype, state is preserved locally within your private browser environment.</p>
          <p>No biometric measurements, confidential cardholder details, or client communications are sold or routed to unauthorized third-party trackers.</p>
          <p>Production deployments enforce zero-knowledge policy verification for client purchasing limits.</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function TermsPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Platform Governance</span>
        <h1 className="font-editorial text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-2 mb-8">Terms of Atelier Service</h1>
        <div className="space-y-4 text-xs text-[#E2E2E2]/70 leading-relaxed">
          <p>Accessing the AgentCart platform constitutes consent to autonomous agent interactions and algorithmic catalog appraisals.</p>
          <p>All settlements operate under simulated Razorpay Sandbox protocols. No financial liabilities or physical deliveries are bound to demo test transactions.</p>
          <p>All editorial garment imagery, brand marks, and software architecture remain the intellectual property of AgentCart.</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function LoginPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Client Authentication</span>
          <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Atelier Access</h1>
          <p className="text-xs text-[#E2E2E2]/60 uppercase tracking-[0.14em] mt-1">Authenticate to access your private concierge graph</p>
        </div>
        <Card padding="lg" className="border-white/[0.08]">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Email Address</label>
              <input type="email" defaultValue="priya.sharma@email.com" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" placeholder="client@agentcart.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Security Cipher</label>
              <input type="password" defaultValue="••••••••••••" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" placeholder="••••••••" />
            </div>
            <Link to="/buyer" className="block pt-2">
              <button type="button" className="w-full rounded-[4px] bg-[#D4AF37] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] hover:bg-[#E5C158] transition-colors">
                Authorize Session
              </button>
            </Link>
          </form>
        </Card>
        <p className="mt-6 text-center text-xs uppercase tracking-wider text-[#E2E2E2]/60">
          Unregistered client? <Link to="/signup" className="text-[#D4AF37] hover:underline font-semibold ml-1">Create Atelier Profile</Link>
        </p>
      </div>
    </PublicLayout>
  );
}

export function SignupPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Haute Membership</span>
          <h1 className="font-editorial text-3xl md:text-4xl italic text-[#E2E2E2] font-normal tracking-wide mt-1">Create Profile</h1>
          <p className="text-xs text-[#E2E2E2]/60 uppercase tracking-[0.14em] mt-1">Join the AgentCart autonomous fashion collective</p>
        </div>
        <Card padding="lg" className="border-white/[0.08]">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Full Legal Name</label>
              <input type="text" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" placeholder="Priya Sharma" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Contact Email</label>
              <input type="email" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" placeholder="priya@agentcart.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E2E2E2]/70">Security Cipher</label>
              <input type="password" className="w-full rounded-[4px] border border-white/10 bg-[#131314] px-4 py-3 text-sm text-[#E2E2E2] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30" placeholder="••••••••" />
            </div>
            <Link to="/buyer" className="block pt-2">
              <button type="button" className="w-full rounded-[4px] bg-[#D4AF37] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] hover:bg-[#E5C158] transition-colors">
                Initialize Membership
              </button>
            </Link>
          </form>
        </Card>
        <p className="mt-6 text-center text-xs uppercase tracking-wider text-[#E2E2E2]/60">
          Already registered? <Link to="/login" className="text-[#D4AF37] hover:underline font-semibold ml-1">Authenticate Session</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
