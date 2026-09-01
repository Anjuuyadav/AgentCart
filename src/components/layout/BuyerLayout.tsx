import { Link, useLocation } from 'react-router-dom';
import { Bot, ShoppingBag, ShoppingCart, Package, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { useApp } from '../../contexts/useApp';

const navLinks = [
  { to: '/buyer', label: 'AI Buyer', icon: Bot },
  { to: '/products', label: 'Products', icon: ShoppingBag },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/buyer/preferences', label: 'Preferences', icon: Settings },
];

export function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, cartCount } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal">
      <header className="sticky top-0 z-50 border-b border-border bg-ivory/95 backdrop-blur-sm dark:border-border-dark dark:bg-charcoal/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-violet-ai/10 text-violet-ai' : 'text-muted hover:text-charcoal dark:text-muted-light dark:hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                  {link.to === '/cart' && cartCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-ai text-xs text-white">{cartCount}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-charcoal/5 dark:hover:bg-white/5" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <Link to="/merchant" className="hidden text-sm font-medium text-muted hover:text-violet-ai md:block dark:text-muted-light">Merchant →</Link>
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-border px-4 py-4 md:hidden dark:border-border-dark">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center gap-2 py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                {link.label}
                {link.to === '/cart' && cartCount > 0 && ` (${cartCount})`}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
