import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, BarChart3, Bot, Lightbulb,
  Activity, ClipboardList, Settings, Moon, Sun, Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { useApp } from '../../contexts/useApp';

const navLinks = [
  { to: '/merchant', label: 'Overview', icon: LayoutDashboard },
  { to: '/merchant/products', label: 'Products', icon: Package },
  { to: '/merchant/inventory', label: 'Inventory', icon: Boxes },
  { to: '/merchant/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/merchant/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/merchant/ai', label: 'AI Revenue Agent', icon: Bot },
  { to: '/merchant/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/merchant/ai-buyers', label: 'AI Buyer Activity', icon: Activity },
  { to: '/merchant/audit', label: 'Audit Trail', icon: ClipboardList },
  { to: '/merchant/settings', label: 'Settings', icon: Settings },
];

export function MerchantLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/merchant') return location.pathname === '/merchant';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal">
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-surface transition-transform dark:border-border-dark dark:bg-surface-dark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-16 items-center border-b border-border px-6 dark:border-border-dark">
            <Logo />
          </div>
          <nav className="space-y-1 p-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(link.to) ? 'bg-violet-ai/10 text-violet-ai' : 'text-muted hover:bg-charcoal/5 hover:text-charcoal dark:text-muted-light dark:hover:bg-white/5 dark:hover:text-white'}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Link to="/buyer" className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted hover:text-violet-ai dark:border-border-dark dark:text-muted-light">
              ← AI Buyer
            </Link>
          </div>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-ivory/95 px-4 backdrop-blur-sm dark:border-border-dark dark:bg-charcoal/95 lg:px-8">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-charcoal/5 dark:hover:bg-white/5" aria-label="Toggle theme">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
