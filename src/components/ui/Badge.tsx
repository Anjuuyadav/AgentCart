import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'ai' | 'gold' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
}

const variants = {
  default:
    'bg-[#1C1B1C] text-[#E2E2E2] border border-[rgba(255,255,255,0.08)]',
  ai:
    'bg-[#17171B] text-[#D4AF37] border border-[rgba(212,175,55,0.4)] shadow-[0_0_12px_-2px_rgba(212,175,55,0.2)]',
  gold:
    'bg-[#D4AF37] text-[#0B0B0C] font-semibold border border-[#E9C349]',
  success:
    'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30',
  warning:
    'bg-amber-950/40 text-amber-300 border border-amber-500/30',
  error:
    'bg-rose-950/40 text-rose-300 border border-rose-500/30',
  outline:
    'bg-transparent border border-[rgba(255,255,255,0.12)] text-[#9E9E9E]',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
