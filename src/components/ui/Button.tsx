import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ai';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'bg-[#D4AF37] text-[#0B0B0C] hover:bg-[#E5C358] active:bg-[#C29E2E] shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_-3px_rgba(212,175,55,0.45)] border border-[#E9C349]/40',
  secondary:
    'bg-[#1C1B1C] text-[#E2E2E2] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(212,175,55,0.5)] hover:text-white hover:bg-[#201F20]',
  outline:
    'bg-transparent text-[#E2E2E2] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(212,175,55,0.45)] hover:text-[#D4AF37]',
  ghost:
    'bg-transparent text-[#9E9E9E] hover:text-[#E5E2E3] hover:bg-white/[0.04]',
  ai:
    'relative bg-[#1A1A1E] text-[#E5E2E3] border border-[rgba(212,175,55,0.4)] shadow-[0_0_25px_-6px_rgba(212,175,55,0.25)] hover:border-[#D4AF37] hover:shadow-[0_0_35px_-4px_rgba(212,175,55,0.35)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-[11px] tracking-[0.14em]',
  md: 'px-5 py-2.5 text-xs tracking-[0.16em]',
  lg: 'px-7 py-3.5 text-xs tracking-[0.18em]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 rounded-[4px] font-medium uppercase transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
