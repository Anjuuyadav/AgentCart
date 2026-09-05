import { Link, useLocation } from 'react-router-dom';
import { Bot, ShoppingBag, ShoppingCart, Package, Sliders, Menu, X, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { useApp } from '../../contexts/useApp';

const navLinks = [
  { to: '/buyer', label: 'AI CONCIERGE', icon: Bot },
  { to: '/products', label: 'COLLECTION', icon: ShoppingBag },
  { to: '/cart', label: 'SHOPPING BAG', icon: ShoppingCart },
  { to: '/orders', label: 'ORDERS ARCHIVE', icon: Package },
  { to: '/buyer/preferences', label: 'PREFERENCES', icon: Sliders },
];

export function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { cartCount } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E5E2E3]">
      {/* Editorial Luxury Header */}
      <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[#0B0B0C]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-8">
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || (link.to !== '/buyer' && location.pathname.startsWith(link.to + '/'));
              const isCart = link.to === '/cart';

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 py-1 text-[11px] font-medium tracking-[0.2em] transition-colors duration-200 ${
                    isActive ? 'text-[#D4AF37]' : 'text-[#9E9E9E] hover:text-[#E5E2E3]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#737373]'}`} />
                  <span>{link.label}</span>

                  {isCart && cartCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-[2px] bg-[#D4AF37] px-1 text-[9px] font-bold text-[#0B0B0C] shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                      {cartCount}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-[21px] h-[1.5px] bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Area */}
          <div className="flex items-center gap-4">
            <Link
              to="/merchant"
              className="hidden items-center gap-1 rounded-[3px] border border-[rgba(255,255,255,0.12)] bg-[#141417] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9E9E9E] transition-all hover:border-[rgba(212,175,55,0.4)] hover:text-[#D4AF37] md:flex"
            >
              <span>Command Center</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>

            <button
              className="p-2 text-[#E5E2E3] md:hidden cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="border-t border-[rgba(255,255,255,0.08)] bg-[#131314] px-6 py-6 md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#E5E2E3] hover:text-[#D4AF37]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-2.5">
                    <link.icon className="h-4 w-4 text-[#9E9E9E]" />
                    {link.label}
                  </span>
                  {link.to === '/cart' && cartCount > 0 && (
                    <span className="rounded-[2px] bg-[#D4AF37] px-1.5 py-0.5 text-[10px] font-bold text-[#0B0B0C]">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <Link
                  to="/merchant"
                  className="flex items-center justify-center gap-1.5 rounded-[3px] border border-[rgba(212,175,55,0.3)] bg-[#17171B] py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Merchant Command Center</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8">{children}</main>
    </div>
  );
}
