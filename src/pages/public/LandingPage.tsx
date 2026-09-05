import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { ArrowRight, Bot, Sparkles, Shield, TrendingUp, Cpu, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProductGrid } from '../../components/product/ProductCard';
import { products, FEATURED_PRODUCT_ID, formatPrice } from '../../data/mockData';

export function LandingPage() {
  const featuredProducts = products.slice(0, 4);
  const heroFeatured = products.find((p) => p.id === FEATURED_PRODUCT_ID) || products[0];

  return (
    <PublicLayout>
      <div className="relative overflow-hidden bg-[#0B0B0C]">
        {/* Ambient Subtle Specular Glow Backgrounds */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/[0.03] blur-[150px]" />

        {/* 1. CINEMATIC EDITORIAL HERO */}
        <section className="relative mx-auto max-w-[1440px] px-6 pt-12 pb-24 lg:px-8 lg:pt-20 lg:pb-32">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* LEFT: Editorial Narrative */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-[2px] border border-[rgba(212,175,55,0.3)] bg-[#17171B] px-3 py-1">
                <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
                  Autonomous Haute Couture · Spring 2026
                </span>
              </div>

              <h1 className="font-serif text-4xl font-normal leading-[1.12] tracking-tight text-[#E5E2E3] sm:text-5xl lg:text-6xl">
                Couture rigor, <br />
                <span className="italic font-light text-[#D4AF37]">telepathic</span> commerce.
              </h1>

              <p className="max-w-xl font-sans text-sm font-normal leading-relaxed text-[#9E9E9E] sm:text-base">
                AgentCart converges Parisian editorial curation with dual-sided AI intelligence. A bespoke personal shopping concierge for discerning buyers, tethered seamlessly to an autonomous revenue command center for luxury merchants.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to="/buyer">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Consult AI Concierge
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explore Collection
                  </Button>
                </Link>
              </div>

              {/* Metrics Micro-Strip */}
              <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-3 gap-6">
                <div>
                  <p className="font-serif text-2xl font-light text-[#E5E2E3]">94.8%</p>
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Style Fit Certainty</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-light text-[#D4AF37]">&lt; 400ms</p>
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Agent Synthesis</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-light text-[#E5E2E3]">100%</p>
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Policy Governed</p>
                </div>
              </div>
            </div>

            {/* RIGHT: High Fashion Visual with AI Telemetry Overlays */}
            <div className="relative lg:col-span-6 xl:col-span-7">
              <div className="relative mx-auto max-w-[540px] lg:max-w-none">
                {/* Main Hero Lookbook Image Frame */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)] bg-[#131314] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80"
                    alt="AgentCart Editorial Campaign"
                    className="h-full w-full object-cover object-top filter brightness-[0.92] contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/30" />

                  {/* AI Telemetry Overlay - Top Right */}
                  <div className="absolute top-5 right-5 z-20 flex items-center gap-2 rounded-[3px] border border-[rgba(212,175,55,0.35)] bg-[#0B0B0C]/85 px-3 py-1.5 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E5E2E3]">
                      AGENT CURATION #01
                    </span>
                  </div>

                  {/* Floating Garment Card Overlay - Bottom Left */}
                  {heroFeatured && (
                    <div className="absolute bottom-6 left-6 right-6 z-20 rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-[#131314]/90 p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] sm:left-6 sm:right-auto sm:max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={heroFeatured.image}
                          alt={heroFeatured.name}
                          className="h-14 w-11 rounded-[2px] object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                            CONCIERGE RECOMMENDED
                          </span>
                          <h4 className="font-serif text-xs font-medium text-white truncate">
                            {heroFeatured.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-semibold text-[#E2E2E2]">
                              {formatPrice(heroFeatured.price)}
                            </span>
                            <Badge variant="ai">Match {heroFeatured.aiMatchScore}%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtle Geometric Framing Accents */}
                <div className="pointer-events-none absolute -bottom-4 -right-4 h-full w-full rounded-[4px] border border-[rgba(212,175,55,0.18)] -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE COMMERCE LOOP: COUTURE ENGINE */}
        <section className="border-y border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] py-24">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center space-y-3 mb-16">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                THE DUAL-SIDED PROTOCOL
              </span>
              <h2 className="font-serif text-3xl font-light text-[#E5E2E3] sm:text-4xl">
                The Autonomous Commerce Loop
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#9E9E9E]">
                Traditional ecommerce separates shopping from inventory intelligence. AgentCart unites them into a self-reinforcing luxury feedback engine.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] p-8 transition-all duration-300 hover:border-[rgba(212,175,55,0.35)]">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-[3px] border border-[rgba(212,175,55,0.3)] bg-[#1C1B1C] text-[#D4AF37]">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E9E9E]">01 / BUYER INTELLIGENCE</span>
                <h3 className="mt-2 mb-3 font-serif text-xl font-medium text-[#E5E2E3]">Conversational Curation</h3>
                <p className="font-sans text-xs leading-relaxed text-[#9E9E9E]">
                  Clients converse naturally with the AI Concierge. High-dimensional understanding extracts aesthetics, occasion, sizing, and budgetary rules without tedious dropdown forms.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-[4px] border border-[rgba(212,175,55,0.35)] bg-gradient-to-b from-[#1C1B1C] to-[#131314] p-8 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)]">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-[3px] bg-[#D4AF37] text-[#0B0B0C]">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">02 / POLICY & ATELIER SYNCHRONY</span>
                <h3 className="mt-2 mb-3 font-serif text-xl font-medium text-white">Verified Autonomous Match</h3>
                <p className="font-sans text-xs leading-relaxed text-[#E5E2E3]/80">
                  Real-time stock validation, budget policy guardrails, and Razorpay test-mode transaction orchestration assure trust, privacy, and frictionless luxury acquisition.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] p-8 transition-all duration-300 hover:border-[rgba(212,175,55,0.35)]">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-[3px] border border-[rgba(212,175,55,0.3)] bg-[#1C1B1C] text-[#D4AF37]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E9E9E]">03 / MERCHANT COMMAND</span>
                <h3 className="mt-2 mb-3 font-serif text-xl font-medium text-[#E5E2E3]">Predictive Revenue Agent</h3>
                <p className="font-sans text-xs leading-relaxed text-[#9E9E9E]">
                  Every interaction streams into the Merchant Command Center. AI revenue agents identify cross-sell affinities, pricing anomalies, and emerging seasonal capsules automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CURATED CAPSULE COLLECTION */}
        <section className="py-24">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-6 sm:flex-row sm:items-end">
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                  ARCHIVAL DROPS
                </span>
                <h2 className="mt-1 font-serif text-3xl font-light text-[#E5E2E3] sm:text-4xl">
                  Curated Haute Capsule
                </h2>
              </div>
              <Link to="/products">
                <Button variant="outline" size="sm">
                  View Full Catalog ({products.length})
                </Button>
              </Link>
            </div>

            <ProductGrid products={featuredProducts} showAiMatch />
          </div>
        </section>

        {/* 4. ATELIER TRUST & PAYMENT ASSURANCE */}
        <section className="border-y border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] py-20">
          <div className="mx-auto max-w-4xl px-6 text-center space-y-6 lg:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] border border-[rgba(212,175,55,0.35)] bg-[#17171B] text-[#D4AF37] shadow-[0_0_20px_-5px_rgba(212,175,55,0.25)]">
              <Shield className="h-6 w-6" />
            </div>

            <h2 className="font-serif text-3xl font-light text-[#E5E2E3]">
              Atelier Grade Payment Architecture
            </h2>

            <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#9E9E9E] max-w-2xl mx-auto">
              Every purchase policy evaluation and financial settlement runs on enterprise-grade Razorpay payment rails. Complete transaction transparency, automated policy compliance, and sandboxed test execution.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373]">
              <span className="flex items-center gap-1.5 text-[#E2E2E2]">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                Zero Hallucination Checkout
              </span>
              <span className="flex items-center gap-1.5 text-[#E2E2E2]">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                Automated Policy Safeguards
              </span>
              <span className="flex items-center gap-1.5 text-[#E2E2E2]">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                End-to-End Cryptographic Signatures
              </span>
            </div>
          </div>
        </section>

        {/* 5. FINAL INVITATION CTA */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-3xl px-6 space-y-6">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              JOIN THE CONVERGENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#E5E2E3] leading-tight">
              Ready to experience autonomous commerce?
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#9E9E9E] max-w-md mx-auto">
              Begin your styling dialogue with the AI Concierge or monitor live store performance in the AI Command Center.
            </p>
            <div className="pt-4 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/buyer">
                <Button variant="primary" size="lg">
                  Launch AI Concierge
                </Button>
              </Link>
              <Link to="/merchant">
                <Button variant="secondary" size="lg">
                  Enter Command Center
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
