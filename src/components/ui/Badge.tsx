import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'ai' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
}

const variants = {
  default: 'bg-charcoal/10 text-charcoal dark:bg-white/10 dark:text-white',
  ai: 'bg-violet-ai-muted text-violet-ai dark:bg-violet-ai/20 dark:text-violet-ai-light',
  success: 'bg-emerald-50 text-success dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-50 text-warning dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-50 text-error dark:bg-red-900/30 dark:text-red-400',
  outline: 'border border-border dark:border-border-dark text-muted',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
