import { Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AIStatusProps {
  status: 'idle' | 'thinking' | 'complete' | 'error';
  label?: string;
}

export function AIStatus({ status, label }: AIStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'thinking' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-violet-ai" />
          <span className="text-muted dark:text-muted-light animate-pulse-soft">{label || 'AI is analyzing...'}</span>
        </>
      )}
      {status === 'complete' && (
        <>
          <Sparkles className="h-4 w-4 text-violet-ai" />
          <span className="text-success">{label || 'Analysis complete'}</span>
        </>
      )}
      {status === 'error' && (
        <span className="text-error">{label || 'Something went wrong'}</span>
      )}
    </div>
  );
}

export function AIBadge({ children }: { children?: React.ReactNode }) {
  return (
    <Badge variant="ai">
      <Sparkles className="h-3 w-3" />
      {children || 'AI Recommended'}
    </Badge>
  );
}

export function AIMatchScore({ score }: { score: number }) {
  const color = score >= 90 ? 'text-success' : score >= 75 ? 'text-violet-ai' : 'text-warning';
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium uppercase tracking-wider text-muted dark:text-muted-light">AI Match</span>
      <span className={`text-2xl font-bold ${color}`}>{score}%</span>
    </div>
  );
}

export function AIInsightCard({ title, description, impact }: { title: string; description: string; impact?: string }) {
  return (
    <div className="rounded-xl border border-violet-ai/20 bg-violet-ai-muted/50 p-4 dark:border-violet-ai/30 dark:bg-violet-ai/10">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-ai" />
        <span className="text-sm font-semibold text-violet-ai dark:text-violet-ai-light">{title}</span>
      </div>
      <p className="text-sm text-charcoal/80 dark:text-white/80">{description}</p>
      {impact && <p className="mt-2 text-xs font-medium text-violet-ai">{impact}</p>}
    </div>
  );
}
