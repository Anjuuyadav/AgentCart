import { Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AIStatusProps {
  status: 'idle' | 'thinking' | 'complete' | 'error';
  label?: string;
}

export function AIStatus({ status, label }: AIStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-2.5 text-xs tracking-wide">
      {status === 'thinking' && (
        <div className="flex items-center gap-2.5 rounded-[4px] border border-[rgba(212,175,55,0.3)] bg-[#17171B]/90 px-3.5 py-2 shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" />
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#D4AF37] animate-pulse-soft">
            {label || 'Concierge analyzing catalog...'}
          </span>
        </div>
      )}
      {status === 'complete' && (
        <div className="flex items-center gap-2 rounded-[4px] border border-[rgba(212,175,55,0.35)] bg-[#17171B] px-3.5 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#E2E2E2]">
            {label || 'Curation curated'}
          </span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-[4px] border border-rose-500/30 bg-rose-950/30 px-3.5 py-1.5 text-rose-300">
          <span className="font-sans text-[11px] tracking-wide">{label || 'Concierge service interruption'}</span>
        </div>
      )}
    </div>
  );
}

export function AIBadge({ children }: { children?: React.ReactNode }) {
  return (
    <Badge variant="ai">
      <Sparkles className="h-2.5 w-2.5 text-[#D4AF37]" />
      {children || 'AI Curation'}
    </Badge>
  );
}

export function AIMatchScore({ score }: { score: number }) {
  const isHigh = score >= 90;
  return (
    <div className="flex items-center gap-2 rounded-[3px] border border-[rgba(212,175,55,0.25)] bg-[#141417] px-2.5 py-1">
      <Sparkles className="h-3 w-3 text-[#D4AF37]" />
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9E9E9E]">Style Match</span>
        <span className={`text-xs font-bold ${isHigh ? 'text-[#D4AF37]' : 'text-[#E2E2E2]'}`}>
          {score}%
        </span>
      </div>
    </div>
  );
}

export function AIInsightCard({ title, description, impact }: { title: string; description: string; impact?: string }) {
  return (
    <div className="relative overflow-hidden rounded-[4px] border border-[rgba(212,175,55,0.3)] bg-gradient-to-br from-[#1A1A1E] via-[#141417] to-[#0E0E0F] p-4 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)] transition-all duration-300 hover:border-[rgba(212,175,55,0.5)]">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#D4AF37]/10 text-[#D4AF37]">
            <Sparkles className="h-3 w-3" />
          </div>
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">{title}</span>
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9E9E9E]">Agent Intel</span>
      </div>
      <p className="font-sans text-xs leading-relaxed text-[#E5E2E3]/90">{description}</p>
      {impact && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-[2px] border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#E9C349]">
          <span>Revenue Vector:</span>
          <span className="font-semibold">{impact}</span>
        </div>
      )}
    </div>
  );
}
