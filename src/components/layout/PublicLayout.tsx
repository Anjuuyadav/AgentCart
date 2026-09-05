import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { Button } from '../ui/Button';

const navLinks = [
  { to: '/how-it-works', label: 'THE PROTOCOL' },
  { to: '/buyer', label: 'AI CONCIERGE' },
  { to: '/products', label: 'COLLECTION' },
  { to: '/merchant', label: 'COMMAND CENTER' },
  { to: '/pricing', label: 'MEMBERSHIP' },
  { to: '/about', label: 'MAISON' },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E5E2E3]">
      {/* Top Subtle Announcement Bar */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0E0E0F] px-4 py-1.5 text-center">
        <p className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9E9E9E]">
          <Sparkles className="h-3 w-3 text-[#D4AF37]" />
          <span>AUTONOMOUS COUTURE INTELLIGENCE · SPRING / SUMMER 2026</span>
          <span className="hidden sm:inline text-[#D4AF37]">· TEST MODE ACTIVE</span>
        </p>
      </div>

      {/* Luxury Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[#0B0B0C]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-8">
          <Logo size="sm" />

          {/* Desktop Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 text-[11px] font-medium tracking-[0.2em] transition-colors duration-200 ${
                    isActive ? 'text-[#D4AF37]' : 'text-[#9E9E9E] hover:text-[#E5E2E3]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-[21px] h-[1.5px] bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/buyer">
              <Button variant="ai" size="sm" className="gap-2">
                <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                <span>AI Concierge</span>
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="primary" size="sm">
                Shop Collection
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-[#E5E2E3] md:hidden cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div className="border-t border-[rgba(255,255,255,0.08)] bg-[#131314] px-6 py-6 md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5E2E3] hover:text-[#D4AF37]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3 border-t border-[rgba(255,255,255,0.08)]">
                <Link to="/buyer" onClick={() => setMobileOpen(false)}>
                  <Button variant="ai" className="w-full">
                    Try AI Concierge
                  </Button>
                </Link>
                <Link to="/merchant" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Command Center
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Luxury Editorial Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] pt-16 pb-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Brand Manifesto */}
            <div className="lg:col-span-4 space-y-4">
              <Logo size="md" />
              <p className="max-w-sm font-sans text-xs leading-relaxed text-[#9E9E9E]">
                Haute intelligence at the intersection of avant-garde fashion and autonomous AI commerce. Personal shopping concierges aligned with autonomous merchant intelligence.
              </p>
              <div className="pt-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span>Autonomous Node 01 · Live</span>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E5E2E3]">
                  Commerce Platform
                </h4>
                <div className="flex flex-col space-y-2.5 text-xs text-[#9E9E9E]">
                  <Link to="/buyer" className="transition-colors hover:text-[#D4AF37]">AI Stylist Concierge</Link>
                  <Link to="/products" className="transition-colors hover:text-[#D4AF37]">Curated Collection</Link>
                  <Link to="/merchant" className="transition-colors hover:text-[#D4AF37]">Merchant Command Center</Link>
                  <Link to="/how-it-works" className="transition-colors hover:text-[#D4AF37]">The Commerce Loop</Link>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E5E2E3]">
                  Maison & Atelier
                </h4>
                <div className="flex flex-col space-y-2.5 text-xs text-[#9E9E9E]">
                  <Link to="/about" className="transition-colors hover:text-[#D4AF37]">Design Manifesto</Link>
                  <Link to="/pricing" className="transition-colors hover:text-[#D4AF37]">Membership Tiers</Link>
                  <Link to="/contact" className="transition-colors hover:text-[#D4AF37]">Private Inquiries</Link>
                  <Link to="/faq" className="transition-colors hover:text-[#D4AF37]">Concierge FAQ</Link>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E5E2E3]">
                  Infrastructure
                </h4>
                <div className="flex flex-col space-y-2.5 text-xs text-[#9E9E9E]">
                  <Link to="/privacy" className="transition-colors hover:text-[#D4AF37]">Policy & Privacy</Link>
                  <Link to="/terms" className="transition-colors hover:text-[#D4AF37]">Terms of Protocol</Link>
                  <span className="text-[#737373] flex items-center gap-1">
                    <span>Razorpay Secured</span>
                    <ArrowRight className="h-3 w-3 text-[#D4AF37]" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Hairline & Legal */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.06)] pt-8 text-[11px] text-[#737373] sm:flex-row">
            <p className="tracking-[0.1em]">
              © 2026 AGENTCART MAISON TECHNOLOGIQUE. ALL RIGHTS RESERVED.
            </p>
            <p className="tracking-[0.16em] uppercase text-[#9E9E9E]">
              PARIS · NEW YORK · MILAN · TOKYO · MUMBAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
