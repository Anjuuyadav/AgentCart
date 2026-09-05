import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

const imageSizes = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-14 w-14',
};

export function Logo({ className = '', size = 'md', showWordmark = true }: LogoProps) {
  return (
    <Link to="/" className={`group flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`} aria-label="AgentCart luxury commerce">
      <div className="relative shrink-0 overflow-hidden rounded-[4px] border border-[rgba(212,175,55,0.35)] shadow-[0_0_15px_-3px_rgba(212,175,55,0.18)] transition-transform duration-300 group-hover:scale-105">
        <img
          src="/logo.jpg"
          alt="AgentCart Emblem"
          className={`${imageSizes[size]} object-cover`}
        />
      </div>
      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-sans text-sm font-semibold tracking-[0.24em] text-[#E5E2E3] transition-colors group-hover:text-[#D4AF37]">
            AGENTCART
          </span>
          <span className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#9E9E9E]">
            HAUTE INTELLIGENCE
          </span>
        </div>
      )}
    </Link>
  );
}
