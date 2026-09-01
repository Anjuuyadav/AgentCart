import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
};

export function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center ${className}`} aria-label="AgentCart home">
      <img
        src="/logo.jpg"
        alt="AgentCart — AI-Powered Fashion Commerce"
        className={`${sizes[size]} rounded-xl object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/10`}
      />
    </Link>
  );
}
