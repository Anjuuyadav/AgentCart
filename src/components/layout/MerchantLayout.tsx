import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, BarChart3, Bot, Lightbulb,
  Activity, ClipboardList, Settings, Menu, X, ArrowLeft, Radio
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';

const navLinks = [
  { to: '/merchant', label: 'TELEMETRY OVERVIEW', icon: LayoutDashboard },
  { to: '/merchant/products', label: 'CATALOG INVENTORY', icon: Package },
  { to: '/merchant/inventory', label: 'STOCK ALLOCATION', icon: Boxes },
  { to: '/merchant/orders', label: 'TRANSACTION STREAM', icon: ShoppingCart },
  { to: '/merchant/analytics', label: 'REVENUE ANALYTICS', icon: BarChart3 },
  { to: '/merchant/ai', label: 'AI REVENUE AGENT', icon: Bot },
  { to: '/merchant/recommendations', label: 'RECOMMENDATIONS', icon: Lightbulb },
  { to: '/merchant/ai-buyers', label: 'AI BUYER ACTIVITY', icon: Activity },
  { to: '/merchant/audit', label: 'SYSTEM AUDIT TRAIL', icon: ClipboardList },
  { to: '/merchant/settings', label: 'PROTOCOL SETTINGS', icon: Settings },
];

export function MerchantLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/merchant') return location.pathname === '/merchant';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#E5E2E3]">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo Header */}
          <div className="flex h-16 items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-6">
            <Logo size="sm" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-[#9E9E9E] hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Node Status Badge */}
          <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#131314]/60 px-6 py-2.5">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Radio className="h-2.5 w-2.5 animate-pulse text-[#D4AF37]" />
                Command Node Live
              </span>
              <span className="text-[#737373]">v2.4 Couture</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-[3px] px-3.5 py-2.5 text-[11px] font-medium tracking-[0.16em] transition-all duration-200 ${
                    active
                      ? 'bg-[#1C1B1C] text-[#D4AF37] border-l-2 border-[#D4AF37] shadow-[0_0_15px_-4px_rgba(212,175,55,0.2)]'
                      : 'text-[#9E9E9E] hover:bg-[#131314] hover:text-[#E5E2E3]'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-[#D4AF37]' : 'text-[#737373] group-hover:text-[#E2E2E2]'}`} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Switcher */}
          <div className="border-t border-[rgba(255,255,255,0.08)] p-4 bg-[#131314]/30">
            <Link
              to="/buyer"
              className="flex items-center justify-center gap-2 rounded-[3px] border border-[rgba(212,175,55,0.3)] bg-[#17171B] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0B0B0C]"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Switch to AI Concierge</span>
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Panel */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[#0B0B0C]/90 px-6 backdrop-blur-xl lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="p-1.5 text-[#E5E2E3] lg:hidden cursor-pointer"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open command sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="font-serif text-sm font-medium tracking-wider text-[#E5E2E3]">
                AI COMMERCE COMMAND CENTER
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-[3px] border border-[rgba(255,255,255,0.08)] bg-[#131314] px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-[#9E9E9E]">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>N8N WORKFLOW ACTIVE</span>
              </div>
            </div>
          </header>

          {/* Workspace Area */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1440px]">{children}</main>
        </div>
      </div>
    </div>
  );
}
