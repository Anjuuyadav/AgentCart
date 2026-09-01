import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { useApp } from '../../contexts/useApp';

const navLinks = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/buyer', label: 'AI Buyer' },
  { to: '/merchant', label: 'AI Merchant' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useApp();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal">
      <header className="sticky top-0 z-50 border-b border-border bg-ivory/95 backdrop-blur-sm dark:border-border-dark dark:bg-charcoal/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-violet-ai ${location.pathname === link.to ? 'text-violet-ai' : 'text-muted dark:text-muted-light'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-charcoal/5 dark:hover:bg-white/5" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/buyer"><Button variant="ai" size="sm">Try AI Buyer</Button></Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-border px-4 py-4 md:hidden dark:border-border-dark">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/buyer" onClick={() => setMobileOpen(false)}><Button variant="ai" className="w-full">Try AI Buyer</Button></Link>
              <Link to="/merchant" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Explore AI Merchant</Button></Link>
            </div>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-surface dark:border-border-dark dark:bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo size="lg" />
              <p className="mt-4 text-sm text-muted dark:text-muted-light">AI-native commerce connecting buyers and merchants.</p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Product</h4>
              <div className="flex flex-col gap-2 text-sm text-muted dark:text-muted-light">
                <Link to="/how-it-works" className="hover:text-violet-ai">How It Works</Link>
                <Link to="/buyer" className="hover:text-violet-ai">AI Buyer</Link>
                <Link to="/merchant" className="hover:text-violet-ai">AI Merchant</Link>
                <Link to="/pricing" className="hover:text-violet-ai">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-muted dark:text-muted-light">
                <Link to="/about" className="hover:text-violet-ai">About</Link>
                <Link to="/contact" className="hover:text-violet-ai">Contact</Link>
                <Link to="/faq" className="hover:text-violet-ai">FAQ</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted dark:text-muted-light">
                <Link to="/privacy" className="hover:text-violet-ai">Privacy</Link>
                <Link to="/terms" className="hover:text-violet-ai">Terms</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted dark:border-border-dark dark:text-muted-light">
            © 2026 AgentCart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
