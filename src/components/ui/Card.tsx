import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={`rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314]/90 backdrop-blur-md transition-all duration-300 ${paddings[padding]} ${
        hover
          ? 'hover:border-[rgba(212,175,55,0.35)] hover:shadow-[0_4px_30px_-8px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,175,55,0.12)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-5 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`font-serif text-lg font-medium tracking-wide text-[#E5E2E3] ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs tracking-wide text-[#9E9E9E] ${className}`}>{children}</p>;
}
